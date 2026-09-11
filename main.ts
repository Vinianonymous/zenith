
import {getTasks, addTask, deleteTask, editTask} from "./api.js";
import { Task, Settings} from "./types.js";
import { loadSettings } from "./settings.js";
const settings:Settings = loadSettings();

// is relative to index.html, so alarm.mp3 must sit next to index.html.
const alarm_audio = new Audio(settings.cycleAlarmPath);
const ticking_audio = new Audio(settings.tickingSoundPath);

const globalStopwatchLabel = document.getElementById('stopwatch-text') as HTMLParagraphElement;
let globalTime = {
    'hours':0,
    'minutes':0,
    'seconds':0
}


function HandleGlobalStopwatch() {

    setInterval(() => {
        globalTime.seconds ++;
        if (globalTime.seconds > 59) {
            globalTime.seconds = 0;
            globalTime.minutes ++;
        }

        if (globalTime.minutes > 59) {
            globalTime.minutes = 0;
            globalTime.hours ++;
        }
       
        let hour = String(globalTime.hours).padStart(2, "0");
        let minute = String(globalTime.minutes).padStart(2, "0");
        let second = String(globalTime.seconds).padStart(2, "0");

        globalStopwatchLabel.textContent = `${hour}:${minute}:${second}`;
        if (settings.tickingEnabled) {
            ticking_audio.play();
        }
        
        if (globalTime.minutes % settings.cyclePeriod == 0 && globalTime.seconds == 0) {
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

    const taskItem = document.createElement('task-item') as HTMLElement;
    taskItem.setAttribute('title', task.name);
    taskItem.setAttribute('dueDate', task.dueDate);
    taskItem.setAttribute('description', task.description);

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
    console.log(tasks);
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
    const customEvent = event as CustomEvent<{ id: string }>;
    const id = customEvent.detail.id;
    // Find the task's position in our array. findIndex returns -1 when
    // nothing matches — always guard against that before splicing!
    const index = tasks.findIndex((task: Task) => task.id === id);
    if (index === -1) {
        return;
    }


    const [removed] = tasks.splice(index, 1);
    const element = taskItems.querySelector(`task-item[id="${id}"]`);
    element?.remove();

    try {
        // Persist the deletion. `await` so a failure lands in `catch`.
        await deleteTask(id);
    } catch (error) {

        console.error('Failed to delete task, restoring it.', error);
        tasks.splice(index, 0, removed);
        RenderTasks();
    }
});

taskItems.addEventListener('task-edition', async (event: Event) => {
    const customEvent = event as CustomEvent<{ task: Task }>;
    const editedTask = customEvent.detail.task;

    const index = tasks.findIndex(
        (task: Task) => task.id === editedTask.id
    );

    if (index === -1) {
        return;
    }

    const oldTask = tasks[index];

    // Update local state
    tasks[index] = editedTask;

    try {
        // Persist the edit
        await editTask({
            newData: editedTask
        });

        // Replace the visual element
        const oldElement = taskItems.querySelector(
            `task-item[id="${editedTask.id}"]`
        );

        oldElement?.replaceWith(createTaskElement(editedTask));

    } catch (error) {
        console.error('Failed to edit task, restoring old task.', error);

        // Roll back local state
        tasks[index] = oldTask;
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
