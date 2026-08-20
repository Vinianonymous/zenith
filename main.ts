// GLOBAL STOPWATCH0
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
    }, (1000));
}
HandleGlobalStopwatch();

// TASK ELEMENT 
    // Export means other files can access 
    // Interface defines the shape of an object.
export interface TaskData {
    id: number;
    name: string;
    description: string;
    dueDate: Date;
    completed: boolean;
}
