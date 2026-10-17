"use strict";
class TaskElement extends HTMLElement {
    shadow;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }
    connecetedCallback() {
        // Get data from attributes
        const title = this.getAttribute("title");
        const desc = this.getAttribute("desc");
        const due = this.getAttribute("due");
        const timeSpent = this.getAttribute("timeSpent");
        const id = this.getAttribute("id");
        // Render Data From attributes
        this.shadow.innerHTML = `
      <div id="task-card">
        ${title}
      </div>
    `;
    }
}
