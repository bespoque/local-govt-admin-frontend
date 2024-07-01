import api from "api";

export const createRevHead = async (data) => {
  return api.post(`/revenuechart/RevenueHeads.php/create`, data);
};
export const fetchReHead = async () => {
  return api.get(`/revenuechart/RevenueHeads.php/fetch`);
};
export const fetchReCat = async () => {
  return api.get(`/revenuechart/RevenueCategories.php/fetch`);
};
export const createRevcat = async (data) => {
  return api.post(`/revenuechart/RevenueCategories.php/create`, data);
};
export const createRevItem = async (data) => {
  return api.post(`/revenuechart/RevenueItems.php/create`, data);
};

