
import {getTasks, addTask, deleteTask, editTask} from "./services/api.js";
import { Task, Settings} from "./types/types.js";
import { loadSettings } from "./services/settings.js";
const settings:Settings = loadSettings();

const alarm_audio = new Audio(settings.cycleAlarmPath);
const ticking_audio = new Audio(settings.tickingSoundPath);


const globalStopwatchLabel = document.getElementById('stopwatch-text') as HTMLDivElement;
const resetGlobalStopwatchBtn = document.getElementById('reset-btn') as HTMLButtonElement;
let secondsElapsed = Number(localStorage.getItem('secondsElapsed')) ?? 0;

function renderTime() {
    const hour = String(Math.floor(secondsElapsed / 3600)).padStart(2, '0');
    const minute = String(Math.floor((secondsElapsed % 3600) / 60)).padStart(2, '0');
    const second = String(secondsElapsed % 60).padStart(2, '0');

    globalStopwatchLabel.textContent = `${hour}:${minute}:${second}`;
}

resetGlobalStopwatchBtn.addEventListener('click', ()=> {
    secondsElapsed = 0;
    localStorage.setItem('secondsElapsed', "0");
    renderTime();
})

let currentCycle = (Math.floor(secondsElapsed / 3600) / 60) / settings.cyclePeriod;

function HandleGlobalStopwatch() {

    setInterval(() => {
        secondsElapsed++;
        localStorage.setItem('secondsElapsed', String(secondsElapsed));
        renderTime();

        if (settings.tickingEnabled) {
            ticking_audio.play();
        }
        if (Math.floor((secondsElapsed % 3600) / 60)  % settings.cyclePeriod == 0 && secondsElapsed % 60 == 0) {
            console.log(`Cycle ${currentCycle} Completed!`);

            const cycleMessage = document.getElementById('cycle-message-dialog') as HTMLDialogElement;
            const messageDisplay = document.getElementById('message-container') as HTMLDivElement;
            const ackBtn = document.getElementById('ack-btn');


            messageDisplay.textContent = settings.cycleMessages[currentCycle];
            cycleMessage.showModal();
            ackBtn?.addEventListener('click', ()=> {
                cycleMessage.close();
            })
            alarm_audio.play();
            currentCycle++;
            if (currentCycle == settings.cycleMessages.length) {
                currentCycle = 0;
            }

        }
    }, (1000));
}

HandleGlobalStopwatch();

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
    taskItem.setAttribute('dueDate', task.dueDate);
    taskItem.setAttribute('description', task.description);

    taskItem.setAttribute('id', task.id)
    taskItem.setAttribute('timeSpent', String(task.timeSpent))
    return taskItem;
}

function RenderTasks() {

    console.log(tasks);
    taskItems.innerHTML = '';
    tasks.forEach((task: Task) => {
        taskItems.appendChild(createTaskElement(task));

    });
}

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

taskItems.addEventListener('task-edition', async (event: Event) => {
    const customEvent = event as CustomEvent<{ task: Task }>;
    const editedTask = customEvent.detail.task;

    const index = tasks.findIndex(
        (task: Task) => task.id === editedTask.id
    );

    if (index === -1) {
        return;
    }

    const oldTask = tasks[index];

    tasks[index] = editedTask;

    try {

        await editTask({
            newData: editedTask
        });

        const oldElement = taskItems.querySelector(
            `task-item[id="${editedTask.id}"]`
        );

        oldElement?.replaceWith(createTaskElement(editedTask));

    } catch (error) {
        console.error('Failed to edit task, restoring old task.', error);

        tasks[index] = oldTask;
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

addTaskBtn.addEventListener('click', () => {
    dialog.showModal();
});

form.addEventListener('submit', async (event) => {

    event.preventDefault();

    const formData = new FormData(form);

    const task = {
        name: formData.get('task-title') as string,
        dueDate: formData.get('task-due-date') as string,
        description: formData.get('task-description') as string,

        id: crypto.randomUUID(),
        timeSpent: 0
    };

    console.log(task);

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
