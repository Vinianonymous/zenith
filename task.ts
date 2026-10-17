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
    const id = this.getAttribute("id");

    // Render Data From attributes
    this.shadow.innerHTML = `
      <div id="task-card">
        ${title}
      </div>
    `;
  }
}

customElements.define('task-element', TaskElement);
