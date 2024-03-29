import {IVehicle} from "../interface";
import QRCode from "qrcode.react";

interface IVlPrintout {
  v: IVehicle;
  owner: any;
  type: string;
  insurance: string;
  insurancePolicy: string;
  vlr: any;
}

export const TopInfo: React.FC<IVlPrintout> = ({v, owner, type}) => {
  const Info = [
    {
      label: "Plate No.",
      value: v?.regNumber,
    },
    {
      label: "Vehicle Make",
      value: v?.make,
    },
    {label: "Vehicle Model", value: v?.model},
    {
      label: "Chasis Number",
      value: v?.chassisNumber,
    },
    {label: "Licence Type", value: v?.purpose},
    {
      value:
        type === "INDIVIDUAL"
          ? owner?.first_name + " " + owner?.surname
          : owner?.coy_name,
      label: "Owner",
    },

    {
      value: owner?.street + " " + owner?.city + " " + owner?.stateOfResidence,
      label: "Address",
    },
    {
      label: "Colour",
      value: v?.color,
    },
    {
      label: "Engine Number",
      value: v?.engineNumber,
    },
    {
      label: "Engine Capacity",
      value: v?.engineCapacity,
    },
    {
      label: "Weight",
      value: `${v?.roadWorthinessData.VehicleWeight}KG`,
    },
    {
      label: "Road Worthiness",
      value: `valid till ${v?.roadWorthinessData.ExpiryDate}`,
    },
    {
      label: "Premit",
      value: v?.vehicleLicence?.itemsToSend?.map((item) =>
        item.includes("HACKNEY") ? "Hackney" : ""
      ),
    },
    {
      label: "Insurance Policy",
      value: "",
    },
    {
      label: "Insurance Company",
      value: "",
    },
  ];

  return (
    <div className="flex flex-wrap justify-between items-start gap-5">
      {Info?.map((item, index) => (
        <div key={index} className="text-xs">
          <div>{item.label}</div>
          <div>{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export const TopRight = ({v}) => {
  const RightInfo = [
    {
      label: "Chasis Number",
      value: v?.chassisNumber,
    },
    {
      label: "Registration Expiry",
      value: v?.roadWorthinessData.ExpiryDate,
    },
    {
      label: "Road Worthiness",
      value: v?.roadWorthinessData.ExpiryDate,
    },
    {
      label: "Insurance",
      value: "",
    },
    {
      label: "Permit",
      value: v?.vehicleLicence?.itemsToSend?.map((item) =>
        item.includes("HACKNEY") ? "Hackney" : ""
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="fixed right-20 top-40" style={{marginTop: "-14px"}}>
        <QRCode value="https://google.com" size={30} />
      </div>
      <div className="mt-40 pl-5">
        <div className="flex flex-col items-center text-center mb-2">
          <h2>KOGI</h2>
          <h1>{v?.regNumber}</h1>
        </div>
        <div className="flex flex-col gap-2">
          {RightInfo.map((item, index) => (
            <div key={index} className="text-xs">
              <h1>{item.label}</h1>
              <h1 className="font-bold">{item.value}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LicenceDetails = ({v, vlr}) => {
  const licenceDetails = [
    {
      label: "Initial State of Registration",
      value: "Kogi",
    },
    {
      label: "Current State of Registration/Renewal",
      value: "Kogi",
    },
    {
      label: "Document Proccesed by",
      value: `${vlr?.initiator?.firstName} ${vlr?.initiator?.lastName}`,
    },
  ];
  return (
    <div>
      <div className="bg-gray-400 flex items-center justify-center font-bold">
        Licence Details
      </div>
      <div className="licence-details flex justify-between">
        {licenceDetails.map((item, index) => (
          <div key={index} className="text-xs pt-1">
            <h1>{item.label}</h1>
            <h1 className="font-bold">{item.value}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};
export const ProofOfOwnership = ({v, owner, type}) => {
  const proofOfOwnership = [
    {
      label: "Plate No.",
      value: v?.regNumber,
    },
    {
      label: "Vehicle Make",
      value: v?.make,
    },
    {label: "Vehicle Type", value: v?.type},
    {label: "Vehicle Model", value: v?.model},
    {
      label: "Plate Type",
      value: v?.purpose,
    },
    {
      label: "Previous Plate Number",
      value: "",
    },
    {
      label: "Owner",
      value:
        type === "INDIVIDUAL"
          ? owner?.first_name + " " + owner?.surname
          : owner?.coy_name,
    },
    {
      label: "Address",
      value: owner?.street + " " + owner?.city + " " + owner?.stateOfResidence,
    },
    {
      label: "Certificate Serial No.",
      value: "",
    },
  ];

  return (
    <div>
      <div className="bg-gray-400 flex items-center justify-center font-bold mt-2">
        Proof of Ownership
      </div>
      <div className="proof-of-ownership flex justify-between flex-wrap gap-5">
        {proofOfOwnership.map((item, index) => (
          <div key={index} className="text-xs">
            <p>{item.label}</p>
            <p className="font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TransferOfOwnership = () => {
  const transferOfOwnership = [
    {
      label: "Processing Point",
      value: "",
    },
    {
      label: "Previous Owner",
      value: "",
    },
    {label: "Address", value: ""},
    {label: "Transfer Fee", value: "2500"},
    {
      label: "Issue Date",
      value: "",
    },
  ];
  return (
    <div>
      <div className="bg-gray-400 flex items-center justify-center font-bold mt-2">
        Transfer of Ownership
      </div>
      <div className="transfer-of-ownership flex justify-between flex-wrap gap-5">
        {transferOfOwnership.map((item, index) => (
          <div key={index} className="text-xs pt-1">
            <p>{item.label}</p>
            <p className="font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export const CertOfRoadWorthiness = ({v}) => {
  const CertOfRoadWorthiness = [
    {
      label: "Category",
      value: v?.roadWorthinessData.VehicleCategory,
    },
    {
      label: "Net Weight",
      value: `${v?.roadWorthinessData.VehicleWeight}KG`,
    },
    {
      label: "Authorized to Carry",
      value: `${v?.roadWorthinessData.LoadWeight}KG`,
    },
    {
      label: "Gross Weight",
      value: `${
        parseInt(v?.roadWorthinessData.LoadWeight) +
        parseInt(v?.roadWorthinessData.VehicleWeight)
      }KG`,
    },
    {
      label: "Seating Capacity",
      value: v?.roadWorthinessData.NoOfPerson,
    },
    {
      label: "Receipt No",
      value: v?.roadWorthinessData.ReceiptNumber,
    },
    {
      label: "Receipt Date",
      value: v?.roadWorthinessData.CreatedAt,
    },
    {
      label: "Inspection Fee",
      value: "NGN2,500",
    },
  ];

  return (
    <div>
      <div className="bg-gray-400 flex items-center justify-center font-bold">
        Certificate of Road Worthiness
      </div>
      <div className="cert-of-rw flex flex-wrap gap-2 justify-between">
        {CertOfRoadWorthiness.map((item, index) => (
          <div key={index} className="text-xs pt-1">
            <p>{item.label}</p>
            <p className="font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GeneralMotorReceipt = ({v, vlr, item}) => {
  const GeneralMotorReceipt = [
    {
      label: "Reference No",
      value: item?.id,
    },
    {
      label: "Amount Paid",
      value: vlr?.sellingPrices.reduce(
        (total, item) => total + parseFloat(item.price),
        0
      ),
    },
    {
      label: "Issue State",
      value: "Kogi",
    },
    {
      label: "Expiry Date",
      value: new Date(item?.soldAt).toLocaleDateString(),
    },
  ];
  return (
    <div>
      <div
        className="bg-gray-400 flex items-center 
                justify-center font-bold">
        General Motor Receipt
      </div>
      <div className="flex flex-wrap gap-2 justify-between">
        {GeneralMotorReceipt.map((item, index) => (
          <div key={index} className="text-xs pt-1">
            <p>{item.label}</p>
            <p className="font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const NumberPlateIssuanceReceipt = ({v, vlr, item}) => {
  const NumberPlateIssuanceReceipt = [
    {
      label: "Reference No",
      value: item?.id,
    },
    {
      label: "Amount Paid",
      value: vlr?.sellingPrices.find((item) => item.item === "PLATE_NUMBER")
        ?.price,
    },
    {
      label: "State",
      value: "Kogi",
    },
    {
      label: "Issued Date",
      value: new Date(item?.createdAt).toLocaleDateString(),
    },
  ];
  return (
    <div>
      <div
        className="bg-gray-400 flex items-center 
                justify-center font-bold mt-2">
        Number Plate Issuance Receipt
      </div>
      <div className="flex flex-wrap gap-2 justify-between">
        {NumberPlateIssuanceReceipt.map((item, index) => (
          <div key={index} className="text-xs pt-1">
            <p>{item.label}</p>
            <p className="font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const InsuranceDetails = () => {
  const InsuranceDetails = [
    {
      label: "Cover Type",
      value: "",
    },
    {
      label: "Insurance Policy",
      value: "",
    },
    {
      label: "Insurance Company",
      value: "",
    },
    {
      label: "Cover Period",
      value: "",
    },
    {
      label: "Amount",
      value: "",
    },
  ];

  return (
    <div>
      <div
        className="bg-gray-400 flex items-center 
                justify-center font-bold mt-2">
        Insurance Details
      </div>
      <div className="flex justify-between flex-wrap gap-5">
        {InsuranceDetails.map((item, index) => (
          <div key={index} className="text-xs pt-1">
            <p>{item.label}</p>
            <p className="font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Permit = ({v}) => {
  const Permits = [
    {
      label: "Permit Type",
      value: v?.vehicleLicence?.itemsToSend?.map((item) =>
        item.includes("HACKNEY") ? "Hackney" : ""
      ),
    },
    {
      label: "Plate Number",
      value: v?.vehicleLicence?.itemsToSend?.map((item) =>
        item.includes("HACKNEY") ? v?.regNumber : ""
      ),
    },
    {
      label: "State",
      value: v?.vehicleLicence?.itemsToSend?.map((item) =>
        item.includes("HACKNEY") ? "Kogi" : ""
      ),
    },
    {
      label: "Expiry Date",
      value: v?.vehicleLicence?.itemsToSend?.map((item) =>
        item.includes("HACKNEY") ? v?.roadWorthinessData.ExpiryDate : ""
      ),
    },
    {
      label: "Amount",
      value: v?.vehicleLicence?.itemsToSend?.map((item) =>
        item.includes("HACKNEY") ? "" : ""
      ),
    },
    {
      label: "SMS Fees",
      value: v?.vehicleLicence?.itemsToSend?.map((item) =>
        item.includes("HACKNEY") ? "" : ""
      ),
    },
  ];

  return (
    <div>
      <div
        className="bg-gray-400 flex items-center 
                justify-center font-bold mt-2">
        Permits
      </div>
      <div className="flex justify-between flex-wrap gap-5">
        {Permits.map((item, index) => (
          <div key={index} className="text-xs pt-1">
            <p>{item.label}</p>
            <p className="font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
