const apiURL = "http://localhost:8000/";
export async function getTasks() {
    const response = await fetch(apiURL + "tasks");
    return await response.json();
}
export async function newTask(task) {
    const response = await fetch(apiURL + "tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });
    return await response.json();
}
