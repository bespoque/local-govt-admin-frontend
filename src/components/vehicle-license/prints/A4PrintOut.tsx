import React, {useState, useEffect} from "react";
import {IVehicle} from "../interface";

import {
  CertOfRoadWorthiness,
  GeneralMotorReceipt,
  InsuranceDetails,
  LicenceDetails,
  NumberPlateIssuanceReceipt,
  Permit,
  ProofOfOwnership,
  TopInfo,
  TopRight,
} from "../a4/Info";

interface IVlPrintout {
  v: IVehicle;
  owner: any;
  type: string;
  insurance: string;
  insurancePolicy: string;
  vlr: any;
}

export const A4PrintOut: React.FC<IVlPrintout> = ({
  v,
  vlr,
  owner,
  type,
  insurance,
  insurancePolicy,
}) => {
  const [foundItem, setFoundItem] = useState({});

  useEffect(() => {
    //  uniqueId from the first vehicle in the vehicles array
    const uniqueIdToFind = vlr.vehicles[0].vehicleLicenceUniqueId;

    //  corresponding item in the inventoryItems array
    const item = vlr.inventoryItems.find(
      (item) => item.uniqueId === uniqueIdToFind
    );

    // Set the found item in the state
    setFoundItem(item);
  }, [vlr.vehicles, vlr.inventoryItems]);

  if (!v) {
    return null;
  }

  const uniqueIdToFind = vlr.vehicles[0].vehicleLicenceUniqueId;

  //  corresponding item in the inventoryItems array
  const item = vlr.inventoryItems.find(
    (item) => item.uniqueId === uniqueIdToFind
  );

  return (
    <div id="print-content" className="p-5 border border-gray-400">
      <div>
        <div className="top flex justify-between mb-5">
          <div className="top-left mt-[220px] w-2/3 flex flex-wrap">
            <TopInfo
              v={v}
              vlr={vlr}
              owner={owner}
              type={type}
              insurance={insurance}
              insurancePolicy={insurancePolicy}
            />
          </div>
          <div className="top-right flex w-1/3 px-10 items-start">
            <TopRight v={v} />
          </div>
          <div className="top-right flex w-1/3 px-10 items-start">
            <TopRight v={v} />
          </div>
        </div>

        {/* bottom */}

        <div className="bottom">
          {/* Licence details */}
          <div>
            <LicenceDetails v={v} vlr={vlr} />
          </div>

          {/* Proof of ownership */}
          <div>
            <ProofOfOwnership v={v} owner={owner} type={type} />
          </div>

          {/* Transfer or ownership, only visible if the a4 was generated from change of ownership*/}
          {/* <div>
            <TransferOfOwnership v = {v} vlr = {vlr} owner = {owner} 
            type = {type} insurance = {insurance} insurancePolicy = {insurancePolicy}/>
             </div> */}

          <div className="flex gap-5">
            <div className="cert-of-rw flex flex-wrap w-1/2 mt-5 gap-2">
              {/* Certificate of road worthiness */}
              <CertOfRoadWorthiness v={v} />
            </div>

            <div className="flex flex-wrap w-1/2 mt-2 gap-2 flex-col">
              <div>
                {/* General motor receipt */}
                <GeneralMotorReceipt v={v} vlr={vlr} item={item} />
              </div>

              <div>
                {/* Number plate Issuance Receipt */}
                <NumberPlateIssuanceReceipt v={v} vlr={vlr} item={item} />
              </div>
            </div>
          </div>

          <div>
            {/* Insurance Details */}
            <InsuranceDetails />
          </div>

          <div>
            {/* Permits */}
            <Permit v={v} />
          </div>
        </div>
      </div>
    </div>
  );
};
