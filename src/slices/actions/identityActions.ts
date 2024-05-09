import api from "api";

export const fetchIndIdentity = async (data) => {
  return api.post(`/identitymgt/IndividualsList.php`, data);
};
export const fetchCorporateIndIdentity = async (data) => {
  return api.post(`/identitymgt/CorporateList.php`, data);
};
export const createIndvIdentity = async (data) => {
  return api.post(`/identitymgt/IndividualCreate.php`, data);
};
export const fetchSingleIndTp = async (data) => {
  return api.post("/identitymgt/IndividualSingle.php", data);
};
export const updateSingleIndTp = async (data) => {
  return api.post("/identitymgt/IndividualUpdate.php", data);
};
