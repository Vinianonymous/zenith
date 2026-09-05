import {deleteTask} from "../api.js"
class TaskItem extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    const title: string = this.getAttribute('title') ?? 'Untitled Task';
    const description: string = this.getAttribute('description') ?? '';
    const dueDate: string = this.getAttribute('dueDate') ?? '';
    const id: string = this.getAttribute('id') ?? '';

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          margin-bottom: 0.75rem;
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        }

        .task-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: var(--surface, #1e293b);
          border: 1px solid var(--border, #334155);
          box-shadow: var(--shadow, 0 4px 20px rgba(0, 0, 0, 0.3));
          transition: border-color 0.2s ease, background 0.2s ease;
          margin-bottom: 1rem;
        }

        .task-card:hover {
          border-color: var(--surface-hover, #334155);
        }

        .task-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          user-select: none;
        }

        .toggle {
          appearance: none;
          -webkit-appearance: none;
          width: 1.25rem;
          height: 1.25rem;
          background: var(--bg, #0f172a);
          border: 1px solid var(--border, #334155);
          cursor: pointer;
          display: grid;
          place-content: center;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .toggle:checked {
          background: var(--accent, #38bdf8);
          border-color: var(--accent, #38bdf8);
        }

        .toggle:checked::before {
          content: "";
          width: 0.5rem;
          height: 0.5rem;
          background-color: #0f172a;
          clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
        }

        .toggle:focus-visible {
          outline: 2px solid var(--accent, #38bdf8);
          outline-offset: 2px;
        }

        .title {
          font-size: 1rem;
          color: var(--text, #e2e8f0);
          transition: color 0.2s ease;
        }

        .task-card.completed .title {
          text-decoration: line-through;
          color: var(--text-muted, #94a3b8);
        }

        button {
          margin-left:1.5rem;
        }
      
        .info-btn {
          font: inherit;
          color: #68A7F9;
          background-color: rgba(104, 167, 249, 0.1);
          border: 1px solid transparent;;
          padding: 0.4rem 0.8rem;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
        }
          
        .delete-btn {
          font: inherit;
          color: #f87171;
          background-color: rgba(104, 167, 249, 0.1);
          border: 1px solid transparent;;
          padding: 0.4rem 0.8rem;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
        }

        .delete-btn:active {
          transform: scale(0.95);
        }

        .delete-btn:focus-visible {
          outline: 2px solid #ef4444;
          outline-offset: 2px;
        }
      </style>

      <div class="task-card">
        <label class="task-content">
          <span class="title">${title}</span>
        </label>
        <button class= "info-btn" type="button">More info</button>
        <button class="delete-btn" type="button">Delete</button>
      </div>
    `;
    const deleteBtn = this.shadow.querySelector<HTMLButtonElement>('.delete-btn');
    const card = this.shadow.querySelector<HTMLDivElement>('.task-card');
    const infoBtn = this.shadow.querySelector<HTMLButtonElement>(".info-btn");

    infoBtn?.addEventListener('click', () => {
      console.log("Information arrives to those who pursue it.")
    })

    // TODO: SOLVE THIS SOMEHOW
    deleteBtn?.addEventListener('click', () => {
      this.remove();
      deleteTask(id)
    });
  }
}

customElements.define('task-item', TaskItem);