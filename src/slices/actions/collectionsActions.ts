import api from "api";

export const fetchCollections = async (data) => {
  return api.post(`/collections/CollectionsList.php`, data);
};
