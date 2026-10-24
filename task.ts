import { deleteTask, Task, updateTask } from "./api.js";

class TaskElement extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Get data from attributes
    const title = this.getAttribute("title");
    const desc = this.getAttribute("desc");
    const due = this.getAttribute("due") as string;
    const timeSpent = Number(this.getAttribute("timeSpent")) || 0;
    const id = this.getAttribute("id") as string;

    // Render Data From attributes;
    const dueDate = new Date(due).toISOString().split("T")[0];
    this.shadow.innerHTML = `
      <dialog id="task-dialog">
          <form id="edit-form"> 
            <label>Title: </label>
            <input type="text" id="title" name="title" value="${title}"/>
            <br>
            <label>Description: </label>
            <textarea id="desc" name="desc">"${desc}"</textarea>
            <br>
            <label>Due: </label>
            <input type="date" id="due" name="due" value="${dueDate}"/>
            <br>
            <p>Time Spent: ${timeSpent}</p>
            <p>ID: ${id}</p>
            <br>
            <button id="save-changes-btn" type="submit">Save</button>
            <button id="cancel-changes-btn" type="button">Cancel</button>
          </form>
      </dialog>
      <div id="task-card">
        <div>${title}</div>
        <button id="task-edit-button">More Info</button>
        <button id="delete-button">Delete</button>
      </div>
    `;

    const deleteButton = this.shadow.getElementById("delete-button") as HTMLButtonElement;
    deleteButton.addEventListener("click", () => {
      console.log("delete clicked");
      // TODO: implement task deletion
      const deleteEvent = new CustomEvent("task-delete", {
        detail: {
          taskId: id,
        },
        bubbles: true,
        composed: true,
      });
      deleteTask(id);
      document.dispatchEvent(deleteEvent);
    });

    const form = this.shadow.getElementById("edit-form") as HTMLFormElement;
    const editDialog = this.shadow.getElementById("task-dialog") as HTMLDialogElement;
    const editButton = this.shadow.getElementById("task-edit-button") as HTMLButtonElement;
    editButton.addEventListener("click", () => {
      editDialog.showModal();
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

      try {
        await updateTask(newTask);
      } catch (error) {
        console.error(error);
      }
      form.reset();
      editDialog.close();
    });
  }
}

customElements.define("task-element", TaskElement);
