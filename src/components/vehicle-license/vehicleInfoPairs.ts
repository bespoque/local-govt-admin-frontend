import moment from "moment";
import {IVehicleLicence} from "./interface";
import {ItemsToSendTransformed} from "./constants";

export const vehicleInfoPairs = (vl: IVehicleLicence) => [
  {label: "Issued", value: vl?.issued?.toString()},
  {label: "expiration", value: moment(vl?.expiryDate).format("MMMM Do YYYY")},
  {
    label: "Items",
    value: vl?.itemsToSend
      ?.map((it, index, array) => `${ItemsToSendTransformed[it]}`)
      .join(" , "),
  },
];
