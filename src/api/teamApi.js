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
  const response = await fetch(
    "http://localhost:5000/api/teams",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create team"
    );
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

export const sendTeamInvitation = async (teamId, email, role) => {
  const response = await fetch(
    `${API_URL}/teams/${teamId}/invitations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        role,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send invitation");
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

export const acceptTeamInvitation = async (token) => {
  const response = await fetch(
    `${API_URL}/invitations/${token}/accept`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to accept invitation"
    );
  }

  return data;
};

export const getTeamInvitations = async (teamId) => {
  const response = await fetch(
    `http://localhost:5000/api/teams/${teamId}/invitations`,
    {
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load invitations"
    );
  }

  return data;
};