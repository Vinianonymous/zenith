from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from file_handler import FileHandler

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

# Read Tasks
@app.get("/tasks")
def getData():
    return FileHandler.readData("tasks.json")

# TODO: Now I get a 422 AAAAAAA
@app.get("/tasks")
def get_tasks():
    return tasks
@app.post("/tasks")
def createTask(task: Task):
    # 1. Read the existing data
    tasks = FileHandler.readData("tasks.json")

    # 2. Convert the Pydantic Task into a normal Python dictionary
    new_task = task.model_dump()

    # 3. Add it to the existing task list
    tasks.append(new_task)

    # 4. Save everything back to the file
    FileHandler.writeData("tasks.json", tasks)

    return {
        "message": "Task has been genesified successfully",
        "task": new_task
    }

@app.delete("/tasks/{taskId}")
def deleteTask(taskId: str):
    tasks = FileHandler.readData("tasks.json")
    tasks = [task for task in tasks if task["id"] != taskId]
    FileHandler.writeData("tasks.json", tasks)
    return {
        "message": "Task Terminated."
    }
