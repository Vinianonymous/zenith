# ============================================================================
# main.py — THE BACKEND: a tiny HTTP API built with FastAPI
# ============================================================================
# While main.ts runs IN THE BROWSER, this file runs on YOUR COMPUTER as a
# server (start it with `uvicorn main:app --reload`, or via the `fastapi`
# command). The frontend talks to it over HTTP (see api.ts):
#
#   GET    /tasks   -> return all tasks
#   POST   /tasks   -> create one task (JSON body)
#   DELETE /tasks   -> delete one task by id (JSON body {taskId: ...})
#
# FASTAPI IN 30 SECONDS: it maps URLs to plain Python functions. You write a
# normal function, put a DECORATOR like @app.get("/tasks") above it, and
# FastAPI (1) listens for matching HTTP requests, (2) converts/validates
# inputs using your type hints + Pydantic models, (3) calls your function,
# (4) serializes whatever you return into JSON. Enum of ideas below.

# --- Imports: tools from installed libraries + the standard library. ---
# FastAPI: the web framework itself (routing, validation, JSON responses).
# Path: object-oriented file paths. Used to locate data/tasks.json relative
# to THIS file, so the server works no matter which folder you start it from.
from pathlib import Path

from fastapi import FastAPI

# CORSMiddleware: the plugin that implements CORS (explained below).
from fastapi.middleware.cors import CORSMiddleware

# BaseModel: Pydantic's base class for declaring "shapes" of JSON data with
# automatic validation (the Python cousin of the Task type in types.ts).
from pydantic import BaseModel

# Our own helper for reading/writing the JSON data file.
from file_handler import FileHandler

# Task data lives outside the Live Server watch set so frontend
# auto-reload doesn't trigger a full page refresh on every write.
# __file__ = the path of THIS file (main.py). .resolve() makes it absolute
# (resolving symlinks), .parent is its folder, / "data" / "tasks.json"
# JOINS path segments with the correct separator for your OS. str(...) turns
# the Path object into a plain string for FileHandler.
TASKS_FILE = str(Path(__file__).resolve().parent / "data" / "tasks.json")

# Create THE application object. `uvicorn main:app` means "in file main.py,
# find the variable named app". All @app decorators below register routes
# ON this object.
app = FastAPI()
# --- CORS setup: who is allowed to call this API from a browser. ---
# The frontend page is served from one origin (e.g. Live Server on
# http://127.0.0.1:5500) while this API lives on another
# (http://127.0.0.1:8000). Browsers BLOCK such cross-origin fetch() calls
# UNLESS the server explicitly opts in via CORS headers — that opt-in is
# what this middleware adds to every response.
# allow_origins=["*"] = accept requests from ANY website. Convenient for
# local development, DANGEROUS in production (any site could then read and
# modify your tasks) — restrict this to your real frontend domain on deploy.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA MODELS: the exact shapes of JSON this API accepts. ---
# class Task(BaseModel) declares: "a valid task is a dict with THESE keys
# and THESE value types". When a POST arrives, FastAPI parses the JSON body
# and validates it against this model AUTOMATICALLY: missing/wrong-typed
# fields get a 422 error response without you writing any checks. Inside the
# handler, `task` is then a Task OBJECT (not a raw dict) with .name etc.
# NOTE: field names/types must match what api.ts sends AND what the
# frontend's Task type declares — the three files form one contract.
class Task(BaseModel):
    name:str
    description:str
    dueDate:str
    id:str

# Shape of the DELETE request body: {"taskId": "..."}. A separate tiny model
# because a delete request carries only an id, not a whole task.
class deleteTaskRequest(BaseModel):
    taskId: str

# --- ROUTES: URL -> function. Each decorator says "when a request with this
# HTTP method arrives at this path, call the function below it". ---

# Read Tasks
# @app.get("/tasks") registers getData() as the handler for GET /tasks.
# Whatever it RETURNS gets serialized to JSON as the response body — here a
# Python list of dicts becomes a JSON array, which api.ts receives from
# response.json(). (FastAPI runs this `def` function directly; `async def`
# would also work and is preferred for slow I/O, but plain `def` is fine
# for quick file reads — FastAPI runs it in a threadpool automatically.)
@app.get("/tasks")
def getData():
    return FileHandler.readData(TASKS_FILE)

# @app.post("/tasks"): handles POST /tasks. The `task: Task` PARAMETER is
# special: FastAPI sees a Pydantic model annotation on a POST handler and
# knows "this comes from the JSON request body — parse + validate it". So
# the frontend's JSON.stringify(task) in api.ts becomes this `task` object.
@app.post("/tasks")
def createTask(task: Task):
    # 1. Read the existing data
    tasks = FileHandler.readData(TASKS_FILE)

    # 2. Convert the Pydantic Task into a normal Python dictionary
    # .model_dump() turns the validated object back into a plain dict so it
    # can be appended to the list and passed to json.dump (which wouldn't
    # understand a Task object directly).
    new_task = task.model_dump()

    # 3. Add it to the existing task list
    tasks.append(new_task)

    # 4. Save everything back to the file
    FileHandler.writeData(TASKS_FILE, tasks)

    # The response: FastAPI serializes this dict to JSON. The frontend
    # currently ignores the body of POST responses (it already has the task
    # object), but returning it is good practice for API clients.
    return {
        "message": "Task has been genesified successfully",
        "task": new_task
    }


# @app.delete("/tasks"): handles DELETE /tasks. Same body-parsing trick as
# POST: `request: deleteTaskRequest` means "parse the JSON body into this
# model", giving us request.taskId with validation for free.
@app.delete("/tasks")
def deleteTask(request: deleteTaskRequest):
    tasks = FileHandler.readData(TASKS_FILE)

    # Rebuild the list WITHOUT the deleted task. This LIST COMPREHENSION
    # reads as: "keep every task whose id is NOT the requested one".
    # [expression FOR item IN list IF condition] — the compact Python way to
    # write filter loops. The result is a NEW list; the old one is discarded.
    tasks = [task for task in tasks if task["id"] != request.taskId]

    FileHandler.writeData(TASKS_FILE, tasks)

    return {
        "message": "Task deleted successfully"
    }
