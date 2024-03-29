import moment from "moment";
import {IStockOutRequest} from "./stock-out-request.interface";

export const transferRequestsInfoPairs = (sor: IStockOutRequest) => [
  {label: "Transfer Request Id", value: sor?.stockOutRequestOrderId},
  {label: "Status", value: sor?.status},
  {
    label: "Request Date",
    value: sor?.createdAt
      ? moment(sor?.createdAt).format("MMMM Do YYYY")
      : "N/A",
  },
];
