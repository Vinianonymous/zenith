from json import dump, load, JSONDecodeError

from pydantic import BaseModel

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

TASK_FILE = Path(__file__).parent.parent / "data" / "tasks.json"


class FileHandler:
    @classmethod
    def writeData(cls, data, filename):
        with open(filename, "w") as f:
            dump(data, f)

    @classmethod
    def readData(cls, file):
        filename = file.absolute()
        try:
            with open(filename, "r") as f:
                return load(f)
        except (JSONDecodeError, FileNotFoundError):
            with open(filename, "w") as f:
                dump([], f)
                return []


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
    tasks = FileHandler.readData(TASK_FILE)

    return tasks


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
