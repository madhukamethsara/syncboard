import { apiRequest } from "./api";

export async function getColumns(boardId) {
  return apiRequest(`/columns/board/${boardId}`);
}

export async function createColumn(boardId, columnData) {
  return apiRequest("/columns", {
    method: "POST",
    body: JSON.stringify({
      name: columnData.name,
      boardId,
    }),
  });
}

export async function updateColumn(columnId, updates) {
  return apiRequest(`/columns/${columnId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function deleteColumn(columnId) {
  return apiRequest(`/columns/${columnId}`, {
    method: "DELETE",
  });
}
