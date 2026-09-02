"use strict";
class TaskItem extends HTMLElement {
    constructor() {
        super();
        // Attach Shadow DOM for style and markup encapsulation
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        // Read initial dynamic properties from attributes
        const title = this.getAttribute('title') || 'Untitled Task';
        const completed = this.hasAttribute('completed');
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 8px;
          font-family: sans-serif;
        }
        .task-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background-color: #f4f4f5;
          border-radius: 6px;
          border: 1px solid #e4e4e7;
        }
        .title {
          font-size: 14px;
          color: #18181b;
        }
        .task-card.completed .title {
          text-decoration: line-through;
          color: #71717a;
        }
        button {
          background: #ef4444;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>

      <div class="task-card ${completed ? 'completed' : ''}">
        <label>
          <input type="checkbox" class="toggle" ${completed ? 'checked' : ''}>
          <span class="title">${title}</span>
        </label>
        <button class="delete-btn">Delete</button>
      </div>
    `;
        // Attach event listeners inside the element
        const checkbox = this.shadowRoot.querySelector('.toggle');
        const deleteBtn = this.shadowRoot.querySelector('.delete-btn');
        checkbox.addEventListener('change', () => {
            this.toggleAttribute('completed', checkbox.checked);
            this.shadowRoot.querySelector('.task-card').classList.toggle('completed', checkbox.checked);
        });
        deleteBtn.addEventListener('click', () => {
            // Dispatch a custom event so parent applications can handle removal
            this.dispatchEvent(new CustomEvent('task-deleted', {
                bubbles: true,
                composed: true
            }));
            this.remove();
        });
    }
}
// Register the element tag name (must contain a hyphen)
customElements.define('task-item', TaskItem);
