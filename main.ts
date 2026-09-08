// ============================================================================
// main.ts — FRONTEND ENTRY POINT (stopwatch + task list UI)
// ============================================================================
// This is the brain of the page. index.html loads the COMPILED version
// (main.js) via <script type="module" src="main.js">. You edit THIS file,
// then run the compiler (`tsc ...`) to regenerate main.js. Never edit the
// .js by hand — your changes would be overwritten by the next build.

// ---------------------------------------------------------------------------
// Imports: bringing in code from other files.
// ---------------------------------------------------------------------------
// `import { a, b } from "./file.js"` loads the EXPORTED names `a` and `b`
// from that module. Imports are "hoisted" (loaded before anything runs),
// so by convention they sit at the top of the file.
// We import from "./api.js" / "./types.js" with .js extensions because that
// is what will exist on disk after compiling (see types.ts for the full
// explanation).
import {getTasks, addTask, deleteTask} from "./api.js";
import { Task, Settings} from "./types.js";



// ============================================================================
// GLOBAL STOPWATCH + CYCLE ALARM
// ============================================================================
// A ticking clock at the top of the page that rings every `cycle_period`
// minutes. It is completely independent from the task list below.

// `const alarm_audio = new Audio(...)` loads a sound file into an HTMLAudio
// object. Calling alarm_audio.play() later actually plays it. The file path
// is relative to index.html, so alarm.mp3 must sit next to index.html.
const alarm_audio = new Audio("alarm.mp3");
    // This involves finding a way to interface configure page with this setting.
// How many minutes between alarm rings. `const` = the binding can't be
// reassigned later (use `let` for values that DO change, like globalTime).

// STOPWATCH HANDLING
// `document.getElementById(...)` grabs the <p id="stopwatch-text"> element.
// It returns `HTMLElement | null` (null if the id doesn't exist!), and the
// generic HTMLElement has no `textContent`... actually it does — but to be
// precise we assert the exact kind with `as HTMLParagraphElement`. That is a
// TYPE ASSERTION: "trust me compiler, this is a <p> element". It changes
// only the compile-time type, generating zero runtime code. If you assert
// wrongly (it was actually a <div>), TypeScript won't save you — so only
// assert things you've verified in index.html.
const globalStopwatchLabel = document.getElementById('stopwatch-text') as HTMLParagraphElement;
// Mutable state for the clock. `let` because we reassign its FIELDS every
// second (note: `const` would also work here since we never reassign the
// object ITSELF — but `let` signals "this changes over time").
let globalTime = {
    'hours':0,
    'minutes':0,
    'seconds':59
}

// Starts the ticking. Declared as a function so the INTENT is named and the
// setup could be restarted later if needed.
function HandleGlobalStopwatch() {
    // setInterval(callback, ms) calls `callback` every `ms` milliseconds,
    // forever (until clearInterval). The `() => {...}` is an ARROW FUNCTION —
    // a compact anonymous function. It "closes over" globalTime and
    // globalStopwatchLabel from the surrounding scope (a CLOSURE), so each
    // tick can read and update them.
    setInterval(() => {
        // --- advance the time by one second, rolling over at 60 ---
        globalTime.seconds ++;
        if (globalTime.seconds > 59) {
            globalTime.seconds = 0;
            globalTime.minutes ++;
        }

        if (globalTime.minutes > 59) {
            globalTime.minutes = 0;
            globalTime.hours ++;
        }
        // --- format as "HH:MM:SS" ---
        // String(5) turns the number into "5"; .padStart(2, "0") left-pads
        // with zeros to width 2, so "5" becomes "05". Template literals
        // (backticks + ${...}) embed the values directly into the string.
        let hour = String(globalTime.hours).padStart(2, "0");
        let minute = String(globalTime.minutes).padStart(2, "0");
        let second = String(globalTime.seconds).padStart(2, "0");

        // .textContent sets the TEXT inside the <p>, updating what you see.
        // (Use textContent, never innerHTML, for plain text — innerHTML would
        // parse the string as HTML and open the door to injection attacks.)
        globalStopwatchLabel.textContent = `${hour}:${minute}:${second}`;
        // --- ring the alarm on every `cycle_period`-minute boundary ---
        // `%` is modulo (remainder): minutes % 15 == 0 is true at :00, :15,
        // :30, :45. Combined with seconds == 0 it fires exactly once per
        // boundary instead of for a whole minute. (Edge case: at 00:00 the
        // alarm also rings on page load — 0 % 15 == 0!)
        if (globalTime.minutes % 15 == 0 && globalTime.seconds == 0) {
            alarm_audio.play();
        }
    }, (1000));
}
// Actually start the clock. Without this call, nothing above would run.
HandleGlobalStopwatch();


// ============================================================================
// TASK HANDLING
// ============================================================================
// The single source of truth for the UI is the `tasks` ARRAY below.
// Rule of thumb used throughout: change the array FIRST, then update the
// page to match it (or roll the array change back on failure). The page is
// a REFLECTION of the array — never the other way around.

// `Task[]` means "array of Task". Starts empty; loadTasks() fills it from
// the backend a moment after the page loads.
let tasks: Task[] = [];
// `async` because getTasks() is async — you can only `await` inside an
// async function. Fetches the list, stores it, then renders it.
async function loadTasks() {
    tasks = await getTasks();
    RenderTasks();
}

// Kick off the initial load. NOT awaited (top-level await aside): the rest
// of this file (grabbing buttons, attaching listeners) runs immediately,
// and the list fills in whenever the network answers. The UI must work
// even before the data arrives — that is why listeners attach synchronously.
loadTasks();

// The <div id="task-items"> inside index.html — the container we append
// task cards to. (The <h2> heading lives OUTSIDE this div so re-rendering
// the list can never wipe it.)
const taskItems = document.getElementById('task-items') as HTMLDivElement;

// Builds ONE <task-item> card element for a task object WITHOUT inserting
// it anywhere yet. Extracted as a helper so both the full render (initial
// load) and the single-append (adding one task) share the same code —
// write it once, use it twice, and the two can never drift apart.
function createTaskElement(task: Task): HTMLElement {
    // Custom element names MUST be lowercase and contain a hyphen.
    // 'task-item' matches customElements.define('task-item', ...) in
    // TaskItem.ts — when the browser sees this tag, it upgrades it into a
    // full TaskItem component and runs its connectedCallback().
    const taskItem = document.createElement('task-item') as HTMLElement;

    // Web components receive data through ATTRIBUTES (plain strings).
    // setAttribute('title', ...) becomes getAttribute('title') inside the
    // component. Only set dueDate when non-empty so the component's
    // `?? ''` fallback stays in charge of the default.
    taskItem.setAttribute('title', task.name);
    if (task.dueDate) {
        taskItem.setAttribute('dueDate', task.dueDate);
    }
    taskItem.setAttribute('description', task.description);
    // The backend id, so the component can tell the parent WHICH task its
    // delete button refers to (sent back inside the 'task-delete' event).
    taskItem.setAttribute('id', task.id)
    return taskItem;
}

// Rebuilds the ENTIRE list from the `tasks` array. Used for the initial
// load and as a "reset to truth" after a failed delete (see below).
// Day-to-day add/delete do NOT call this — they surgically add/remove a
// single card so the page never flickers.
function RenderTasks() {
    // Clears the container. Safe now: the <h2> is outside #task-items.
    // (Setting innerHTML is fine here because we control the string — it's
    // empty — and immediately repopulate with real elements.)
    taskItems.innerHTML = '';
    tasks.forEach((task: Task) => {
        taskItems.appendChild(createTaskElement(task));
    });
}

// ---------------------------------------------------------------------------
// Deleting: listening for events bubbled up from <task-item> cards.
// ---------------------------------------------------------------------------
// Each card's Delete button dispatches a CustomEvent named 'task-delete'
// carrying { id } (see TaskItem.ts). Because the event was created with
// `bubbles: true, composed: true`, it travels UP through the shadow DOM
// boundary to this container, so ONE listener here handles deletes for
// EVERY card — present and future. This pattern is called EVENT DELEGATION:
// no per-card bookkeeping, no stale listeners after re-renders.
taskItems.addEventListener('task-delete', async (event: Event) => {
    // The listener signature must accept the generic Event, but WE know we
    // only fire CustomEvents with an { id } payload, so we narrow the type
    // with `as`. `event.detail` is where CustomEvent carries custom data.
    const customEvent = event as CustomEvent<{ id: string }>;
    const id = customEvent.detail.id;
    // Find the task's position in our array. findIndex returns -1 when
    // nothing matches — always guard against that before splicing!
    const index = tasks.findIndex((task: Task) => task.id === id);
    if (index === -1) {
        return;
    }

    // OPTIMISTIC update: assume the server call will succeed and update the
    // UI instantly (arrays + DOM) so the app feels snappy. `splice(index, 1)`
    // REMOVES one element at `index` and returns it in an array — hence the
    // `const [removed] = ...` destructuring to grab that one element back.
    // We keep `removed` so we can UNDO below if the network call fails.
    const [removed] = tasks.splice(index, 1);
    // Remove just this ONE card from the page. The id is a UUID (no spaces
    // or quotes), so it is safe inside the quoted attribute selector.
    const element = taskItems.querySelector(`task-item[id="${id}"]`);
    element?.remove();

    try {
        // Persist the deletion. `await` so a failure lands in `catch`.
        await deleteTask(id);
    } catch (error) {
        // The server said NO (or was unreachable): roll back to keep the UI
        // and backend in sync, then re-render from the restored array.
        // Without this, a failed delete would LOOK deleted until refresh.
        console.error('Failed to delete task, restoring it.', error);
        tasks.splice(index, 0, removed);
        RenderTasks();
    }
});


// Grab the static controls from index.html. `as HTMLButtonElement` etc.
// give us the precise types (a <dialog> has .showModal(), a generic
// HTMLElement does not — the assertion unlocks those methods).
const addTaskBtn = document.getElementById(
    'add-task-button'
) as HTMLButtonElement;

const dialog = document.getElementById(
    'add-task-dialog'
) as HTMLDialogElement;

const form = document.getElementById(
    'add-task-form'
) as HTMLFormElement;


// Open dialog
// A 'click' listener on the "Add Task" button. showModal() opens the
// <dialog> as a modal (dark backdrop, focus trapped, Esc closes it).
addTaskBtn.addEventListener('click', () => {
    dialog.showModal();
});


// Handle form submission
// We listen for 'submit' on the FORM (not 'click' on the button) so that
// ALL submit paths work: button click AND pressing Enter in a text field.
form.addEventListener('submit', async (event) => {
    // CRITICAL: a form's default behavior is to NAVIGATE (full page reload,
    // sending the fields as URL query params). preventDefault() cancels that
    // so our JavaScript can handle the data instead. Forget this line and
    // every submit reloads the page!
    event.preventDefault();

    // FormData reads the form's NAMED fields (name="task-title" etc. in
    // index.html — the `name` attribute is what matters, not the `id`).
    // .get() returns string | File | null; `as string` asserts our fields
    // are text inputs, matching the Task type.
    const formData = new FormData(form);

    const task = {
        name: formData.get('task-title') as string,
        dueDate: formData.get('task-due-date') as string,
        description: formData.get('task-description') as string,
        // crypto.randomUUID() generates a v4 UUID like
        // "3f6d...-...". Built into browsers — no library needed. Created
        // HERE (client-side) so the UI can use the id immediately.
        id: crypto.randomUUID()
    };

    console.log(task);

    // Persist FIRST: only touch local state once the backend confirms the
    // save. If the server is down, we `return` early — the dialog stays open
    // and the form keeps the user's text, so nothing they typed is lost.
    // Contrast with the old code, which pushed to the array BEFORE knowing
    // whether the save worked (UI and server could silently diverge).
    try {
        await addTask(task);
    } catch (error) {
        console.error('Failed to add task.', error);
        return;
    }
    // Success: reflect the new task in the array AND on the page — by
    // appending ONE card, not re-rendering the whole list (no flicker).
    tasks.push(task);
    taskItems.appendChild(createTaskElement(task));

    dialog.close();
    form.reset();
});
