from fastapi import FastAPI
from pydantic import BaseModel
from json import dump, load


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
        except FileNotFoundError:
            with open(filename, "w") as f:
                return []


taskList = FileHandler.readData("tasks.json")

app = FastAPI()


class Task(BaseModel):
    title: str
    description: str
    due: str
    id: str
    timeSpent: int


@app.get("/tasks")
def getTasks():
    return FileHandler.readData("tasks.json")


@app.post("/tasks")
def newTask(task: Task):
    raw = task.model_dump()
    tasks = getTasks()
    tasks.append(raw)
    FileHandler.writeData(taskList, "tasks.json")


@app.delete("/tasks")
def deleteTask(taskID: str):
    tasks = getTasks()
    tasks = [task for task in tasks if task["id"] != taskID]
    FileHandler.writeData(tasks, "tasks.json")
