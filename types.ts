// ============================================================================
// types.ts — SHARING A SHAPE BETWEEN FILES
// ============================================================================
// This file holds ONE thing: the definition of what a "Task" looks like.
// Any other file that needs to talk about tasks writes:
//     import { Task } from "./types.js";
// ...and then TypeScript will check that the objects they build really do
// have these four fields with these types. That catches typos like
// `task.titel` at COMPILE time instead of at runtime in the browser.
//
// NOTE for beginners: we import from "./types.js" (with a .js extension)
// even though this file is types.TS. That is on purpose: after compiling,
// the file on disk will be types.js, and browsers can only load .js files.
// TypeScript is smart enough to resolve "./types.js" back to "./types.ts".

// `export` makes this name usable in other files via `import`.
// `type` (as opposed to `interface` or `class`) just describes a SHAPE —
// it creates no runtime code at all. After compiling, this whole file
// becomes a single empty line (`export {};`). Types are erased!
export type Task = {
    // The title the user typed, e.g. "Buy milk".
    name: string;
    // Due date as an ISO string ("2026-09-10") or "" when unset.
    // We keep it a plain string so it survives JSON without conversion.
    dueDate: string;
    // Longer free-text notes. May be "".
    description: string;
    // Unique id generated with crypto.randomUUID() when the task is created.
    // The backend uses this to know WHICH task to delete.
    id: string;
};

// [Vinny work] Changed cyclePeriod from string to number — both configure.html
// and main.ts treat it as a number (the input is type="number", the alarm uses
// modulo arithmetic). Keeping it as string caused silent NaN bugs.
export type Settings = {
    cyclePeriod: number;
    cycleAlarmPath: string;
}
