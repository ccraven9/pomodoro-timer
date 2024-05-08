import "./style.css"; //import for esBuild bundle
const clockDisplay = document.getElementById('clock-display');
const timerBtn = document.getElementById('clock-button');
const pomStauts = document.getElementById('pom-status');
const pomCounterSpan = document.getElementById('pom-counter');
const pomReset = document.getElementById('reset-counter');
const addTaskBtn = document.getElementById('add-task-button');
const taskList = document.getElementById('task-list');

const DEFAULT_SECONDS = 60;
const DEFAULT_POMODORO = 19;
const DEFAULT_SHORT_BREAK = 4;
const DEFAULT_LONG_BREAK = 14;

let timerMinutes = DEFAULT_POMODORO;
let timerSeconds = DEFAULT_SECONDS;
let minutesPassed = 0;
let secondsPassed = 0;
let pomCounter = 1;
let onBreak = false;

let interval;
let startTime;
let currentTime;

timerBtn.addEventListener('click', () => activateTimer());
document.onkeydown = (e) => e.code === 'Space' ? activateTimer() : null;
pomReset.addEventListener('click', () => resetPomCounter());
addTaskBtn.addEventListener('click', () => addTaskListItem());

const activateTimer = () => {
    if (timerBtn.textContent === 'Start') {
        startTime = new Date();
        interval = setInterval(decrementTimer, 1000);
        timerBtn.textContent = 'Stop';
    } else {    //Set how much time has passed when the users stops the timer.
        [min, sec] = getTimeDifference();
        minutesPassed = min;
        secondsPassed = sec;
        resetInterval();
    }
}

/**
 * Subtracts the time that has passed since a user has pressed the start button, and displays it.
 */
const decrementTimer = () => {
    [min, sec] = getTimeDifference();
    if (timerMinutes - min <= -1 || (timerMinutes - min <= 0 && timerSeconds - sec <= 0)) {
        onBreak ? setPomodoro() : setBreak();
        return;
    }
    clockDisplay.innerText = (timerSeconds - sec <= 9) ? `${timerMinutes - min} : 0${timerSeconds - sec}` : `${timerMinutes - min} : ${timerSeconds - sec}`;
}

const resetInterval = () => {
    clearInterval(interval);
    timerBtn.textContent = 'Start';
}

const getTimeDifference = () => {
    currentTime = new Date();
    currentTime.setSeconds(currentTime.getSeconds() + secondsPassed);
    currentTime.setMinutes(currentTime.getMinutes() + minutesPassed);
    currentTime = currentTime - startTime;
    let seconds = Math.floor((currentTime / 1000)) % 60;
    let minutes = Math.floor((currentTime / 60000)) % 60;
    return [minutes, seconds];
}

const setTimer = (minutes) => {
    timerMinutes = minutes;
    timerSeconds = DEFAULT_SECONDS;
}

const setBreak = () => {
    if (pomCounter % 4 === 0) {
        setTimer(DEFAULT_LONG_BREAK);
        clockDisplay.innerText = '15 : 00';
    } else {
        setTimer(DEFAULT_SHORT_BREAK);
        clockDisplay.innerText = '5 : 00';
    }
    onBreak = true;
    pomStauts.innerText = "Relax, you're on a break!";
    pomCounter++;
    document.body.className = 'break-background';
    resetInterval();
}

const setPomodoro = () => {
    onBreak = false;
    setTimer(DEFAULT_POMODORO);
    clockDisplay.innerText = '20 : 00';
    pomStauts.innerText = 'Concentrate!';
    pomCounterSpan.innerText = ' ' + pomCounter;
    document.body.className = 'active-background';
    resetInterval();
}

const resetPomCounter = () => {
    console.log('reset');
    pomCounter = 1;
    pomCounterSpan.innerText = ' ' + pomCounter;
    clockDisplay.innerText = '20 : 00';
    resetInterval();
}

const addTaskListItem = () => {
//     var node=document.createElement("LI");
// var textnode=document.createTextNode(firstname);
// node.appendChild(textnode);
// document.getElementById("demo").appendChild(node);

    let listItem = document.createElement('li');
    let text = document.createTextNode('Test Task');
    listItem.appendChild(text);
    taskList.appendChild(listItem);
}
