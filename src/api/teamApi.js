import { apiRequest } from "./api";

export const getTeams = async () => {
  return apiRequest("/teams");
};

export const getTeamById = async (teamId) => {
  return apiRequest(`/teams/${teamId}`);
};

export const createTeam = async (name) => {
  return apiRequest("/teams", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
};

export const updateTeam = async (teamId, name) => {
  return apiRequest(`/teams/${teamId}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
};

export const deleteTeam = async (teamId) => {
  return apiRequest(`/teams/${teamId}`, {
    method: "DELETE",
  });
};

export const inviteByEmail = async (teamId, email) => {
  return apiRequest(`/teams/${teamId}/invite`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const joinTeamByCode = async (code) => {
  return apiRequest("/teams/join", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
};

export const getJoinCode = async (teamId) => {
  return apiRequest(`/teams/${teamId}/join-code`);
};

export const regenerateJoinCode = async (teamId) => {
  return apiRequest(`/teams/${teamId}/join-code/regenerate`, {
    method: "POST",
  });
};

export const updateMemberRole = async (teamId, userId, role) => {
  return apiRequest(`/teams/${teamId}/members/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
};
