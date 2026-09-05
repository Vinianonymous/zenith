from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from pydantic import BaseModel
from file_handler import FileHandler

# Task data lives outside the Live Server watch set so frontend
# auto-reload doesn't trigger a full page refresh on every write.
TASKS_FILE = str(Path(__file__).resolve().parent / "data" / "tasks.json")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    name:str
    description:str
    dueDate:str
    id:str

class deleteTaskRequest(BaseModel):
    taskId: str

# Read Tasks
@app.get("/tasks")
def getData():
    return FileHandler.readData(TASKS_FILE)

@app.post("/tasks")
def createTask(task: Task):
    # 1. Read the existing data
    tasks = FileHandler.readData(TASKS_FILE)

    # 2. Convert the Pydantic Task into a normal Python dictionary
    new_task = task.model_dump()

    # 3. Add it to the existing task list
    tasks.append(new_task)

    # 4. Save everything back to the file
    FileHandler.writeData(TASKS_FILE, tasks)

    return {
        "message": "Task has been genesified successfully",
        "task": new_task
    }


@app.delete("/tasks")
def deleteTask(request: deleteTaskRequest):
    tasks = FileHandler.readData(TASKS_FILE)

    tasks = [task for task in tasks if task["id"] != request.taskId]

    FileHandler.writeData(TASKS_FILE, tasks)

    return {
        "message": "Task deleted successfully"
    }