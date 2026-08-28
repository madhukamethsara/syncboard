const API_URL = "http://localhost:5000/api/tasks";

export async function getTasks(boardId) {
  const response = await fetch(
    `${API_URL}/board/${boardId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load tasks"
    );
  }

  return data;
}

export async function createTask(
  taskData
) {
  const response = await fetch(
    API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      credentials: "include",
      body: JSON.stringify(taskData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create task"
    );
  }

  return data;
}

export async function updateTask(
  taskId,
  updates
) {
  const response = await fetch(
    `${API_URL}/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updates),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update task"
    );
  }

  return data;
}

export async function deleteTask(
  taskId
) {
  const response = await fetch(
    `${API_URL}/${taskId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete task"
    );
  }

  return data;
}

export async function addTaskComment(
  taskId,
  text
) {
  const response = await fetch(
    `${API_URL}/${taskId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        text,
      }),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to add comment"
    );
  }

  return data;
}