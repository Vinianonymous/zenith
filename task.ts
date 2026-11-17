import { deleteTask, Task, updateTask } from "./api.js";
import { Stopwatch } from "./stopwatch.js";

class TaskElement extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Get data from attributes
    const title = (this.getAttribute("title") as string) || "Unnamed!";
    const desc = (this.getAttribute("desc") as string) || "No need for explanations";
    const due = (this.getAttribute("due") as string) || "2026-10-01";
    let timeSpent = Number(this.getAttribute("timeSpent")) || 0;
    const id = (this.getAttribute("id") as string) || "DANGER: NO ID";

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
   
      <div id="task-card">
        <div>${title}</div>
        <div id="exec-stopwatch" hidden=true>00:00:00</div>
        <button id="task-exec">Execute Task</button>
        <button id="task-edit-button">More Info</button>
        <button id="delete-button">Delete</button>
      </div>
    `;

    // Task execution
    const execButton = this.shadow.getElementById("task-exec") as HTMLButtonElement;
    const stopwatchL = this.shadow.getElementById("exec-stopwatch") as HTMLDivElement;
    const stopwatch = new Stopwatch();
    stopwatch.secondsElapsed = timeSpent;
    stopwatch.render(stopwatchL);

    execButton.addEventListener("click", () => {
      if (stopwatch.isCounting) {
        stopwatch.toggle(stopwatchL);
        deleteButton.textContent = "Delete";
        stopwatch.isCounting = false;
        execButton.textContent = "Execute Task";
        stopwatchL.hidden = true;
        // TODO: Implement a way to save the time
        const saveTime: Task = {
          title: title,
          desc: desc,
          timeSpent: timeSpent,
          due: due,
          id: id,
        };
        updateTask(saveTime);
      } else {
        execButton.textContent = "Stop Execution";
        stopwatch.toggle(stopwatchL);
        timeSpent = stopwatch.secondsElapsed;
        stopwatchL.hidden = false;

        deleteButton.textContent = "Finish";
        document.dispatchEvent(new CustomEvent("task-exec-init"));
      }
    });

    // get elements
    const titleE = this.shadow.getElementById("title") as HTMLInputElement;
    const descE = this.shadow.getElementById("desc") as HTMLTextAreaElement;
    const dueE = this.shadow.getElementById("due") as HTMLInputElement;
    const timeSpentE = this.shadow.getElementById("timeSpent") as HTMLParagraphElement;
    const idE = this.shadow.getElementById("taskID") as HTMLParagraphElement;
    titleE.value = title;
    descE.value = desc;
    dueE.value = dueDate;
    idE.innerHTML = `ID: ${id}`;
    timeSpentE.innerHTML = `Time Spent On Task: ${timeSpent}`;

    const deleteButton = this.shadow.getElementById("delete-button") as HTMLButtonElement;
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

    const form = this.shadow.getElementById("edit-form") as HTMLFormElement;
    const editDialog = this.shadow.getElementById("task-dialog") as HTMLDialogElement;
    const editButton = this.shadow.getElementById("task-edit-button") as HTMLButtonElement;
    editButton.addEventListener("click", () => {
      editDialog.showModal();
    });

    const taskExec = this.shadow.getElementById("task-exec") as HTMLButtonElement;
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

    const cancelButton = this.shadow.getElementById("cancel-changes-btn") as HTMLButtonElement;
    cancelButton.addEventListener("click", () => {
      editDialog.close();
      form.reset();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formD = new FormData(form);
      const newTask: Task = {
        id: id,
        title: formD.get("title") as string,
        desc: formD.get("desc") as string,
        due: formD.get("due") as string,
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
