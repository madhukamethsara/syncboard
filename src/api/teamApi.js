const API_URL = "http://localhost:5000/api";

export const getTeams = async () => {
  const response = await fetch(`${API_URL}/teams`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load teams");
  }

  return data;
};

export const getTeamById = async (teamId) => {
  const response = await fetch(`${API_URL}/teams/${teamId}`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load team");
  }

  return data;
};

export const createTeam = async (name) => {
  const response = await fetch(`${API_URL}/teams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create team");
  }

  return data;
};

export const updateTeam = async (teamId, name) => {
  const response = await fetch(`${API_URL}/teams/${teamId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update team");
  }

  return data;
};

export const deleteTeam = async (teamId) => {
  const response = await fetch(`${API_URL}/teams/${teamId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete team");
  }

  return data;
};

export const inviteByEmail = async (teamId, email) => {
  const response = await fetch(
    `${API_URL}/teams/${teamId}/invite`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send invitation");
  }

  return data;
};

export const joinTeamByCode = async (code) => {
  const response = await fetch(`${API_URL}/teams/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ code }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to join team");
  }

  return data;
};

export const getJoinCode = async (teamId) => {
  const response = await fetch(
    `${API_URL}/teams/${teamId}/join-code`,
    {
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get join code");
  }

  return data;
};

export const regenerateJoinCode = async (teamId) => {
  const response = await fetch(
    `${API_URL}/teams/${teamId}/join-code/regenerate`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to regenerate join code"
    );
  }

  return data;
};

export const updateMemberRole = async (
  teamId,
  userId,
  role
) => {
  const response = await fetch(
    `${API_URL}/teams/${teamId}/members/${userId}/role`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ role }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update role");
  }

  return data;
};
