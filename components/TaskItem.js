class TaskItem extends HTMLElement {
    shadow;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {

        const title = this.getAttribute('title') ?? 'Untitled Task';
        const description = this.getAttribute('description') ?? '';
        const date = this.getAttribute('dueDate') ?? '';
        const id = this.getAttribute('id') ?? '';

        let timeSpent = Number(this.getAttribute('timeSpent') ?? 0);
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
        input {
          background-color: rgba(104, 167, 249, 0.1);
          color: white;
          border: none;  
          padding: 5%;
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
        .info-btn:hover {
          color: #819fc7c9;
          background-color: rgba(47, 78, 119, 0.1);
          border: 1px solid #819fc7c9;
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
        dialog {
          background: var(--surface);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          border-radius: var(--radius);
          padding: 1.5rem;
          width: 90%;
          max-width: 400px;
          align-items: center;
          align-self: center;
          text-align: center;
          left: 25vw;
          transform: translateX(-50%);
          color: white;
        }
        button {
          font: inherit;
          color: var(--text);
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 0.6rem 1.25rem;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
          margin: 15px;
        }
      </style>

      <div class="task-card">
        <dialog class="task-info-dialog">
              <div>
                <label for="task-name">Name:</label>
                <input type="text" name="task-name" class="task-name-input">
                <br>
                <label>Description: </label>
                <input type="text" name="task-desc" class="task-desc-input">
                <br>
                <label>Due Date:</label>
                <input type="date" class="due-date">
                <br>
                <label>ID (Debugging): </label>
                <div class="UUID"></div>
                <div>
                  <button id="save-btn">Save</button>
                  <button id="cancel-btn">Cancel</button>
                </div>
            </div>
        </dialog>
        <dialog class="task-execution-dialog">
          <div>
            <h1>Executing...</h1>
            <br>
            <div id="task-stopwatch">00:00:00</div>
            <br>
            <button class="finish-btn">Finish</button> <button class="stop-btn">Stop execution</button>
          </div>
        </dialog>
        <label class="task-content">
          <span class="title">${title}</span>
        </label>
        <button class="execute-btn">Execute</button>
        <button class= "info-btn" type="button">More info</button>
        <button class="delete-btn" type="button">Delete</button>
      </div>
    `;
        const deleteBtn = this.shadow.querySelector('.delete-btn');
        const card = this.shadow.querySelector('.task-card');
        const infoBtn = this.shadow.querySelector(".info-btn");
        const execBtn = this.shadow.querySelector(".execute-btn");
        const stopwatch = this.shadow.querySelector('#task-stopwatch');
        const hours = String(Math.floor(timeSpent / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((timeSpent % 3600) / 60)).padStart(2, '0');
        const seconds = String(timeSpent % 60).padStart(2, '0');
        if (stopwatch) {
            stopwatch.textContent = `${hours}:${minutes}:${seconds}`;
        }
        execBtn?.addEventListener('click', () => {
            const dialog = this.shadow.querySelector(".task-execution-dialog");
            dialog.addEventListener('close', (event) => {
                console.log('closing dialog');
                console.log("Always keep in mind how just as a day ends, so does the time. Are you truly building or just giving excuses to postpone?");
                clearInterval(timer);
                this.setAttribute('timeSpent', String(timeSpent));
                const task = {
                    name: title,
                    description: description,
                    dueDate: date,
                    id: id,
                    timeSpent: timeSpent
                };
                const request = {
                    newData: task
                };
                this.dispatchEvent(new CustomEvent('task-edition', {
                    detail: { task },
                    bubbles: true,
                    composed: true
                }));
                dialog.close();
            });
            const timer = setInterval(() => {
                timeSpent++;
                const hours = String(Math.floor(timeSpent / 3600)).padStart(2, '0');
                const minutes = String(Math.floor((timeSpent % 3600) / 60)).padStart(2, '0');
                const seconds = String(timeSpent % 60).padStart(2, '0');
                if (stopwatch) {
                    stopwatch.textContent = `${hours}:${minutes}:${seconds}`;
                }
            }, 1000);
            const finish = dialog?.querySelector('.finish-btn');
            finish?.addEventListener('click', () => {

                clearInterval(timer);
                dialog?.remove();
                this.dispatchEvent(new CustomEvent('task-delete', {
                    detail: { id },
                    bubbles: true,
                    composed: true
                }));
            });
            const end = dialog?.querySelector(".stop-btn");
            end?.addEventListener('click', () => {
                dialog.close();
            });
            dialog?.showModal();
        });
        infoBtn?.addEventListener('click', () => {

            const dialog = this.shadow.querySelector('.task-info-dialog');

            const taskName = this.shadow.querySelector('.task-name-input');
            taskName.value = title;
            const taskDesc = this.shadow.querySelector('.task-desc-input');
            taskDesc.value = description;
            const dueDateInput = this.shadow.querySelector('.due-date');
            dueDateInput.value = `${date}`;
            const idE = this.shadow.querySelector('.UUID');
            idE.textContent = id;

            const saveBtn = this.shadow.getElementById('save-btn');
            saveBtn.addEventListener('click', () => {
                const newName = taskName.value;
                const newDesc = taskDesc.value;
                const newDate = dueDateInput.value;
                const task = {
                    name: newName,
                    description: newDesc,
                    dueDate: newDate,
                    id: this.id,
                    timeSpent: timeSpent
                };
                const request = {
                    newData: task
                };
                this.dispatchEvent(new CustomEvent('task-edition', {
                    detail: { task },
                    bubbles: true,
                    composed: true
                }));
                dialog?.remove();
            });
            const cancelBtn = this.shadow.getElementById('cancel-btn');
            cancelBtn.addEventListener('click', () => {
                dialog?.remove();
            });

            dialog?.showModal();
            console.log("Information arrives to those who pursue it.");
        });
        deleteBtn?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('task-delete', {
                detail: { id },
                bubbles: true,
                composed: true
            }));
        });
    }
}
customElements.define('task-item', TaskItem);
export {};
