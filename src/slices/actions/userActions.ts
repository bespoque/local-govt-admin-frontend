import api from "api";

export const listUsers = async (data) => {
  return api.post("/administrator/UsersList.php", data);
};
export const fetchSingleUser = async (data) => {
  return api.post("/administrator/UserProfileShow.php", data);
};
export const usersCreate = async (data) => {
  return api.post("/administrator/UserCreate.php", data);
};
export const userUpdate = async (data) => {
  return api.post("/administrator/UserUpdate.php", data);
};
export const fetchLocalGvts = async (data) => {
  return api.post(`/administrator/ClientsList.php`, data);
};
export const fetchWards = async (data) => {
  return api.post(`/administrator/WardsList.php`, data);
};
