import api from "api";

export const fetchVendors = async () => {
  return api.get(`/vendors`);
};
