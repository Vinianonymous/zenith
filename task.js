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
        const timeSpent = Number(this.getAttribute("timeSpent")) || 0;
        const id = this.getAttribute("id") || "DANGER: NO ID";
        // Render Data From attributes;
        const dueDate = new Date(due).toISOString().split("T")[0];
        this.shadow.innerHTML = `
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
        <button id="task-edit-button">More Info</button>
        <button id="delete-button">Delete</button>
      </div>
    `;
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
            // TODO: implement task deletion
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
export {};
