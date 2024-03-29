import React from "react";
import {IVehicle} from "../interface";
import moment from "moment";
import QRCode from "qrcode.react";

interface IVlPrintout {
  v: IVehicle;
}

export const StickerPrintOut: React.FC<IVlPrintout> = ({v}) => {
  if (!v) {
    return null;
  }

  return (
    <div className="flex justify-center items-center">
      <div
        id="print-content"
        className="p-4 flex justify-center items-center"
        style={{height: "264.56693", width: "377.95276px"}}>
        <div
          id="print-content"
          className="p-4 "
          style={{
            height: "185.19685px",
            width: "332.59843px",
            marginTop: "52.91339px",
          }}>
          <div className="">
            <h1 className="text-center font-bold" style={{marginTop: "-14px"}}>
              {v?.regNumber}
            </h1>
            <div
              className="fixed right-24  top-32"
              style={{marginTop: "-14px"}}>
              <QRCode value="https://google.com" size={40} />
            </div>
          </div>

          <div className="flex flex-col text-xs" style={{fontSize: "10px"}}>
            <span className="text-xs">Chassis Number</span>
            <span className="" style={{marginTop: "-2px"}}>
              {v?.chassisNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <div className=" w-3/4">
              <div className="flex justify-between" style={{fontSize: "10px"}}>
                <div className="flex flex-col">
                  <span>Make</span>
                  <span style={{marginTop: "-6px"}}>{v?.make}</span>
                </div>

                <div className="flex flex-col">
                  <span>Model</span>
                  <span style={{marginTop: "-6px"}}>{v?.model}</span>
                </div>
                <div className="flex flex-col">
                  <span>Engine Capacity</span>
                  <span style={{marginTop: "-6px"}}>{v?.engineCapacity}</span>
                </div>
              </div>
              <div className="flex justify-between" style={{fontSize: "10px"}}>
                <div className="flex flex-col">
                  <span>License Expiry</span>
                  <span style={{marginTop: "-6px"}}>
                    {moment(v?.vehicleLicence?.expiryDate).format("LL")}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span>Road Worthiness</span>
                  <span style={{marginTop: "-6px"}}></span>
                </div>
              </div>
              <div className="flex justify-between" style={{fontSize: "10px"}}>
                <div className="flex flex-col">
                  <span>Insurance</span>
                  <span style={{marginTop: "-6px"}}></span>
                </div>
                <div className="flex flex-col">
                  <span>Hackney</span>
                  <span style={{marginTop: "-6px"}}></span>
                </div>
              </div>
            </div>
            <div>
              <span
                className="fixed right-16 -rotate-90 font-semibold mt-14"
                style={{lineHeight: "2px"}}>
                {moment(v?.vehicleLicence?.expiryDate).format("MMMM, YYYY")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
