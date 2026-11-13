import { deleteTask, updateTask } from "./api.js";
import { Stopwatch } from "./stopwatch.js";
class TaskElement extends HTMLElement {
    shadow;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        // Get data from attributes
        const title = this.getAttribute("title") || "Unnamed!";
        const desc = this.getAttribute("desc") || "No need for explanations";
        const due = this.getAttribute("due") || "2026-10-01";
        let timeSpent = Number(this.getAttribute("timeSpent")) || 0;
        const id = this.getAttribute("id") || "DANGER: NO ID";
        // Render Data From attributes;
        const dueDate = new Date(due).toISOString().split("T")[0];
        this.shadow.innerHTML = `
      <link rel="stylesheet" href="css/style.css" />
      <dialog id="task-dialog">
          <form id="edit-form"> 
            <label>Title: </label>
            <input type="text" id="title" name="title"/>
            <br>
            <label>Description: </label>
            <textarea id="desc" name="desc"></textarea>
            <br>
            <label>Due: </label>
            <input type="date" id="due" name="due"/>
            <br>
            <label id="timeSpent">Time Spent on Task: 0</label>
            <p id="taskID"></p>
            <br>
            <button id="save-changes-btn" type="submit">Save</button>
            <button id="cancel-changes-btn" type="button">Cancel</button>
          </form>
      </dialog>

      <dialog id="exec-diag">
        <div id="exec-stopwatch">00:00:00</div>
        <button id="exec-cancel">Cancel</button>
        <button id="exec-finish">Finish execution</button>
      </dialog>      
      <div id="task-card">
        <div>${title}</div>
        <button id="task-exec">Execute Task</button>
        <button id="task-edit-button">More Info</button>
        <button id="delete-button">Delete</button>
      </div>
    `;
        // Task execution
        const execDiag = this.shadow.getElementById("exec-diag");
        const execButton = this.shadow.getElementById("task-exec");
        const finish = this.shadow.getElementById("exec-finish");
        const quitExec = this.shadow.getElementById("exec-cancel");
        const stopwatchL = this.shadow.getElementById("exec-stopwatch");
        const stopwatch = new Stopwatch();
        execButton.addEventListener("click", () => {
            stopwatch.secondsElapsed = timeSpent;
            stopwatch.render(stopwatchL);
            stopwatch.toggle(stopwatchL);
            document.dispatchEvent(new CustomEvent("task-exec-init"));
        });
        function quitExecution() {
            if (stopwatch.isCounting)
                stopwatch.toggle(stopwatchL);
            execDiag.close();
            document.dispatchEvent(new CustomEvent("task-exec-finish"));
        }
        quitExec.addEventListener("click", async () => {
            quitExecution();
            const updatedTimeSpent = stopwatch.secondsElapsed;
            try {
                await updateTask({ title, desc, due, id, timeSpent: updatedTimeSpent });
                timeSpent = updatedTimeSpent;
                this.setAttribute("timeSpent", String(timeSpent));
                timeSpentE.textContent = `Time Spent On Task: ${timeSpent}`;
            }
            catch (error) {
                console.error(error);
            }
        });
        finish.addEventListener("click", async () => {
            quitExecution();
            try {
                await deleteTask(id);
                this.remove();
            }
            catch (error) {
                console.error(error);
            }
        });
        execDiag.addEventListener("cancel", (event) => {
            event.preventDefault();
            quitExec.click();
        });
        // get elements
        const titleE = this.shadow.getElementById("title");
        const descE = this.shadow.getElementById("desc");
        const dueE = this.shadow.getElementById("due");
        const timeSpentE = this.shadow.getElementById("timeSpent");
        const idE = this.shadow.getElementById("taskID");
        titleE.value = title;
        descE.value = desc;
        dueE.value = dueDate;
        idE.innerHTML = `ID: ${id}`;
        timeSpentE.innerHTML = `Time Spent On Task: ${timeSpent}`;
        const deleteButton = this.shadow.getElementById("delete-button");
        deleteButton.addEventListener("click", () => {
            console.log("delete clicked");
            const deleteEvent = new CustomEvent("task-delete", {
                detail: {
                    taskId: id,
                },
                bubbles: true,
                composed: true,
            });
            document.dispatchEvent(deleteEvent);
        });
        const form = this.shadow.getElementById("edit-form");
        const editDialog = this.shadow.getElementById("task-dialog");
        const editButton = this.shadow.getElementById("task-edit-button");
        editButton.addEventListener("click", () => {
            editDialog.showModal();
        });
        const taskExec = this.shadow.getElementById("task-exec");
        taskExec.addEventListener("click", () => {
            console.log("Execution Triggered!>:)");
            const execEvent = new CustomEvent("task-exec", {
                detail: {
                    taskId: id,
                },
                bubbles: true,
                composed: true,
            });
            document.dispatchEvent(execEvent);
        });
        const cancelButton = this.shadow.getElementById("cancel-changes-btn");
        cancelButton.addEventListener("click", () => {
            editDialog.close();
            form.reset();
        });
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formD = new FormData(form);
            const newTask = {
                id: id,
                title: formD.get("title"),
                desc: formD.get("desc"),
                due: formD.get("due"),
                timeSpent: timeSpent,
            };
            const editEvent = new CustomEvent("task-edit", {
                detail: {
                    newTask: newTask,
                },
                bubbles: true,
                composed: true,
            });
            document.dispatchEvent(editEvent);
            form.reset();
            editDialog.close();
        });
    }
}
customElements.define("task-element", TaskElement);
