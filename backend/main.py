from json import dump, load, JSONDecodeError

from pydantic import BaseModel

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


class FileHandler:
    @classmethod
    def writeData(cls, data, filename):
        with open(filename, "w") as f:
            dump(data, f)

    @classmethod
    def readData(cls, filename):
        try:
            with open(filename, "r") as f:
                return load(f)
        except (JSONDecodeError, FileNotFoundError):
            with open(filename, "w") as f:
                dump([], f)
                return []


taskList = FileHandler.readData("tasks.json")

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
    tasks = FileHandler.readData("tasks.json")

    return tasks


@app.post("/tasks")
def newTask(task: Task):
    raw = task.model_dump()
    tasks = getTasks()
    tasks.append(raw)
    FileHandler.writeData(tasks, "tasks.json")


@app.delete("/tasks")
def deleteTask(taskID: str):
    tasks = getTasks()
    tasks = [task for task in tasks if task["id"] != taskID]
    FileHandler.writeData(tasks, "tasks.json")
