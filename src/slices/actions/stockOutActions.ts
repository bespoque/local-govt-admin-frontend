import api from "api";

export const createStockOut = async (data) => {
  return api.post("/stock-outs/initiate", data);
};
export const createStockOutRequest = async (data) => {
  return api.post("stock-out-requests/initiate", data);
};
export const updateStockOutRequest = async (data, requestId) => {
  return api.patch(`stock-out-requests/${requestId}`, data);
};
export const updateStockOut = async (data, orderId) => {
  return api.patch(`/stock-outs/${orderId}`, data);
};

export const fetchStockOuts = async (queryParams = {}) => {
  const queryString = Object.keys(queryParams)
    .map((key) => `${key}=${queryParams[key]}`)
    .join("&");

  const url = `/stock-outs${queryString ? `?${queryString}` : ""}`;

  return api.get(url);
};

export const fetchStockOutByOrderId = async (stockOutOrderId) => {
  return api.get(`/stock-outs/${stockOutOrderId}`);
};

export const verifyStockOut = async (stockOutOrderId) => {
  return api.post(`/stock-outs/${stockOutOrderId}/verify`);
};

export const approveStockOut = async (stockOutOrderId) => {
  return api.post(`/stock-outs/${stockOutOrderId}/approve`);
};
export const auditStockOut = async ({auditComments}, stockOutOrderId) => {
  return api.post(`/stock-outs/${stockOutOrderId}/audit`, {auditComments});
};

export const sendOutStockOut = async (stockOutOrderId) => {
  return api.post(`/stock-outs/${stockOutOrderId}/sendOut`);
};
export const rejectStockOutRequest = async (requestId) => {
  return api.post(`stock-out-requests/${requestId}/reject`);
};
