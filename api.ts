const apiURL = "http://localhost:8000/";

export type Task = {
  title: string;
  desc: string;
  due: string;
  id: string;
  timeSpent: number;
};

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(apiURL + "tasks");
  return await response.json();
}

export async function newTask(task: Task) {
  const response = await fetch(apiURL + "tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  return await response.json();
}

export async function deleteTask(taskID: string) {
  const tasks = await getTasks();
  const task: Task = tasks.find((task) => task.id === taskID) as Task;
  const response = await fetch(apiURL + "tasks", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  return await response.json();
}

export async function updateTask(task: Task) {
  const response = await fetch(apiURL + "tasks", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  return await response.json();
}
