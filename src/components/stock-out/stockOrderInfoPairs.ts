import moment from "moment";
import {IStockOut} from "./stock-out.interfaces";

export const stockOutOrderInfoPairs = (stockOut: IStockOut) => [
  {label: "Stock Out Order ID", value: stockOut?.stockOutOrderId},
  {label: "Remarks", value: stockOut?.remarks},
  {label: "Status", value: stockOut?.status},
  {label: "Source", value: stockOut?.fromLocation?.name},
  {label: "Destination", value: stockOut?.toLocation?.name},
  {
    label: "Order Date",
    value: moment(stockOut?.createdAt).format("MMMM Do YYYY"),
  },
  {
    label: "Sent Out At",
    value: stockOut?.sentOutAt
      ? moment(stockOut?.sentOutAt).format("MMMM Do YYYY")
      : "N/A",
  },

  {
    label: "Verified At",
    value: stockOut?.verifiedAt
      ? moment(stockOut?.verifiedAt).format("MMMM Do YYYY")
      : "N/A",
  },
  {
    label: "Approved At",
    value: stockOut?.approvedAt
      ? moment(stockOut?.approvedAt).format("MMMM Do YYYY")
      : "N/A",
  },
  {
    label: "Delivered At",
    value: stockOut?.deliveredAt
      ? moment(stockOut?.deliveredAt).format("MMMM Do YYYY")
      : "N/A",
  },

  {
    label: "Initiator Name",
    value: `${stockOut?.initiator?.firstName} ${stockOut?.initiator?.lastName}`,
  },
  {label: "Initiator Phone", value: stockOut?.initiator?.phone},
  {
    label: "Verifier Name",
    value: `${stockOut?.verifier?.firstName} ${stockOut?.verifier?.lastName}`,
  },
  {label: "Verifier Phone", value: stockOut?.verifier?.phone},
  {
    label: "Approver Name",
    value: `${stockOut?.approver?.firstName} ${stockOut?.approver?.lastName}`,
  },
  {label: "Approver Phone", value: stockOut?.approver?.phone},
];
