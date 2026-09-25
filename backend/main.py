from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from file_handler import FileHandler

TASKS_FILE = str(Path(__file__).resolve().parent.parent / "data" / "tasks.json")
PAGES_FOLDER = str(Path(__file__).resolve().parent.parent / "frontend" )

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class Task(BaseModel):
    name:str
    description:str
    dueDate:str
    id:str
    timeSpent:int

class deleteTaskRequest(BaseModel):
    taskId: str

@app.get("/tasks")
def getData():
    return FileHandler.readData(TASKS_FILE)

@app.post("/tasks")
def createTask(task: Task):

    tasks = FileHandler.readData(TASKS_FILE)

    new_task = task.model_dump()

    tasks.append(new_task)

    FileHandler.writeData(TASKS_FILE, tasks)

    return {
        "message": "Task has been genesified successfully",
        "task": new_task
    }
class editTaskRequest(BaseModel):
    newData:Task

@app.post('/edit/tasks')
def editTask(request:editTaskRequest):

    tasks = FileHandler.readData(TASKS_FILE)

    tasks = [request.model_dump()['newData'] if request.newData.id == task['id'] else task for task in tasks]

    FileHandler.writeData(TASKS_FILE, tasks)

    return {
        "message": "Task edited with happy success uwu"
    }

@app.delete("/tasks")
def deleteTask(request: deleteTaskRequest):
    tasks = FileHandler.readData(TASKS_FILE)

    tasks = [task for task in tasks if task["id"] != request.taskId]

    FileHandler.writeData(TASKS_FILE, tasks)

    return {
        "message": "Task deleted successfully"
    }

#app.mount("/", StaticFiles(directory=PAGES_FOLDER, html=True), name="pages")