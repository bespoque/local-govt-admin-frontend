import moment from "moment";
import {IVehicleLicenceRequest} from "./interface";

export const vehicleLicenseInfoPairs = (vlr: IVehicleLicenceRequest) => [
  {label: "Request Date", value: moment(vlr?.createdAt).format("MMMM Do YYYY")},
  {label: "Status", value: vlr?.status},

  {
    label: "Verified At",
    value: vlr?.verifiedAt
      ? moment(vlr?.verifiedAt).format("MMMM Do YYYY")
      : "N/A",
  },
  {
    label: "Approved At",
    value: vlr?.approvedAt
      ? moment(vlr?.approvedAt).format("MMMM Do YYYY")
      : "N/A",
  },
  // Use a property to indicate the separator
  {
    isSeparator: true,
  },

  {
    label: "Initiator Name",
    value: `${vlr?.initiator?.firstName} ${vlr?.initiator?.lastName}`,
  },
  {label: "Initiator Phone", value: vlr?.initiator?.phone},
  {
    label: "Verifier Name",
    value: `${vlr?.verifier?.firstName} ${vlr?.verifier?.lastName}`,
  },
  {label: "Verifier Phone", value: vlr?.verifier?.phone},
  {
    label: "Approver Name",
    value: `${vlr?.approver?.firstName} ${vlr?.approver?.lastName}`,
  },
  {label: "Approver Phone", value: vlr?.approver?.phone},
];
