import React from "react";
import {IVehicle} from "../interface";
import moment from "moment";
import QRCode from "qrcode.react";

interface IVlPrintout {
  v: IVehicle;
  owner: any;
  type: string;
}

export const CardPrintOutFront: React.FC<IVlPrintout> = ({v, owner, type}) => {
  if (!v) {
    return null;
  }
  const cardInfo = [
    {
      label: "Plate No.",
      value: v?.regNumber,
    },
    {
      value:
        type === "INDIVIDUAL"
          ? owner?.first_name + " " + owner?.surname
          : owner?.coy_name,
      label: "Owner",
    },
    {label: "Licence Type", value: v?.purpose},
    {
      value: owner?.street + " " + owner?.city + " " + owner?.stateOfResidence,
      label: "Address",
    },
    {
      label: "Registration Date",
      value: moment(v?.vehicleLicence?.createdAt).format("MMM, DD YYYY"),
    },
    {
      label: "Proof of Ownership",
      value: "N/A",
    },
    {
      label: "Expiration Date",
      value: moment(v?.vehicleLicence?.expiryDate).format("MMM, DD YYYY"),
    },
    {
      label: "Transaction ID",
      value: "N/A",
    },
    {
      label: "Place of Issue",
      value: owner?.stateOfResidence || "N/A",
    },
  ];

  return (
    <div className="flex justify-center items-center">
      <div
        id="print-content"
        className="p-4 flex justify-center items-center"
        style={{height: "204.09949", width: "321.25984px"}}>
        <div
          id="print-content"
          className="p-4"
          style={{
            height: "132.28346px",
            width: "283.46457px",
            marginTop: "52.91339px",
          }}>
          <div className="">
            <div className="flex flex-wrap">
              {cardInfo.map((pair, index) => {
                return (
                  <div
                    className="w-1/2 p-2"
                    key={index}
                    style={{lineHeight: "8px"}}>
                    <h6
                      className=" font-extralight text-gray-600"
                      style={{fontSize: "6px"}}>
                      {pair?.label}
                    </h6>
                    <div
                      className="font-semibold"
                      style={{
                        fontSize: "5px",
                        marginBottom: "-18px", // No margin
                      }}>
                      {pair?.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export const CardPrintOutBack: React.FC<IVlPrintout> = ({v, owner, type}) => {
  if (!v) {
    return null;
  }
  const cardInfo = [
    {
      label: "Engine Number",
      value: v?.engineNumber,
    },
    {
      value: v?.color,
      label: "Color",
    },
    {label: "Chassis Number", value: v?.chassisNumber},
    {
      value: v?.engineCapacity,
      label: "Engine Capacity",
    },

    {
      label: "Vehicle Make",
      value: v?.make,
    },
    {
      label: "Model",
      value: v?.model,
    },
  ];

  return (
    <div className="flex justify-center items-center">
      <div
        id="print-content"
        className="p-2 flex justify-center items-center border-green-400 border-2"
        style={{height: "204.09949px", width: "321.25984px"}}>
        <div
          id="print-content"
          className="p-4 border-2 border-red-400"
          style={{}}>
          <div className="">
            <span style={{fontSize: "5px"}}>Vehicle Particulars</span>
            <div className="flex flex-wrap">
              {cardInfo.map((pair, index) => {
                return (
                  <div
                    className="w-1/2 p-2"
                    key={index}
                    style={{lineHeight: "8px"}}>
                    <h6
                      className=" font-extralight text-gray-600"
                      style={{fontSize: "5px"}}>
                      {pair?.label}
                    </h6>
                    <div
                      className="font-semibold"
                      style={{
                        fontSize: "6px",
                        marginBottom: "-18px", // No margin
                      }}>
                      {pair?.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="fixed right-24  top-24" style={{marginTop: "-14px"}}>
            <QRCode value="https://google.com" size={30} />
          </div>
        </div>
      </div>
    </div>
  );
};
