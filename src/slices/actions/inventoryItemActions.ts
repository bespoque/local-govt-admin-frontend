import api from "api";

export const fetchItems = async () => {
  return api.get("/inventory-items/getItems");
};

export const fetchInventoryItems = async (queryParams = {}) => {
  const queryString = Object.keys(queryParams)
    .map((key) => `${key}=${queryParams[key]}`)
    .join("&");

  const url = `/inventory-items${queryString ? `?${queryString}` : ""}`;
  return api.get(url);
};

export const updateInventoryItem = async (uniqueId, itemId) => {
  return api.patch(`/inventory-items/${itemId}`, {
    uniqueId,
  });
};
export const fetchAllInventoryItems = async () => {
  return api.get("/inventory-items");
};
