import { Stopwatch } from "./stopwatch.js";
// From 1000 lines in the other version to just this... I'm happy to rewrite zenith myself.stopwatch") as HTMLDivElement);
const globalSBackend = new Stopwatch();
const globalStopwatchLabel = document.getElementById("stopwatch") as HTMLDivElement;
const cycleDialog = document.getElementById("cycle-dialog") as HTMLDialogElement;
const enterIC = document.getElementById("ic-btn") as HTMLButtonElement;
const ack = document.getElementById("ack-btn") as HTMLButtonElement;
// TODO: Implement settings loading so that we can start working without placeholders
// I'm between using removeeventlistener and using a flag.
enterIC.addEventListener("click", () => {
  ack.remove();
  enterIC.textContent = "Exit IC";
  enterIC.removeEventListener("click");
  enterIC.addEventListener("click", () => {
    const icLabel = document.getElementById("ic-stopwatch") as HTMLParagraphElement;
    icLabel.hidden = false;
    // TODO: PENDING IMPLEMENTATION OF A TIMER. ELEMENT.
  });
});

ack.addEventListener("click", () => {
  cycleDialog.close();
});
globalSBackend.start(globalStopwatchLabel);
let cycles: number = 0;

document.addEventListener("cycle", () => {
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
