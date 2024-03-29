import React from "react";
import {IVehicle} from "../interface";

interface IVlPrintout {
  v: IVehicle;
}

export const HackneyPrintOut: React.FC<IVlPrintout> = ({v}) => {
  if (!v) {
    return null;
  }

  return (
    <div id="print-content" className="p-4 border border-gray-400">
      <div className="text-xl font-semibold">Hackney PRINT Out</div>
      <div className="mt-4">
        <div className="mb-4">{/* <strong>OwnerTin:</strong> {v.owner} */}</div>
        <div className="mb-4">
          <strong>Vehicle Chassis:</strong> {v.chassisNumber}
        </div>
      </div>
    </div>
  );
};
