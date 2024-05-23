$(document).ready(function() {
    const $inputBox = $('#input-box'); // Syötekenttä
    const $listContainer = $('#list-container'); // Tehtävälistan säiliö
    const $todoApp = $('.todoapp'); // Sovelluksen pääelementti
    const $toggleButton = $('#toggle-button'); // Piilota/näytä nappi
    const $addButton = $('#add-button'); // "Lisää" nappi
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Luodaan tehtäväelementti jokaiselle tallennetulle tehtävälle
    tasks.forEach(task => {
        createTaskElement(task);
    });

    // Lisätään tapahtumankäsittelijä 
    $addButton.on('click', addTask); 

    // Lisätään tapahtumankäsittelijä
    $inputBox.on('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Lisätään tapahtumankäsittelijä
    $toggleButton.on('click', function(event) {
        event.stopPropagation();
        // Tarkistetaan onko tehtävälista näkyvissä
        if ($todoApp.is(':visible')) {
            // Jos näkyvissä, piilotetaan se ja päivitetään napin teksti
            $todoApp.slideUp();
            $toggleButton.text('Näytä tehtävälista');
        } else {
            // Jos piilotettu, näytetään se ja päivitetään napin teksti
            $todoApp.slideDown();
            $toggleButton.text('Piilota tehtävälista');
        }
    });

    // Funktio tehtävän lisäämiselle
    function addTask() {
        const taskText = $inputBox.val().trim();

        if (taskText === '') {
            showError('Tehtävä ei voi olla tyhjä');
            return;
        }
        if (taskText.length < 3) {
            alert('Tehtävän tulee olla vähintään 3 merkkiä pitkä');
            return;
        }

        // Luodaan uusi tehtäväobjekti
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        // Lisätään tehtävä taulukkoon ja luodaan sille tehtäväelementti
        tasks.push(task);
        createTaskElement(task);
        saveTasks();
        $inputBox.val('');
    }

    // Funktio tehtäväelementin luomiselle
    function createTaskElement(task) {
        const $li = $('<li>').attr('data-id', task.id).text(task.text);
        if (task.completed) {
            $li.addClass('checked');
        }
        // Lisätään tapahtumankäsittelijä tehtäväelementille
        $li.on('click', function() {
            task.completed = !task.completed;
            $li.toggleClass('checked');
            saveTasks();
        });

        // Luodaan poistamisnappi ja lisätään sille tapahtumankäsittelijä
        const $deleteSpan = $('<span>').text('Poista');
        $deleteSpan.on('click', function(event) {
            event.stopPropagation();
            $li.fadeOut(3000, function() {
                $li.remove();
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
            });
        });

        // Lisätään poistamisnappi tehtäväelementtiin ja lisätään tehtäväelementti tehtävälistan säilöön
        $li.append($deleteSpan);
        $listContainer.append($li.hide().slideDown(1500)); // Lisää efektejä käytetty "hide" ja "slidedown"
    }

    // Funktio virheviestin näyttämiselle
    function showError(message) {
        $inputBox.addClass('error');
        const $errorMessage = $('<div>').addClass('error-message').text(message);
        $inputBox.parent().append($errorMessage);
        setTimeout(() => {
            $inputBox.removeClass('error');
            $errorMessage.remove();
        }, 3000);
    }

    // Funktio taskien tallentamiselle
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
