import { deleteTask } from "./api.js";
class TaskElement extends HTMLElement {
    shadow;
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
        const id = this.getAttribute("id");
        // Render Data From attributes
        this.shadow.innerHTML = `
      <dialog id="task-dialog">
          <label>Title: </label>
          <input type="text" id="title" name="title" />
          <label>Description: </label>
          <textarea id="desc" name="desc"></textarea>
          <label>Due: </label>
          <input type="date" id="due" name="due"/>
      </dialog>
      <div id="task-card">
        <div>${title}</div>
        <button id="task-edit-button">More Info</button>
        <button id="delete-button">Delete</button>
      </div>
    `;
        const deleteButton = this.shadow.getElementById("delete-button");
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
        const editButton = this.shadow.getElementById("task-edit-button");
        editButton.addEventListener("click", () => {
            console.log("edit clicked");
            //TODO: Implement task editing
        });
    }
}
customElements.define("task-element", TaskElement);
