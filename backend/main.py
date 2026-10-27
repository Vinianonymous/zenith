from json import dump, load, JSONDecodeError

from pydantic import BaseModel

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

import sqlite3

conn = sqlite3.connect("tasks.db", check_same_thread=False)
conn.row_factory = sqlite3.Row


def createTaskTable():
    with conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS taskList (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                due TEXT NOT NULL,
                desc TEXT NOT NULL,
                timeSpent INTEGER NOT NULL
            )
        """)


def sampleData():
    with conn:
        cursor = conn.cursor()
        task = ("abc", "hello", "2026-12-31", "Lame data", 123)
        cursor.execute("INSERT INTO taskList VALUES (?, ?, ? ,?, ?)", task)


TASK_FILE = Path(__file__).parent.parent / "data" / "tasks.json"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Task(BaseModel):
    title: str
    desc: str
    due: str
    id: str
    timeSpent: int


@app.get("/tasks")
def getTasks():
    try:
        with conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, due, desc, timeSpent FROM taskList")
            rows = cursor.fetchall()
            taskList = [dict(row) for row in rows]

    except sqlite3.OperationalError:
        createTaskTable()

    return taskList


@app.post("/tasks")
def newTask(task: Task):
    raw = task.model_dump()
    tasks = getTasks()
    tasks.append(raw)
    FileHandler.writeData(tasks, TASK_FILE)


@app.delete("/tasks")
def deleteTask(task: Task):
    raw = task.model_dump()
    tasks = FileHandler.readData(TASK_FILE)
    tasks = [task for task in tasks if task["id"] != raw["id"]]
    FileHandler.writeData(tasks, TASK_FILE)


@app.put("/tasks")
def updateTask(NewTask: Task):
    raw = NewTask.model_dump()
    print(raw)
    tasks = getTasks()
    for task in tasks:
        if task["id"] == raw["id"]:
            task["title"] = raw["title"]
            task["desc"] = raw["desc"]
            task["due"] = raw["due"]
    FileHandler.writeData(tasks, TASK_FILE)
