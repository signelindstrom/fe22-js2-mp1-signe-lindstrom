
const nameBtn = document.querySelector('#submitName');
nameBtn.addEventListener('click', submitName);

const restart = document.querySelector('#restartBtn');
restart.style.display = 'none'

const gameDiv = document.querySelector('#gameDiv');
gameDiv.style.display = 'none';

const nameInput = document.querySelector('#userName');

// gets username + displays game div
function submitName(event) {
    event.preventDefault();
    const displayName = document.querySelector('#displayName')
    const displayComputer = document.querySelector('#displayComputer')

    // alert pop-up if name-input is empty
    if (nameInput.value == '') {
        alert('skriv in ditt namn för att du ska kunna spela!');
    }
    else {
        let userName = nameInput.value;
        displayName.innerText = `${userName} väljer...`;
        displayComputer.innerText = 'datorn väljer...'
        nameBtn.disabled = true;

        gameDiv.style.display = 'block';
    }

}


const btnRock = document.querySelector('#rock');
const btnScissor = document.querySelector('#scissor');
const btnPaper = document.querySelector('#paper');

let userPoints = 0;
let computerPoints = 0;

btnRock.addEventListener('click', game);
btnScissor.addEventListener('click', game);
btnPaper.addEventListener('click', game);


// game starts
function game(event) {
    const userChoice = document.querySelector('#userChoice');

    let userPicks = event.target.innerText;
    userChoice.innerText = userPicks;


    const computerChoice = document.querySelector('#computerChoice');
    let computerPicks = Math.round(Math.random() * 2);

    if (computerPicks == 0) {
        computerChoice.innerText = 'sten';
    }

    else if (computerPicks == 1) {
        computerChoice.innerText = 'sax';
    }

    else if (computerPicks == 2) {
        computerChoice.innerText = 'påse';
    }


    pointsCounter(computerPicks, userPicks);

    const points = document.querySelector('#pointsCounter');
    points.innerText = `${userPoints} - ${computerPoints}`;

    ifComputerScores(computerPoints);

}


// give points to winner of round
function pointsCounter(computerPicks, userPicks) {

    if (computerPicks == 0 && userPicks == 'sax' || computerPicks == 1 && userPicks == 'påse' || computerPicks == 2 && userPicks == 'sten') {
        computerPoints++;
    }

    else if (userPicks == 'sten' && computerPicks == 1 || userPicks == 'sax' && computerPicks == 2 || userPicks == 'påse' && computerPicks == 0) {
        userPoints++;
    }
}


// when computer scores, the game ends
function ifComputerScores(computerPoints) {

    if (computerPoints == 1) {
        const winAnnouncment = document.querySelector('#winAnnouncement');
        winAnnouncment.innerText = 'game over!';

        btnRock.disabled = true;
        btnScissor.disabled = true;
        btnPaper.disabled = true;
        restart.style.display = 'inline-block';

        getScore();
    }
}


// reloads to restart game
restart.addEventListener('click', restartGame)
function restartGame() {
    location.reload();
}


// firebase scoreboard
const baseUrl = 'https://fe22-js2-mp1-35103-default-rtdb.europe-west1.firebasedatabase.app/';
getAll();


// get user score
function getScore() {
    const newScore = {
        username: nameInput.value,
        score: userPoints
    }

    //compare with lowest score on board
    const url = baseUrl + 'highscore/4.json';
    fetch(url)
        .then(response => response.json())
        .then(compareScore)

    function compareScore(data) {
        if (newScore.score <= data.score) {
            console.log('did not make the scoreboard :(')
        }
        else {
            putScore(newScore).then(getAll);
        }
    }
}


// add to database
async function putScore(obj) {
    const url = baseUrl + 'highscore/4.json'

    const init = {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Content-type': "application/json; charset=UTF-8"
        }
    }

    const response = await fetch(url, init);
    const data = await response.json();
}


// read through database + sort data
async function getAll() {
    const url = baseUrl + 'highscore.json';

    const response = await fetch(url);
    const data = await response.json();

    const dataSort = data.sort(function (a, b) {
        return b.score - a.score;
    })

    putNewScore(dataSort);
}


// insert sorted data in database
async function putNewScore(obj) {
    const url = baseUrl + 'highscore.json'

    const init = {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Content-type': "application/json; charset=UTF-8"
        }
    }

    const response = await fetch(url, init);
    const data = await response.json();

    displayScore(data);
}


// show scoreboard
function displayScore(scores) {
    const div = document.querySelector('#scoreDiv');
    document.body.append(div);

    div.innerHTML = '';

    const scoreboardTitle = document.createElement('div');
    div.append(scoreboardTitle);
    scoreboardTitle.innerText = 'HIGHSCORE';

    scores.forEach(element => {
        const { username, score } = element;

        const scoreboard = document.createElement('div');
        div.append(scoreboard);
        scoreboard.innerText = username + ': ' + score;
    });
}
