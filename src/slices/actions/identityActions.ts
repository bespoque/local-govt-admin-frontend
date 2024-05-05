import api from "api";

export const fetchIndIdentity = async (data) => {
  return api.post(`/identitymgt/IndividualsList.php`, data);
};

