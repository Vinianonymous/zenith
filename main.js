import { Stopwatch } from "./stopwatch.js";
// From 1000 lines in the other version to just this... I'm happy to rewrite zenith myself.stopwatch") as HTMLDivElement);
const globalSBackend = new Stopwatch();
const globalStopwatchLabel = document.getElementById("stopwatch");
globalSBackend.start(globalStopwatchLabel);
// TASK HANDLING
import { getTasks, newTask, updateTask } from "./api.js";
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
    renderTasks(tasks);
    addTaskDialog.close();
    formE.reset();
});
document.addEventListener("task-delete", async (event) => {
    renderTasks(tasks);
});
document.addEventListener("task-edit", async (event) => {
    const newTask = event.detail.newTask;
    updateTask(newTask);
});
