// ============================================================================
// api.ts — TALKING TO THE BACKEND (HTTP LAYER)
// ============================================================================
// All network code lives here so the rest of the app never touches `fetch`
// directly. If the server address or the endpoints ever change, you only
// edit THIS file. Each function below is `async` (see explainer further down).

// We reuse the shared Task shape so the compiler guarantees we send
// well-formed tasks to the server.
import {Task} from "./types.js"

// The base address of the FastAPI backend (see main.py).
// The frontend (Live Server, usually :5500) and the backend (:8000) run on
// different ports, so every request below is "cross-origin" — that is why
// main.py enables CORS. Without CORS the browser would block these calls.
const API_URL = "http://127.0.0.1:8000";

// ---------------------------------------------------------------------------
// GET /tasks — read the whole list.
// ---------------------------------------------------------------------------
// `async` means: "this function does slow work (network) and returns a
// PROMISE". A Promise is an IOU: "I don't have the answer yet, but I will."
// Whoever calls getTasks() must either `await` it or use `.then()`.
// `await` PAUSES this function until the network answers, WITHOUT freezing
// the page — other code (the stopwatch, clicks) keeps running meanwhile.
export async function getTasks() {
    // fetch() sends one HTTP request and resolves to a Response object
    // once the response HEADERS arrive (the body may still be streaming).
    const response = await fetch(`${API_URL}/tasks`);
    // response.json() reads the body stream to the end and parses it as
    // JSON. It is async too, so we await it as well. The backend returns a
    // JSON array, so callers receive Task[].
    return await response.json();
}

// ---------------------------------------------------------------------------
// POST /tasks — create one task.
// ---------------------------------------------------------------------------
// Takes a Task, sends it as JSON, and resolves to whatever the server
// replies with. `: Promise<Task>` is the RETURN TYPE annotation: "this
// function returns a Promise that will eventually resolve to a Task".
// It documents the contract AND lets the compiler check callers.
export async function addTask(task: Task): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks`, {
        // The HTTP verb. GET (the default) only READS; POST says
        // "please CREATE this thing I'm sending you".
        method: "POST",
        // Headers are metadata about the request. This one tells the server
        // "the body below is JSON, please parse it as such" — FastAPI uses
        // it to validate the body against its own Task model (see main.py).
        headers: {
            "Content-Type": "application/json"
        },
        // The body must be a STRING, so we serialize the object with
        // JSON.stringify: {name:"x"} becomes '{"name":"x"}'.
        body: JSON.stringify(task)
    });

    return await response.json();
}

// ---------------------------------------------------------------------------
// DELETE /tasks — remove one task by id.
// ---------------------------------------------------------------------------
// REST convention would put the id in the URL (DELETE /tasks/abc-123), but
// this backend chose to receive it in the JSON body instead, so we follow
// that contract here: body = { taskId: "..." } (see deleteTaskRequest in
// main.py). `taskId: string` means callers MUST pass a string — passing a
// number or forgetting the argument is a compile error.
export async function deleteTask(taskId:string) {
    const response = await fetch(`${API_URL}/tasks`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            // Shorthand {taskId: taskId} could be written {taskId}, but the
            // long form is clearer while learning: key "taskId", value = the
            // function argument. This key name MUST match the backend model.
            body: JSON.stringify({taskId: taskId})
        }
    )
    return await response.json();
}
