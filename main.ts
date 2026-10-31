// SETTINGS HANDLING
import { Settings, loadSettings } from "./settings.js";

const settings: Settings = loadSettings();

import { Stopwatch, Timer } from "./stopwatch.js";
// From 1000 lines in the other version to just this... I'm happy to rewrite zenith myself.stopwatch") as HTMLDivElement);
const globalSBackend = new Stopwatch();
globalSBackend.cycleEnabled = settings.cycleEnabled;
globalSBackend.cyclePeriod = settings.cyclePeriod;

const globalStopwatchLabel = document.getElementById("stopwatch") as HTMLDivElement;
const cycleDialog = document.getElementById("cycle-dialog") as HTMLDialogElement;
const enterIC = document.getElementById("ic-btn") as HTMLButtonElement;
let countingIC: boolean = false;
let inIC = false;
const timer = new Timer();
timer.secondsRemaining = settings.intercyclePeriod * 60;
const timerL = document.getElementById("ic-timer") as HTMLDivElement;
enterIC.addEventListener("click", () => {
  timerL.hidden = false;
  ack.textContent = "exit IC";
  if (globalSBackend.isCounting) globalSBackend.toggle(globalStopwatchLabel);
  if (!countingIC) {
    countingIC = true;
    timer.toggleCounting(timerL);

    enterIC.textContent = "Pause";
  } else {
    enterIC.textContent = "Resume";
    countingIC = false;
    timer.toggleCounting(timerL);
  }
});

const ack = document.getElementById("ack-btn") as HTMLButtonElement;
ack.addEventListener("click", () => {
  cycleDialog.close();
  timerL.hidden = true;

  if (timer.isCounting) timer.toggleCounting(timerL);
  timer.secondsRemaining = settings.intercyclePeriod * 60;
  globalSBackend.toggle(globalStopwatchLabel);
  countingIC = false;
  ack.textContent = "Acknowledge";
  enterIC.textContent = "Enter Intercycle";
});
globalSBackend.toggle(globalStopwatchLabel);
let cycles: number = 0;

document.addEventListener("cycle", () => {
  globalSBackend.toggle(globalStopwatchLabel);
  cycleDialog.showModal();
  cycles++;
});

// TASK HANDLING
import { getTasks, newTask, Task, updateTask, deleteTask } from "./api.js";
import "./task.js";
const addTaskBtn = document.getElementById("add-task-button") as HTMLButtonElement;
const addTaskDialog = document.getElementById("add-task-dialog") as HTMLDialogElement;
const taskList = document.getElementById("task-list") as HTMLDivElement;
let tasks: Task[] = [];
async function loadTasks() {
  return await getTasks();
}
tasks = await loadTasks();

function createTaskElement(task: Task) {
  const element = document.createElement("task-element") as HTMLElement;
  element.setAttribute("title", task.title);
  element.setAttribute("desc", task.desc);
  element.setAttribute("due", task.due);
  element.setAttribute("timeSpent", String(task.timeSpent));
  element.setAttribute("id", task.id);
  return element;
}

function renderTasks(tasks: Task[]) {
  console.log("Rendering Tasks!");
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const ele = createTaskElement(task) as HTMLElement;
    taskList.appendChild(ele);
  });
}
renderTasks(tasks);

addTaskBtn.addEventListener("click", () => {
  console.log("the event listener is working!");
  const dueE = document.getElementById("due") as HTMLInputElement;
  const today = new Date();
  dueE.value = today.toISOString().split("T")[0];
  addTaskDialog.showModal();
});

const formE = document.getElementById("add-form") as HTMLFormElement;
const cancelB = document.getElementById("cancel-button") as HTMLButtonElement;
cancelB.addEventListener("click", () => {
  addTaskDialog.close();
  formE.reset();
});

formE.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Extract inputs
  const form = new FormData(formE);
  const title = form.get("title") as string;
  const due = form.get("due") as string;
  const desc = form.get("desc") as string;

  const task: Task = {
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
  } catch (error) {
    console.log(`error: ${error}`);
  }

  tasks.push(task);
  renderTasks(tasks);
  addTaskDialog.close();
  formE.reset();
});

document.addEventListener("task-delete", async (event) => {
  const taskId = (event as CustomEvent).detail.taskId;
  try {
    await deleteTask(taskId);
    tasks = await loadTasks();
    renderTasks(tasks);
  } catch (error) {
    console.error(error);
  }
});

document.addEventListener("task-edit", async (event: Event) => {
  const newTask = (event as CustomEvent).detail.newTask;
  try {
    await updateTask(newTask);
    tasks = await loadTasks();
    renderTasks(tasks);
  } catch (error) {
    console.error(error);
  }
});
