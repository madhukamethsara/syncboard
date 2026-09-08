import { apiRequest } from "./api";

export async function getTasks(boardId) {
  return apiRequest(`/tasks/board/${boardId}`);
}

export async function createTask(taskData) {
  return apiRequest("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
}

export async function updateTask(taskId, updates) {
  return apiRequest(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function deleteTask(taskId) {
  return apiRequest(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export async function addTaskComment(taskId, text) {
  return apiRequest(`/tasks/${taskId}/comments`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}
