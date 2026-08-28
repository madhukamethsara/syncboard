import { apiRequest } from "./api";

export function getBoards() {
  return apiRequest("/boards");
}

export function getBoardById(boardId) {
  return apiRequest(`/boards/${boardId}`);
}

export function createBoard(boardData) {
  return apiRequest("/boards", {
    method: "POST",
    body: JSON.stringify(boardData),
  });
}

export function updateBoard(boardId, boardData) {
  return apiRequest(`/boards/${boardId}`, {
    method: "PATCH",
    body: JSON.stringify(boardData),
  });
}

export function deleteBoard(boardId) {
  return apiRequest(`/boards/${boardId}`, {
    method: "DELETE",
  });
}