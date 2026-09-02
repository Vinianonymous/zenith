// GLOBAL STOPWATCH
    // CYCLE ALARM
const alarm_audio = new Audio('alarm.mp3');
    //TODO: Find a way so user can configure this.
        // This involves finding a way to interface configure page with this setting.
const cycle_period = 15;

    // STOPWATCH HANDLING
        // The as HTMLPara... is used to specify to the TS that it is strictly such element.
const globalStopwatchLabel = document.getElementById('stopwatch-text') as HTMLParagraphElement;
let globalTime = {
    'hours':0,
    'minutes':0,
    'seconds':0
}

function HandleGlobalStopwatch() {
    setInterval(() => {
        globalTime.seconds ++;
        if (globalTime.seconds > 59) {
            globalTime.seconds = 0;
            globalTime.minutes ++;
        }

        if (globalTime.minutes > 59) {
            globalTime.minutes = 0;
            globalTime.hours ++;
        }
        let hour = String(globalTime.hours).padStart(2, "0");
        let minute = String(globalTime.minutes).padStart(2, "0");
        let second = String(globalTime.seconds).padStart(2, "0");
        
        globalStopwatchLabel.textContent = `${hour}:${minute}:${second}`;
        if (globalTime.minutes % cycle_period == 0 && globalTime.seconds == 0) {
            alarm_audio.play();
        }
    }, (1000));
}
HandleGlobalStopwatch();




// TASK HANDLING

const addTaskBtn = document.getElementById('add-task-button') as HTMLButtonElement;
addTaskBtn.addEventListener('click', () => {
    const dialog = document.getElementById('add-task-dialog') as HTMLDialogElement;
    dialog.showModal();
})