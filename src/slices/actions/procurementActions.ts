import api from "api";

export const createPurchasingOrder = async (data) => {
  return api.post("/procurements/initiate", data);
};
export const updatePurchasingOrder = async (data, orderId) => {
  return api.patch(`/procurements/${orderId}`, data);
};

export const fetchAllProcurements = async () => {
  return api.get("/procurements");
};
export const fetchProcurementsByStatus = async (status) => {
  return api.get(`/procurements/byStatus?status=${status}`);
};
export const fetchProcurementsByOrderId = async (orderId) => {
  return api.get(`/procurements/${orderId}/purchaseOrder`);
};
export const verifyProcurement = async (orderId) => {
  return api.post(`/procurements/${orderId}/verify`);
};
export const auditProcurement = async ({auditComments}, orderId) => {
  return api.post(`/procurements/${orderId}/audit`, {auditComments});
};
export const approveProcurement = async (orderId) => {
  return api.post(`/procurements/${orderId}/approve`);
};
export const ecApproveProcurement = async (orderId) => {
  return api.post(`/procurements/${orderId}/ecApprove`);
};
export const uploadFile = async (formData) => {
  return api.post("/documents/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const sendOut = async (orderId) => {
  return api.post(`/procurements/${orderId}/sendOut`);
};
export const financeApprove = async ({documentId}, orderId) => {
  return api.post(`/procurements/${orderId}/financeApprove`, {
    documentId,
  });
};
export const getUploadedDocument = async (documentId) => {
  return api.get(`/documents/${documentId}`);
};
