import { apiRequest } from "./api";

export const updateCurrentUser = async (updates) => {
  return apiRequest("/users/me", {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
};

export const changeCurrentUserPassword = async (passwords) => {
  return apiRequest("/users/me/password", {
    method: "PATCH",
    body: JSON.stringify(passwords),
  });
};
