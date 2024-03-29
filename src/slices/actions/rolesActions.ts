import api from "api";

export const fetchRoles = async () => {
  return api.get("/users/roles");
};
