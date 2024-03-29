import api from "api";

export const authenticate = async (data) => {
  return api.post("/auth/login", data);
};

export const updatePassword = async (data) => {
  return api.post("/users/updatePassword", data);
};
