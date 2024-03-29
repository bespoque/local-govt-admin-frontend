import api from "api";

// Vehicle licence
export const createVehicleLicenseRequest = async (data) => {
  return api.post("/vehicle-licence-requests", data);
};

export const fetchVehicleDetails = async (plateNumber) =>
  api.get(`/vehicles/${plateNumber}`);

export const updateVehicleLicenseRequest = async (data, vlrId) => {
  return api.put(`/vehicle-licence-requests/${vlrId}`, data);
};

export const addVLDocuments = async (data, vlId, vehicleLicenceId) => {
  return api.patch(
    `vehicle-licence-requests/${vlId}/vehicle-licences/${vehicleLicenceId}`,
    data
  );
};

export const printVlrAssessment = async (licenceId) => {
  return api.post(`/vehicle-licence-requests/${licenceId}/createAssessment`);
};

export const verifyVlr = async (licenceId) => {
  return api.post(`/vehicle-licence-requests/${licenceId}/verify`);
};

export const approveVlr = async (licenceId) => {
  return api.post(`/vehicle-licence-requests/${licenceId}/approve`);
};

export const verifyExternalIds = async ({data, requestId, vehicleId}) => {
  return api.patch(
    `/vehicle-licence-requests/${requestId}/update-external-ids/${vehicleId}`,
    data
  );
};
export const sendToPrinterHandler = async (licenceId) => {
  return api.post(`/vehicle-licence-requests/${licenceId}/complete`);
};

// renewal
export const createVehicleLicenceRenewalRequest = async (data) => {
  return api.post("/vehicle-licence-requests/renew", data);
};

export const updateVehicleLicenseRenewalRequest = async (data, vlrId) => {
  return api.put(`/vehicle-licence-requests/renew/${vlrId}`, data);
};

// change of ownership
export const createChangeOfOwnershipRequest = async (data) => {
  return api.post("/change-ownerships", data);
};

export const updateChangeOfOwnershipRequest = async (data, vlrId) => {
  return api.put(`/change-ownerships/${vlrId}`, data);
};

export const printChangeOfOwnershipAssessment = async (licenceId) => {
  return api.post(`/change-ownerships/${licenceId}/createAssessment`);
};

export const verifyChangeOfOwnership = async (licenceId) => {
  return api.post(`/change-ownerships/${licenceId}/verify`);
};

export const approveChangeOfOwnership = async (licenceId) => {
  return api.post(`/change-ownerships/${licenceId}/approve`);
};

export const sendCofOToPrinterHandler = async (licenceId) => {
  return api.post(`/change-ownerships/${licenceId}/complete`);
};
