const API_URL = "http://localhost:5000/api/columns";

export async function getColumns(boardId) {
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
      data.message || "Failed to load columns"
    );
  }

  return data;
}

export async function createColumn(
  boardId,
  columnData
) {
  const response = await fetch(
    API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        name: columnData.name,
        boardId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create column"
    );
  }

  return data;
}

export async function updateColumn(
  columnId,
  updates
) {
  const response = await fetch(
    `${API_URL}/${columnId}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(updates),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update column"
    );
  }

  return data;
}

export async function deleteColumn(
  columnId
) {
  const response = await fetch(
    `${API_URL}/${columnId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete column"
    );
  }

  return data;
}