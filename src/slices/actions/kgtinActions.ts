import api from "api";

export const fetchKgtin = async (taxId, taxPayerType) => {
  return api.get(`/rhm/${taxId}/type/${taxPayerType}`);
};
