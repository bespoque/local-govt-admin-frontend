import api from "api";

export const logErrors = async (data) => {
  return api.post("/logUiError", data);
};
