import api from "api";

export const authenticate = async (data) => {
  return api.post("/auth/login.php", data);
  // return api.post("/auth/login", data);
  // return api.post("/user/login", data);
};

export const updatePassword = async (data) => {
  return api.post("/basic/user_password.php", data);
  // return api.post("/users/updatePassword", data);
};
