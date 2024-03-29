import stockIn from "slices/stockIn";
import {IStockIn} from "./stock-in.interfaces";
import moment from "moment";

export const stockInTableColumns: Record<string, string>[] = [
  {
    name: "Create Date",
    key: "Create Date",
  },

  {
    name: "SO ID",
    key: "SO ID",
  },
  {
    name: "SI ID",
    key: "SI ID",
  },

  {
    name: "Source",
    key: "Source",
  },
  {
    name: "Destination",
    key: "Destination",
  },

  {
    name: "Status",
    key: "Status",
  },
];

export const stockInOrderInfoPairs = (stockIn: IStockIn) => [
  {label: "SI Order ID", value: stockIn?.stockInOrderId},
  {label: "SO Order ID", value: stockIn?.stockOut?.stockOutOrderId},
  {label: "PO ID", value: stockIn?.procurement?.orderId},
  {label: "Status", value: stockIn?.status},
  {label: "remarks", value: stockIn?.remarks},
  {label: "Audit Comments", value: stockIn?.auditComments},
  {
    label: "Order Date",
    value: moment(stockIn?.createdAt).format("MMMM Do YYYY"),
  },

  {
    label: "Receive Date",
    value: moment(stockIn?.receivedAt).format("MMMM Do YYYY"),
  },

  {
    label: "Source Location",
    value: stockIn?.fromLocation?.name,
  },
  {
    label: "Destination Location",
    value: stockIn?.toLocation?.name,
  },

  {
    label: "Verified At",
    value: stockIn?.verifiedAt
      ? moment(stockIn?.verifiedAt).format("MMMM Do YYYY")
      : "N/A",
  },
  {
    label: "Approved At",
    value: stockIn?.approvedAt
      ? moment(stockIn?.approvedAt).format("MMMM Do YYYY")
      : "N/A",
  },

  {
    label: "Initiator Name",
    value: `${stockIn?.initiator?.firstName} ${stockIn?.initiator?.lastName}`,
  },
  {label: "Initiator Phone", value: stockIn?.initiator?.phone},
  {
    label: "Verifier Name",
    value: `${stockIn?.verifier?.firstName} ${stockIn?.verifier?.lastName}`,
  },
  {label: "Verifier Phone", value: stockIn?.verifier?.phone},
  {
    label: "Auditor Name",
    value: `${stockIn?.auditor?.firstName} ${stockIn?.auditor?.lastName}`,
  },
  {label: "Auditor Phone", value: stockIn?.auditor?.phone},
  {
    label: "Approver Name",
    value: `${stockIn?.approver?.firstName} ${stockIn?.approver?.lastName}`,
  },
  {label: "Approver Phone", value: stockIn?.approver?.phone},
];
