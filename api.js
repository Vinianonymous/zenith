const apiURL = "http://localhost:8000/";
export async function getTasks() {
    const response = await fetch(apiURL + "tasks", {
        method: "GET",
        headers: {
            contentType: "application/json",
        },
    });
    return await response.json();
}
export async function newTask(task) {
    const response = await fetch(apiURL + "tasks", {
        method: "POST",
        headers: {
            contentType: "application/json",
        },
        body: JSON.stringify(task),
    });
    return await response.json();
}
export async function deleteTask(taskID) {
    const response = await fetch(apiURL + "tasks", {
        method: "DELETE",
        headers: {
            contentType: "application/json",
        },
        body: JSON.stringify(taskID),
    });
    return await response.json();
}
