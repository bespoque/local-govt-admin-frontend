import api from "api";

export const listGroups = async (data) => {
  return api.post("/administrator/GroupList.php", data);
};
export const listPermissions = async (data) => {
  return api.post("/administrator/SystemPermissionsList.php", data);
};
export const createGroup = async (data) => {
  return api.post("/administrator/GroupCreate.php", data);
};
export const fetchGroup = async (data) => {
  return api.post("/administrator/GroupSingle.php", data);
};
export const updateGroup = async (data) => {
  return api.post("/administrator/GroupUpdate.php", data);
};
