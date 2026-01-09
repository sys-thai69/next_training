import { Project, Task } from "./types";

const API_URL = "http://localhost:3001";

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_URL}/projects`);
  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }
  return res.json();
}

export async function getProject(id: string): Promise<Project> {
  const res = await fetch(`${API_URL}/projects/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch project");
  }
  return res.json();
}

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return res.json();
}

export async function getTask(id: string): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch task");
  }
  return res.json();
}

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks?projectId=${projectId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return res.json();
}

export async function updateTaskStatus(
  taskId: string,
  status: "todo" | "in-progress" | "done"
): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error("Failed to update task");
  }
  return res.json();
}

export async function updateSubtask(
  taskId: string,
  subtasks: { id: string; title: string; completed: boolean }[]
): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subtasks }),
  });
  if (!res.ok) {
    throw new Error("Failed to update subtask");
  }
  return res.json();
}
