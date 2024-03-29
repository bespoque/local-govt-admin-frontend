import api from "api";

export const initiateStockIn = async (payload) => {
  return api.post("/stock-ins/initiate", payload);
};

export const updateStockIn = async (stockInId, payload) => {
  return api.patch(`/stock-ins/${stockInId}`, payload);
};

export const fetchStockIns = async () => {
  return api.get("/stock-ins");
};
export const fetchStockIn = async (stockInId) => {
  return api.get(`/stock-ins/${stockInId}`);
};
export const verifyStockIn = async (stockInId) => {
  return api.post(`/stock-ins/${stockInId}/verify`);
};
export const auditStockIn = async ({auditComments}, stockInId) => {
  return api.post(`/stock-ins/${stockInId}/audit`, {
    auditComments,
  });
};
export const approveStockIn = async (stockInId) => {
  return api.post(`/stock-ins/${stockInId}/approve`);
};
