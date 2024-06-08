import api from "api";

export const authenticate = async (data) => {
  return api.post("/authse/login.php", data);
};

export const updatePassword = async (data) => {
  return api.post("/basic/user_password.php", data);
};
