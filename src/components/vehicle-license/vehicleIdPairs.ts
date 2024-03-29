

interface Datasource {
    vehicleLicenceUniqueId: string | null;
    insuranceId: string | null;
    hackneyPermitId: string | null;
    proofOfOwnershipId: string | null;
    roadWorthinessId: string | null;
    greenBookId?: string | null;
    stickerId?: string | null
    regNumber: string | null
  }

export const vehicleIdPairs = (vi:Datasource) => [
  {label: "Registration Number", value: vi?.regNumber},
  {label: "Proof of Ownership Id", value: vi?.proofOfOwnershipId},
  {label: "Road Worthiness Id", value: vi?.roadWorthinessId},
  {label: "Insurance Id", value: vi?.insuranceId},
  {label: "Hackney Permit Id", value: vi?.hackneyPermitId},
  {label: "Green Book Id", value: vi?.greenBookId},
  {label: "Sticker Id", value: vi?.stickerId},
  {label: "Vehicle Licence Unique Id", value: vi?.vehicleLicenceUniqueId}
  ];



  