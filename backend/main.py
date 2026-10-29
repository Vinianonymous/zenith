from pydantic import BaseModel

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import sqlite3

conn = sqlite3.connect("tasks.db", check_same_thread=False)
conn.row_factory = sqlite3.Row


def createTaskTable():
    with conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS taskList (
                id TEXT PRIMARY KEY NOT NULL,
                title TEXT NOT NULL,
                desc TEXT NOT NULL,
                due TEXT NOT NULL,
                timeSpent INTEGER NOT NULL
            )
        """)


createTaskTable()

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
            cursor.execute("SELECT id, title, desc, due, timeSpent FROM taskList")
            rows = cursor.fetchall()
            taskList = [dict(row) for row in rows]
            return taskList
    except sqlite3.OperationalError:
        createTaskTable()
        return []


@app.post("/tasks")
def newTask(task: Task):
    raw = task.model_dump()
    with conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT OR REPLACE INTO taskList (id, title, desc, due, timeSpent) VALUES (?, ?, ?, ?, ?)",
            (raw["id"], raw["title"], raw["desc"], raw["due"], raw["timeSpent"]),
        )
    return task


@app.delete("/tasks")
def deleteTask(task: Task):
    raw = task.model_dump()
    with conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM taskList WHERE id = ?", (raw["id"],))
    return {"status": "ok"}


@app.put("/tasks")
def updateTask(NewTask: Task):
    raw = NewTask.model_dump()
    with conn:
        cursor = conn.cursor()
        cursor.execute(
            """UPDATE taskList
               SET title = ?, desc = ?, due = ?, timeSpent = ?
               WHERE id = ?""",
            (raw["title"], raw["desc"], raw["due"], raw["timeSpent"], raw["id"]),
        )
    return NewTask


@app.get("/health")
def hey():
    print(
        "I am working okay! Don't care about the frontend tho so might have to watch out for that!"
    )
