import moment from "moment";
import {IProcurement} from "./procurement.interface";

export const procurementOrderInfoPairs = (po: IProcurement) => [
  {label: "Order ID", value: po?.orderId},
  {label: "Description", value: po?.description},
  {label: "Status", value: po?.status},
  {label: "Order Date", value: moment(po?.createdAt).format("MMMM Do YYYY")},
  {
    label: "Sent Out At",
    value: po?.sentOutAt ? moment(po?.sentOutAt).format("MMMM Do YYYY") : "N/A",
  },
  {
    label: "Expected Date",
    value: po?.expectedDate
      ? moment(po?.expectedDate).format("MMMM Do YYYY")
      : "N/A",
  },
  {
    label: "Verified At",
    value: po?.verifiedAt
      ? moment(po?.verifiedAt).format("MMMM Do YYYY")
      : "N/A",
  },
  {
    label: "Approved At",
    value: po?.approvedAt
      ? moment(po?.approvedAt).format("MMMM Do YYYY")
      : "N/A",
  },
  {
    label: "Delivered At",
    value: po?.deliveredAt
      ? moment(po?.deliveredAt).format("MMMM Do YYYY")
      : "N/A",
  },
  {
    label: "EC Approved At",
    value: po?.ecApprovedAt
      ? moment(po?.ecApprovedAt).format("MMMM Do YYYY")
      : "N/A",
  },
  // Use a property to indicate the separator
  {
    isSeparator: true,
  },
  {label: "Vendor Name", value: po?.vendor?.name},
  {label: "Vendor Phone", value: po?.vendor?.phone},
  {
    label: "Initiator Name",
    value: `${po?.initiator?.firstName} ${po?.initiator?.lastName}`,
  },
  {label: "Initiator Phone", value: po?.initiator?.phone},
  {
    label: "Verifier Name",
    value: `${po?.verifier?.firstName} ${po?.verifier?.lastName}`,
  },
  {label: "Verifier Phone", value: po?.verifier?.phone},
  // Use a property to indicate the separator
  {
    isSeparator: true,
  },
  {
    label: "Approver Name",
    value: `${po?.approver?.firstName} ${po?.approver?.lastName}`,
  },
  {label: "Approver Phone", value: po?.approver?.phone},
];
