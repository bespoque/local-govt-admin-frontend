import {ITaxOffice} from "components/tax-office/tax-office.interface";
import {ITaxPayer, IUser, Role} from "components/user/user.interface";

export enum VehicleLicenceStatus {
  INITIATED = "INITIATED",
  PARTIAL_DOCUMENTS = "PARTIAL_DOCUMENTS",
  DOCUMENTS_UPLOADED = "DOCUMENTS_UPLOADED",
  ASSESSMENT_CREATED = "ASSESSMENT_CREATED",
  PAID = "PAID",
  VERIFIED = "VERIFIED",
  APPROVED = "APPROVED",
  EXTERNAL_IDS_APPROVED = "EXTERNAL_IDS_APPROVED",
  ISSUED = "ISSUED",
  REJECTED = "REJECTED",
}
export enum VehicleChangeOfOwnershipStatus {
  INITIATED = "INITIATED",
  PARTIAL_DOCUMENTS = "PARTIAL_DOCUMENTS",
  DOCUMENTS_UPLOADED = "DOCUMENTS_UPLOADED",
  ASSESSMENT_CREATED = "ASSESSMENT_CREATED",
  PAID = "PAID",
  VERIFIED = "VERIFIED",
  APPROVED = "APPROVED",
  EXTERNAL_IDS_APPROVED = "EXTERNAL_IDS_APPROVED",
  ISSUED = "ISSUED",
  REJECTED = "REJECTED",
}

export enum DOCUMENT_TYPE_ENUM {
  PO_FINANCE = "PO_FINANCE",
  SALES_AGREEMENT = "SALES_AGREEMENT",
  COURT_AFFIDAVIT = "COURT_AFFIDAVIT",
  POLICE_EXTRACT = "POLICE_EXTRACT",
  ID_CARD = "ID_CARD",
  PASSPORT_PHOTO = "PASSPORT_PHOTO",
  VEHICLE_LICENCE = "VEHICLE_LICENCE",
  PROOF_OF_OWNERSHIP = "PROOF_OF_OWNERSHIP",
}

export enum VL_ITEMS {
  GREEN_BOOK = "GREEN_BOOK",
  PROOF_OF_OWNERSHIP = "PROOF_OF_OWNERSHIP",
  VEHICLE_PLATE_NUMBER = "VEHICLE_PLATE_NUMBER",
  MOTORCYCLE_PLATE_NUMBER = "MOTORCYCLE_PLATE_NUMBER",
  VEHICLE_REGISTRATION = "VEHICLE_REGISTRATION",
  LICENCE = "LICENCE",
  ROAD_WORTHINESS = "ROAD_WORTHINESS",
  CHANGE_OF_OWNERSHIP = "CHANGE_OF_OWNERSHIP",
  HACKNEY_PERMIT = "HACKNEY_PERMIT",
  INSURANCE = "INSURANCE",
  OTHERS = "OTHERS",
}

export enum VL_CATEGORY {
  DEFAULT = "DEFAULT",
  MOTORCYCLE = "MOTORCYCLE",
  TRICYCLE = "TRICYCLE",
  VEHICLE = "VEHICLE",
  VEHICLE_BELOW_1_6CC = "VEHICLE_BELOW_1_6CC",
  VEHICLE_BELOW_2CC = "VEHICLE_BELOW_2CC",
  VEHICLE_BELOW_3CC = "VEHICLE_BELOW_3CC",
  VEHICLE_BELOW_3CC_COMMERCIAL = "VEHICLE_BELOW_3CC_COMMERCIAL",
  VEHICLE_ABOVE_3CC = "VEHICLE_ABOVE_3CC",
  ARTICULATED_VEHICLE = "ARTICULATED_VEHICLE",
  BUSES = "BUSES",
  TIPPER_LORRY = "TIPPER_LORRY",
  TANKER_TRUCK = "TANKER_TRUCK",
  TIRE_TRAILER_16 = "TIRE_TRAILER_16",
  TRACTOR_BULDOZER = "TRACTOR_BULDOZER",
  PRIVATE_STANDARD = "PRIVATE_STANDARD",
  PRIVATE_FANCY = "PRIVATE_FANCY",
  GOVERNMENT_STANDARD = "GOVERNMENT_STANDARD",
  GOVERNMENT_FANCY = "GOVERNMENT_FANCY",
  DEALERSHIP = "DEALERSHIP",
  OUT_OF_SERIES = "OUT_OF_SERIES",
  SMS = "SMS",
  INSURANCE = "INSURANCE",
  VEHICLE_DRIVER_LICENCE_3_YEARS = "VEHICLE_DRIVER_LICENCE_3_YEARS",
  VEHICLE_DRIVER_LICENCE_5_YEARS = "VEHICLE_DRIVER_LICENCE_5_YEARS",
  MOTORCYCLE_DRIVER_LICENCE_3_YEARS = "MOTORCYCLE_DRIVER_LICENCE_3_YEARS",
  MOTORCYCLE_DRIVER_LICENCE_5_YEARS = "MOTORCYCLE_DRIVER_LICENCE_5_YEARS",
  STAMP_DUTY = "STAMP_DUTY",
}

export interface IGenerateVLRButtons {
  vlr: IVehicleLicenceRequest;
  userRoles: Role[];
  userPermissions: string[];
  verifyHandler: () => void;
  approveHandler: () => void;
  createAssessmentHandler: () => Promise<void>;
  printAssessmentHandler: () => void;
  sendToPrinterHandler: () => void;
  reqLoading: boolean;
}

export interface IGenerateVCOButtons {
  vco: IVehicleChangeOfOwnershipRequest;
  userRoles: Role[];
  userPermissions: string[];
  verifyHandler: () => void;
  approveHandler: () => void;
  createAssessmentHandler: () => Promise<void>;
  printAssessmentHandler: () => void;
  sendToPrinterHandler: () => void;
  reqLoading: boolean;
}

interface IDocument {
  id: number;
  fileKey: string;
  fileBucket: string;
  fileType: string;
  createdAt: string;
}

export enum VEHICLE_CATEGORY {
  MOTORCYCLE = "MOTORCYCLE",
  TRICYCLE = "TRICYCLE",
  MOTORVEHICLE = "MOTORVEHICLE",
  BUS = "BUS",
  TIPPER_LORRY = "TIPPER_LORRY",
  TANKER_TRUCK = "TANKER_TRUCK",
  TIRE_TRAILER_16 = "TIRE_TRAILER_16",
  TRACTOR_BULDOZER = "TRACTOR_BULDOZER",
  ARTICULATED_VEHICLE = "ARTICULATED_VEHICLE",
}

export interface IVehicle {
  id: number;
  ownerTin: string;
  purpose: string;
  make: string;
  model: string;
  type: string;
  category: VEHICLE_CATEGORY;
  regNumber: string | null;
  previousRegNumber: string;
  color: string;
  chassisNumber: string;
  engineNumber: string;
  engineCapacity: string;
  fuelType: string | null;
  yearOfManufacture: string;
  tankCapacity: string;
  vehicleLicenceUniqueId: string | null;
  insuranceId: string | null;
  hackneyPermitId: string | null;
  proofOfOwnershipId: string | null;
  roadWorthinessId: string | null;
  createdAt: string;
  vehicleLicence?: IVehicleLicence;
  greenBookId?: string | null;
  stickerId?: string | null;
  roadWorthinessData: IRoadWorthiness;
}
export enum PAYMENT_STATUS {
  UNPAID = "UNPAID",
  PART_PAID = "PART_PAID",
  PAID = "PAID",
}

export interface IVehicleLicence {
  id: number;
  owner: string;
  itemsToSend: VL_ITEMS[];
  expiryDate: string | null;
  issued: boolean;
  issuedOn: string | null;
  createdAt: string;
  vehicle: IVehicle;
  documents: IDocument[];
}

export interface IRoadWorthiness {
  Amount: string;
  ChassisNumber: string;
  CreatedAt: string;
  EngineCapacity: string;
  EngineNumber: string;
  ExpiryDate: string;
  LoadWeight: string;
  NoOfPerson: number;
  OwnerAddress: string;
  OwnerName: string;
  OwnerPhoneNumber: string;
  ReceiptNumber: string;
  RegistrationCenter: string;
  VehicleCategory: string;
  VehicleColor: string;
  VehicleMake: string;
  VehicleModel: string;
  VehicleRegNumber: string;
  VehicleType: string;
  VehicleWeight: string;
  id: number;
  status: boolean;
}

export interface IPayment {
  id: number;
  assessmentId: string;
  amount: number;
  status: PAYMENT_STATUS;
  createdAt: Date;
}

export interface IVehicleLicenceRequest {
  id: number;
  vlRequestSlug: string;
  type: string;
  ownerTin: string;
  taxPayerType: string;
  ownerData: ITaxPayer;
  verifiedAt: string | null;
  approvedAt: string | null;
  status: VehicleLicenceStatus;
  createdAt: string;
  vehicles: IVehicle[];
  sellingPrices: any[];
  payment: IPayment;
  location: ITaxOffice;
  initiator: IUser;
  verifier: IUser;
  approver: IUser;
}

export interface IPreviousOwner {
  surname: string;
  firstName: string;
  middleName: string;
  address: string;
  prevOwnerTin: string;
  mobileNumber: string;
}

export interface IVehicleChangeOfOwnershipRequest {
  id: number;
  coRequestSlug: string;
  type: string;
  prevOwnerType: string;
  prevOwnerTin: string;
  newOwnerTin: string;
  taxPayerType: string;
  ownerData: ITaxPayer;
  verifiedAt: string | null;
  approvedAt: string | null;
  status: VehicleChangeOfOwnershipStatus;
  oldVehicleOwner: IPreviousOwner;
  inventoryItems: any[];
  createdAt: string;
  vehicle: any;
  vehicleLicence: any;
  sellingPrices: any[];
  payment: IPayment;
  location: ITaxOffice;
  initiator: IUser;
  verifier: IUser;
  approver: IUser;
}
