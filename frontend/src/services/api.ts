

import {Task, editTaskRequest} from "../types/types.js"

const API_URL = "";

export async function getTasks() {

    const response = await fetch(`${API_URL}/tasks`);

    return await response.json();
}

export async function addTask(task: Task): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(task)
    });

    return await response.json();
}

export async function deleteTask(taskId:string) {
    const response = await fetch(`${API_URL}/tasks`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({taskId: taskId})
        }
    )
    return await response.json();
}

export async function editTask(request: editTaskRequest) {
    const response = await fetch(`${API_URL}/edit/tasks`,
        {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)

        }
    )
    return await response.json;
}
