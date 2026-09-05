// TASK HANDLING
import {getTasks, addTask, deleteTask} from "./api.js";
import { Task } from "./types.js";

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
let tasks: Task[] = [];
async function loadTasks() {
    tasks = await getTasks();
    RenderTasks();
}

loadTasks();

const taskItems = document.getElementById('task-items') as HTMLDivElement;
function createTaskElement(task: Task): HTMLElement {
    const taskItem = document.createElement('task-item') as HTMLElement;

    taskItem.setAttribute('title', task.name);
    if (task.dueDate) {
        taskItem.setAttribute('dueDate', task.dueDate);
    }
    taskItem.setAttribute('description', task.description);
    taskItem.setAttribute('id', task.id)
    return taskItem;
}

function RenderTasks() {
    taskItems.innerHTML = '';
    tasks.forEach((task: Task) => {
        taskItems.appendChild(createTaskElement(task));
    });
}

// Handle deletions dispatched by <task-item> elements.
// Removes only the single card (no full list re-render, no page reload).
taskItems.addEventListener('task-delete', async (event: Event) => {
    const customEvent = event as CustomEvent<{ id: string }>;
    const id = customEvent.detail.id;
    const index = tasks.findIndex((task: Task) => task.id === id);
    if (index === -1) {
        return;
    }

    const [removed] = tasks.splice(index, 1);
    const element = taskItems.querySelector(`task-item[id="${id}"]`);
    element?.remove();

    try {
        await deleteTask(id);
    } catch (error) {
        console.error('Failed to delete task, restoring it.', error);
        tasks.splice(index, 0, removed);
        RenderTasks();
    }
});


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
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const task = {
        name: formData.get('task-title') as string,
        dueDate: formData.get('task-due-date') as string,
        description: formData.get('task-description') as string,
        id: crypto.randomUUID()
    };

    console.log(task);

    // Persist first: only touch local state once the backend confirms.
    // Appends a single element instead of re-rendering the whole list.
    try {
        await addTask(task);
    } catch (error) {
        console.error('Failed to add task.', error);
        return;
    }
    tasks.push(task);
    taskItems.appendChild(createTaskElement(task));

    dialog.close();
    form.reset();
});

