// SETTINGS HANDLING
import { loadSettings } from "./settings.js";
const settings = loadSettings();
import { Stopwatch, Timer } from "./stopwatch.js";
// From 1000 lines in the other version to just this... I'm happy to rewrite zenith myself.stopwatch") as HTMLDivElement);
const globalSBackend = new Stopwatch();
globalSBackend.cycleEnabled = settings.cycleEnabled;
globalSBackend.cyclePeriod = settings.cyclePeriod;
const globalStopwatchLabel = document.getElementById("stopwatch");
const cycleDialog = document.getElementById("cycle-dialog");
const enterIC = document.getElementById("ic-btn");
let countingIC = false;
let inIC = false;
const timer = new Timer();
timer.secondsRemaining = settings.intercyclePeriod * 60;
const timerL = document.getElementById("ic-timer");
enterIC.addEventListener("click", () => {
    timerL.hidden = false;
    ack.textContent = "exit IC";
    if (globalSBackend.isCounting)
        globalSBackend.toggle(globalStopwatchLabel);
    if (!countingIC) {
        countingIC = true;
        timer.toggleCounting(timerL);
        enterIC.textContent = "Pause";
    }
    else {
        enterIC.textContent = "Resume";
        countingIC = false;
        timer.toggleCounting(timerL);
    }
});
const ack = document.getElementById("ack-btn");
ack.addEventListener("click", () => {
    cycleDialog.close();
    timerL.hidden = true;
    if (timer.isCounting)
        timer.toggleCounting(timerL);
    timer.secondsRemaining = settings.intercyclePeriod * 60;
    globalSBackend.toggle(globalStopwatchLabel);
    countingIC = false;
    ack.textContent = "Acknowledge";
    enterIC.textContent = "Enter Intercycle";
});
globalSBackend.toggle(globalStopwatchLabel);
let cycles = 0;
document.addEventListener("cycle", () => {
    globalSBackend.toggle(globalStopwatchLabel);
    cycleDialog.showModal();
    cycles++;
});
// TASK HANDLING
import { getTasks, newTask, updateTask, deleteTask } from "./api.js";
import "./task.js";
const addTaskBtn = document.getElementById("add-task-button");
const addTaskDialog = document.getElementById("add-task-dialog");
const taskList = document.getElementById("task-list");
let tasks = [];
async function loadTasks() {
    return await getTasks();
}
tasks = await loadTasks();
function createTaskElement(task) {
    const element = document.createElement("task-element");
    element.setAttribute("title", task.title);
    element.setAttribute("desc", task.desc);
    element.setAttribute("due", task.due);
    element.setAttribute("timeSpent", String(task.timeSpent));
    element.setAttribute("id", task.id);
    return element;
}
function renderTasks(tasks) {
    console.log("Rendering Tasks!");
    taskList.innerHTML = "";
    tasks.forEach((task) => {
        const ele = createTaskElement(task);
        taskList.appendChild(ele);
    });
}
renderTasks(tasks);
addTaskBtn.addEventListener("click", () => {
    console.log("the event listener is working!");
    const dueE = document.getElementById("due");
    const today = new Date();
    dueE.value = today.toISOString().split("T")[0];
    addTaskDialog.showModal();
});
const formE = document.getElementById("add-form");
const cancelB = document.getElementById("cancel-button");
cancelB.addEventListener("click", () => {
    addTaskDialog.close();
    formE.reset();
});
formE.addEventListener("submit", async (event) => {
    event.preventDefault();
    // Extract inputs
    const form = new FormData(formE);
    const title = form.get("title");
    const due = form.get("due");
    const desc = form.get("desc");
    const task = {
        title: title,
        desc: desc,
        due: due,
        id: crypto.randomUUID(),
        timeSpent: 0,
    };
    try {
        await newTask(task);
        console.log(task);
        console.log("task added");
    }
    catch (error) {
        console.log(`error: ${error}`);
    }
    tasks.push(task);
    renderTasks(tasks);
    addTaskDialog.close();
    formE.reset();
});
document.addEventListener("task-delete", async (event) => {
    const taskId = event.detail.taskId;
    try {
        await deleteTask(taskId);
        tasks = await loadTasks();
        renderTasks(tasks);
    }
    catch (error) {
        console.error(error);
    }
});
document.addEventListener("task-edit", async (event) => {
    const newTask = event.detail.newTask;
    try {
        await updateTask(newTask);
        tasks = await loadTasks();
        renderTasks(tasks);
    }
    catch (error) {
        console.error(error);
    }
});
