import api from "api";

export const fetchRoles = async () => {
  return api.get("/users/roles");
};
export const listGroups = async (data) => {
  return api.post("/administrator/GroupList.php", data);
};
export const fetchGroup = async (data) => {
  return api.post("/administrator/GroupSingle.php", data);
};
