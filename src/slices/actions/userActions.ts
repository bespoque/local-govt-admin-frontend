import api from "api";

export const fetchUsers = async () => {
  return api.get("/users?page=1&limit=100");
};

export const fetchUser = async ({userSlug}) => {
  return api.post("/users/getUser", {userSlug});
};

export const createUser = async (data) => {
  return api.post("/users/create", data);
};
export const listUsers = async (data) => {
  return api.post("/administrator/UsersList.php", data);
};
export const usersCreate = async (data) => {
  return api.post("/administrator/UserCreate.php", data);
};


export const updateUser = async (userSlug, data) => {
  return api.patch(`/users/${userSlug}`, data);
};
export const deactivateUser = async (userSlug) => {
  return api.patch(`/users/${userSlug}/deactivate`);
};
export const activateUser = async (userSlug) => {
  return api.patch(`/users/${userSlug}/activate`);
};
export const resetUserPassword = async (userSlug) => {
  return api.post(`/users/${userSlug}/resetPassword`);
};
export const fetchTaxOffices = async () => {
  return api.get(`/users/taxOffices`);
};
