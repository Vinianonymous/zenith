import { Stopwatch } from "./stopwatch.js";
// From 1000 lines in the other version to just this... I'm happy to rewrite zenith myself.stopwatch") as HTMLDivElement);
const globalSBackend = new Stopwatch();
const globalStopwatchLabel = document.getElementById("stopwatch") as HTMLDivElement;
globalSBackend.start(globalStopwatchLabel);

// TASK HANDLING
import { getTasks, newTask, Task, deleteTask } from "./api.js";
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
  addTaskDialog.showModal();
});

const formE = document.getElementById("add-form") as HTMLFormElement;
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
    console.log("task added");
  } catch (error) {
    console.log(`error: ${error}`);
  }
  renderTasks(tasks);
  addTaskDialog.close();
  formE.reset();
});

document.addEventListener("task-delete", async (event) => {
  console.log("task is being deleted :(");
});
