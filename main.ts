import { Stopwatch } from "./stopwatch.js";
// From 1000 lines in the other version to just this... I'm happy to rewrite zenith myself.stopwatch") as HTMLDivElement);
const globalSBackend = new Stopwatch();
const globalStopwatchLabel = document.getElementById("stopwatch") as HTMLDivElement;
globalSBackend.start(globalStopwatchLabel);

// TASK HANDLING

import { getTasks, newTask, deleteTask, Task } from "./api.js";
const addTaskBtn = document.getElementById("add-task-button") as HTMLButtonElement;
const taskList = document.getElementById("task-list") as HTMLDivElement;
let tasks: Task[] = [];

async function loadTasks() {
  tasks = await getTasks();
}
loadTasks();

addTaskBtn.addEventListener("click", async () => {
  const dialog = document.createElement("add-task-dialog") as HTMLDialogElement;
});
