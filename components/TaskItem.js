"use strict";
// ============================================================================
// TaskItem.ts — A REUSABLE <task-item> WEB COMPONENT (custom HTML element)
// ============================================================================
// A Web Component lets you INVENT your own HTML tag with its own markup,
// styling, and behavior. After this file runs, you can write
// <task-item title="Buy milk"></task-item> anywhere and the browser renders
// a full task card. index.html loads the COMPILED TaskItem.js; main.ts
// creates cards with document.createElement('task-item').
//
// Key ideas used here:
//  - class + extends: TaskItem inherits ALL powers of HTMLElement.
//  - Shadow DOM: a private, encapsulated mini-document per card, so the
//    card's CSS can never leak out or clash with the page's CSS.
//  - Attributes as input: title/description/dueDate/id arrive as strings.
//  - Events as output: the card NEVER deletes itself or calls the API —
//    it dispatches a 'task-delete' event and lets main.ts (the owner of
//    the tasks array) decide what to do. Input-down-attributes,
//    output-up-events: a clean one-way flow that keeps every file simple.
// No imports! This component is deliberately self-contained: it receives
// data via attributes and reports actions via events, so it needs neither
// the API layer nor the Task type.
class TaskItem extends HTMLElement {
    // The constructor runs when the browser CREATES the element (e.g. via
    // document.createElement('task-item')). Rule: a custom element's
    // constructor must call super() FIRST (initializes the HTMLElement part),
    // and must NOT touch attributes or children yet — they may not exist.
    // So we only set up the shadow root here and do the real work in
    // connectedCallback() below.
    constructor() {
        super();
        // attachShadow({ mode: 'open' }) creates the private mini-document and
        // returns its root. 'open' means page JavaScript CAN peek inside via
        // element.shadowRoot (useful for debugging); 'closed' would hide it.
        this.shadow = this.attachShadow({ mode: 'open' });
    }
    // connectedCallback() is a LIFECYCLE method: the browser calls it
    // automatically each time the element is INSERTED into the page. By now
    // attributes ARE available, so this is where we read them and render.
    // (`: void` = this function returns nothing. Annotations like this are
    // documentation the compiler checks.)
    connectedCallback() {
        // Read the attributes main.ts set with setAttribute(). getAttribute()
        // returns `string | null` (null when the attribute is missing), and
        // `??` ("nullish coalescing") substitutes the right-hand default ONLY
        // when the left side is null/undefined — unlike `||`, it keeps other
        // falsy values like "" intact.
        const title = this.getAttribute('title') ?? 'Untitled Task';
        const description = this.getAttribute('description') ?? '';
        const dueDate = this.getAttribute('dueDate') ?? '';
        const id = this.getAttribute('id') ?? '';
        // Render the card by assigning an HTML string to the shadow root.
        // Backticks make a TEMPLATE LITERAL: ${title} interpolates the variable
        // into the markup. The <style> block is SCOPED — `.task-card` etc. apply
        // ONLY inside this card's shadow DOM, never to the outer page. That's
        // the whole point of the shadow DOM: style encapsulation for free.
        // (description/dueDate are read above for future use — e.g. a "More
        // info" popup — but not displayed yet.)
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
        // Grab elements INSIDE the shadow DOM. Note: document.querySelector()
        // can NOT see these (encapsulation!) — you must query from the shadow
        // root. The <HTMLButtonElement> in querySelector<...> is a GENERIC that
        // tells TypeScript what kind of element to expect, so deleteBtn gets
        // button methods in a type-safe way (or null if not found — hence `?.`
        // below). `card` is currently unused (reserved for future features like
        // toggling a 'completed' class); `?.` ("optional chaining") calls the
        // listener-attach ONLY if the element exists, instead of crashing.
        const deleteBtn = this.shadow.querySelector('.delete-btn');
        const card = this.shadow.querySelector('.task-card');
        const infoBtn = this.shadow.querySelector(".info-btn");
        infoBtn?.addEventListener('click', () => {
            console.log("Information arrives to those who pursue it.");
        });
        // The Delete button reports UP instead of acting itself. dispatchEvent
        // FIRES a synthetic event from this card. Two options make it reach the
        // parent list in main.ts:
        //  - bubbles: true — the event travels UP through ancestor elements
        //    (like a real click does) instead of stopping at this card.
        //  - composed: true — it is allowed to ESCAPE the shadow DOM boundary
        //    (without this, shadow-internal events stay trapped inside).
        // `detail: { id }` is the event's payload — main.ts reads
        // event.detail.id to learn WHICH task to delete. The card never touches
        // the tasks array or the network, so it stays reusable anywhere.
        deleteBtn?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('task-delete', {
                detail: { id },
                bubbles: true,
                composed: true
            }));
        });
    }
}
// REGISTERS the tag name with the browser: from here on, every
// <task-item> in the page (or created via createElement) becomes a TaskItem
// instance. Rules: the name MUST contain a hyphen (so browsers can tell
// custom tags from future built-in ones) and SHOULD be lowercase.
customElements.define('task-item', TaskItem);
