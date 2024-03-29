import React from "react";
import Table from "components/tables/custom-table";
import {IVehicleLicenceRequest} from "../interface";
import moment from "moment";
import {processVehicleData} from "functions/utils";
import {formatNumber} from "accounting";

interface IVlrPrintout {
  vlr: IVehicleLicenceRequest;
}

export const VlrAssessmentPrintout: React.FC<IVlrPrintout> = ({vlr}) => {
  const items = processVehicleData(vlr?.vehicles, vlr?.sellingPrices);

  if (!vlr) {
    return null;
  }
  const name =
    vlr?.taxPayerType === "INDIVIDUAL"
      ? `${vlr.ownerData?.first_name} ${vlr?.ownerData.surname}`
      : vlr.ownerData?.coy_name;

  return (
    <div id="print-content" className="p-4">
      <h2 className="text-xl text-center font-bold">
        KOGI STATE INTERNAL REVENUE SERVICE
      </h2>
      <div className="flex justify-between mt-6">
        <div>
          <h4 className="font-semibold">Motor Licensing Authority</h4>
          <h4>Assessment Notice</h4>
          <h4 className="mt-10">{name}</h4>
        </div>
        <div>
          <div className="flex">
            <img
              src="/logos/kgirs.png"
              alt=""
              width={35}
              height={30}
              className=" m-3"
            />
            <hr className="border border-gray-800 h-5 mt-5" />
            <img
              src="/logos/kgirs.png"
              alt=""
              width={35}
              height={30}
              className="m-3"
            />
          </div>
          <div className="flex flex-col">
            <small>
              Date: {moment(vlr?.payment?.createdAt).format("DD/MM/YYYY")}
            </small>
            <small>Tax Id: {vlr?.ownerTin}</small>
            <small>Assessment ID: {vlr?.payment?.assessmentId}</small>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <Table
          fields={[
            {name: "narration", key: "itemName"},
            {name: "quantity", key: "quantity"},
            {name: "subtotal", key: "subtotal"},
          ]}
          tableData={items}
        />

        <h4 className="text-right mt-5 font-bold">
          Assessment Total : ₦
          {formatNumber(
            items
              .map((it) => it?.subtotal)
              .reduce((prev, curV) => prev + curV, 0)
          )}
        </h4>

        <p className="mt-2">
          Make payment at any bank using assessment ID through etranzact, ebills
          or any moniepoint pos agent
        </p>
      </div>
    </div>
  );
};
