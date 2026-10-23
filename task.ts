import { deleteTask } from "./api.js";

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
    const due = this.getAttribute("due");
    const timeSpent = this.getAttribute("timeSpent");
    const id = this.getAttribute("id") as string;

    // Render Data From attributes
    this.shadow.innerHTML = `
      <dialog id="task-dialog">
          <form id="edit-form"> 
            <label>Title: </label>
            <input type="text" id="title" name="title"/>
            <br>
            <label>Description: </label>
            <textarea id="desc" name="desc">${desc}</textarea>
            <br>
            <label>Due: </label>
            <input type="date" id="due" name="due"/>
            <br>
            <p>ID: ${id}</p>
            <br>
            <button id="save-changes-btn">Save</button>
            <button id="cancel-changes-btn">Cancel</button>
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

    const form = this.shadow.getElementById('edit-form') as HTMLFormElement;
    const editDialog = this.shadow.getElementById('task-dialog') as HTMLDialogElement;
    const editButton = this.shadow.getElementById("task-edit-button") as HTMLButtonElement;
  }
}

customElements.define("task-element", TaskElement);
