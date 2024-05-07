import api from "api";

export const fetchIndIdentity = async (data) => {
  return api.post(`/identitymgt/IndividualsList.php`, data);
};
export const createIndvIdentity = async (data) => {
  return api.post(`/identitymgt/IndividualCreate.php`, data);
};

