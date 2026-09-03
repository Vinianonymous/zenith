// SETTINGS HANDLING
type Settings = {
    cyclePeriod: number
}


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

type task = {
    name: string;
    completed: boolean;
    dueDate: string | null;
    description: string;
    id: string;
};
let tasks: task[] = [];

const taskList = document.getElementById('task-list') as HTMLDivElement;
function RenderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task) => {
        const taskItem = document.createElement('Task-item') as HTMLElement;
        taskItem.setAttribute('title', task.name);
        taskItem.setAttribute('completed', String(task.completed));
        if (task.dueDate) {
            taskItem.setAttribute('dueDate', task.dueDate);
        }
        taskItem.setAttribute('description', task.description);
        taskList.appendChild(taskItem);
    });
}

const addTaskBtn = document.getElementById(
    'add-task-button'
) as HTMLButtonElement;

const dialog = document.getElementById(
    'add-task-dialog'
) as HTMLDialogElement;

const form = document.getElementById(
    'add-task-form'
) as HTMLFormElement;


// Open dialog
addTaskBtn.addEventListener('click', () => {
    dialog.showModal();
});


// Handle form submission
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const task = {
        name: formData.get('task-title') as string,
        completed: false,
        dueDate: formData.get('task-due-date') as string | null,
        description: formData.get('task-description') as string,
        id: crypto.randomUUID()
    };

    console.log(task);

    // Here is where you actually USE the task
    tasks.push(task);
    RenderTasks();

    dialog.close();
    form.reset();
});

