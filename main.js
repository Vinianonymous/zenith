// GLOBAL STOPWATCH SECTION
// Global stopwatch element and variable
const globalStopwatch = document.getElementById('stopwatch-text');
let globalTime = {'hours':0, 'minutes':0, 'seconds':0};

function updateStopwatch(stopwatch_element) {
    globalTime.seconds ++;
    if (globalTime.seconds > 59) {
        globalTime.seconds = 0;
        globalTime.minutes ++;
    }
    if (globalTime.minutes >  59) {
        globalTime.minutes = 0;
        globalTime.hours ++;
    }

    // TEXT RENDERING
    let hour = String(globalTime['hours']).padStart(2, '0');
    let minute = String(globalTime['minutes']).padStart(2, '0');
    let second = String(globalTime['seconds']).padStart(2, '0');
    stopwatch_element.textContent = `Total Time: ${hour}:${minute}:${second}`;
}

// Global Stopwatch updating per second
setInterval(() => {
    updateStopwatch(globalStopwatch);
}, 1000);

// ADD TASK SECTION
const addTaskButton = document.getElementById('add-task-button');
addTaskButton.addEventListener('click', () => {
    console.log("I was clicked");
    //TODO: Implement a way to display a task addition and python backend for addition
});

