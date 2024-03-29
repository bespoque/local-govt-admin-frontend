export const itemsToSend = [
  {label: "PLATE NUMBER", value: "PLATE_NUMBER"},
  {label: "LICENCE", value: "LICENCE"},
  {value: "GREEN_BOOK", label: "GREEN BOOK"},
  {value: "PROOF_OF_OWNERSHIP", label: "PROOF OF OWNERSHIP"},
   {value: "ROAD_WORTHINESS", label: "ROAD WORTHINESS"},
  {value: "INSURANCE", label: "INSURANCE"},
  {
    label: "HACKNEY PERMIT",
    value: "HACKNEY_PERMIT",
    disabled: true,
    checked: true,
  },
];

export const ItemsToSendTransformed = {
  PLATE_NUMBER: "PLATE NUMBER",
  LICENCE: "LICENCE",
  HACKNEY_PERMIT: "HACKNEY PERMIT",
  ROAD_WORTHINESS: "ROAD WORTHINESS",
  GREEN_BOOK: "GREEN BOOK",
  PROOF_OF_OWNERSHIP: "PROOF OF OWNERSHIP",
};

export const vLDocsToUpload = [
  {label: "SALES AGREEMENT/CUSTOM PAPER/PURCHASE", value: "SALES_AGREEMENT"},
  {label: "COURT AFFIDAVIT", value: "COURT_AFFIDAVIT"},
  {label: "POLICE EXTRACT", value: "POLICE_EXTRACT"},
  {label: "ID CARD", value: "ID_CARD"},
  {label: "PASSPORT PHOTO", value: "PASSPORT_PHOTO"},
];

export const renewalDocToUpload = [
  {label: "PROOF OF OWNERSHIP", value: "PROOF_OF_OWNERSHIP"},
  {label: "ROAD WORTHINESS", value: "ROAD_WORTHINESS"},
  {label: "FORMER LICENCE", value: "FORMER_LICENCE"},
];

export const taxPayerTypeList = [
  {label: "PRIVATE", value: "INDIVIDUAL"},
  {label: "ORGANIZATION", value: "NON_INDIVIDUAL"},
];

export enum PRINT_TEMPLATE {
  ASSESSMENT = "ASSESSMENT",
  CARD_FRONT = "CARD_FRONT",
  CARD_BACK = "CARD_BACK",
  A4 = "A4",
  STICKER = "STICKER",
  HACKNEY_PERMIT = "HACKNEY_PERMIT",
}

export const categoryMappings = {
  "Motorcycle": "MOTORCYCLE",
  "Motorvehicle": "MOTORVEHICLE",
  "Bus": "BUS",
  "Tipper/Lorry": "TIPPER_LORRY",
  "Tanker/Truck": "TANKER_TRUCK",
  "16 tire trailer": "TIRE_TRAILER_16",
  "Tractors/bulldozer": "TRACTOR_BULDOZER"
};