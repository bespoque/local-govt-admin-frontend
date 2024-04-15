import { ITaxOffice, ITaxOfficeUser } from "components/tax-office/tax-office.interface";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  ASSESSMENT = "ASSESSMENT",
  REVENUE_CHART = "REVENUE_CHART",
  IDENTITY_MANAGEMENT = "IDENTITY_MANAGEMENT",
  COLLECTIONS = "COLLECTIONS",
  REPORTS = "REPORTS",
  INVENTORY_PROCUREMENT_INITIATOR = "INVENTORY_PROCUREMENT_INITIATOR",
  INVENTORY_PROCUREMENT_APPROVER = "INVENTORY_PROCUREMENT_APPROVER",
  INVENTORY_PROCUREMENT_VERIFIER = "INVENTORY_PROCUREMENT_VERIFIER",
  INVENTORY_PROCUREMENT_AUDITOR = "INVENTORY_PROCUREMENT_AUDITOR",
  INVENTORY_PROCUREMENT_EC = "INVENTORY_PROCUREMENT_EC",
  INVENTORY_PROCUREMENT_FINANCE_APPROVER = "INVENTORY_PROCUREMENT_FINANCE_APPROVER",
  INVENTORY_RECEIVE_INITIATOR = "INVENTORY_RECEIVE_INITIATOR",
  INVENTORY_RECEIVE_VERIFIER = "INVENTORY_RECEIVE_VERIFIER",
  INVENTORY_RECEIVE_AUDITOR = "INVENTORY_RECEIVE_AUDITOR",
  INVENTORY_RECEIVE_APPROVER = "INVENTORY_RECEIVE_APPROVER",
  INVENTORY_TRANSFER_INITIATOR = "INVENTORY_TRANSFER_INITIATOR",
  INVENTORY_TRANSFER_VERIFIER = "INVENTORY_TRANSFER_VERIFIER",
  INVENTORY_TRANSFER_AUDITOR = "INVENTORY_TRANSFER_AUDITOR",
  INVENTORY_TRANSFER_APPROVER = "INVENTORY_TRANSFER_APPROVER",
  INVENTORY_REPORT_INITIATOR = "INVENTORY_REPORT_INITIATOR",
  INVENTORY_REPORT_VERIFIER = "INVENTORY_REPORT_VERIFIER",
  INVENTORY_REPORT_APPROVER = "INVENTORY_REPORT_APPROVER",
  INVENTORY_REPORT_AUDIT = "INVENTORY_REPORT_AUDIT",
  VEHICLE_LICENCE_CAPTURE_INITIATOR = "VEHICLE_LICENCE_CAPTURE_INITIATOR",
  VEHICLE_LICENCE_CAPTURE_VERIFIER = "VEHICLE_LICENCE_CAPTURE_VERIFIER",
  VEHICLE_LICENCE_CAPTURE_APPROVER = "VEHICLE_LICENCE_CAPTURE_APPROVER",
  VEHICLE_CHANGE_OF_OWNERSHIP_CAPTURE_INITIATOR = "VEHICLE_CHANGE_OF_OWNERSHIP_CAPTURE_INITIATOR",
  VEHICLE_CHANGE_OF_OWNERSHIP_CAPTURE_VERIFIER = "VEHICLE_CHANGE_OF_OWNERSHIP_CAPTURE_VERIFIER",
  VEHICLE_CHANGE_OF_OWNERSHIP_CAPTURE_APPROVER = "VEHICLE_CHANGE_OF_OWNERSHIP_CAPTURE_APPROVER",
}

export enum AccountStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  DEACTIVATED = "DEACTIVATED",
}

export interface IRole {
  id: number;
  role: Role;
  permissions: string[];
  active: boolean;
}

export interface IUser {
  id: number;
  userSlug: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  last_login: string;
  onboarding_complete: boolean;
  account_status: AccountStatus;
  createdBy: string;
  taxOffice: ITaxOffice;
  roles: IRole[];
}

export interface IRoleUser {
  roleId: string;
  role: Role;
  permissions: string[];
  active: boolean;
}

export interface IUserDet {
  id: string;
  name: string;
  email: string;
  usergroup: string;
  phone: string;
  dept: string
  designation: string,
  taxOffice: ITaxOfficeUser;
  roles: IRoleUser[];
}




export interface ITaxPayer {
  KGTIN: string;
  birth_date: string;
  birth_place: string;
  bvn: null | string;
  category: string;
  city: string;
  createtime: string;
  email?: string;
  e_mail?: string;
  employer_name?: string;
  coy_name?: string;
  employer_tin: string;
  enter_by: string;
  enter_date: string;
  first_name?: string;
  phone_no?: string;
  gender: "M" | "F";
  house_no: string;
  id: number;
  income_source: string;
  indv_title: string;
  issuance_place: string | null;
  lga: string;
  marital_status: string;
  middle_name?: string;
  mobile_number?: null | string;
  mother_name: string;
  nationality: string;
  nin: null | string;
  occupation: string;
  phone_number: string;
  platform: null | string;
  sector: string;
  stateOfOrigin: string | null;
  stateOfResidence: string;
  state_of_origin: string | null;
  state_of_residence: string;
  state?: string;
  street: string;
  surname: string;
  tax_authority: string;
  tax_office: string;
  tp_type: null | string;
  update_by: string;
  update_time: string;
  ward: string;
}

export const defaultTaxPayer: ITaxPayer = {
  KGTIN: "",
  birth_date: "",
  birth_place: "",
  bvn: null,
  category: "",
  city: "",
  createtime: "",
  email: "",
  e_mail: "",
  employer_name: "",
  coy_name: "",
  employer_tin: "",
  enter_by: "",
  enter_date: "",
  first_name: "",
  gender: "F",
  house_no: "",
  id: 0,
  income_source: "",
  indv_title: "",
  issuance_place: null,
  lga: "",
  marital_status: "",
  middle_name: "",
  mobile_number: null,
  mother_name: "",
  nationality: "",
  nin: null,
  occupation: "",
  phone_number: "",
  phone_no: "",
  platform: null,
  sector: "",
  stateOfOrigin: null,
  stateOfResidence: "",
  state_of_origin: null,
  state: null,
  state_of_residence: "",
  street: "",
  surname: "",
  tax_authority: "",
  tax_office: "",
  tp_type: null,
  update_by: "",
  update_time: "",
  ward: "",
};

export interface NewITaxPayer {
  KGTIN: string;
  birth_date: string;
  birth_place: string;
  bvn: null | string;
  category: string;
  city: string;
  createtime: string;
  email?: string;
  e_mail?: string;
  employer_name?: string;
  coy_name?: string;
  employer_tin: string;
  enter_by: string;
  enter_date: string;
  first_name?: string;
  phone_no?: string;
  gender: "M" | "F";
  house_no: string;
  id: number;
  income_source: string;
  indv_title: string;
  issuance_place: string | null;
  lga: string;
  marital_status: string;
  middle_name?: string;
  mobile_number?: null | string;
  mother_name: string;
  nationality: string;
  nin: null | string;
  occupation: string;
  phone_number: string;
  platform: null | string;
  sector: string;
  stateOfOrigin: string | null;
  stateOfResidence: string;
  state_of_origin: string | null;
  state_of_residence: string;
  state?: string;
  street: string;
  surname: string;
  tax_authority: string;
  tax_office: string;
  tp_type: null | string;
  update_by: string;
  update_time: string;
  ward: string;

  prev_first_name: string;
  prev_surname: string;
  prev_middle_name: string;
  prev_email: string;
  prev_e_mail: string;
  prev_phone_number: string;
  prev_phone_no: string;
  prev_coy_name: string;
  prev_lga: string;
  prev_state: string;
  prev_house_no: string;
  prev_street: string;
  prev_taxId: string;
  prev_company: string;
}

export const defaultNewTaxPayer: NewITaxPayer = {
  KGTIN: "",
  birth_date: "",
  birth_place: "",
  bvn: null,
  category: "",
  city: "",
  createtime: "",
  email: "",
  e_mail: "",
  employer_name: "",
  coy_name: "",
  employer_tin: "",
  enter_by: "",
  enter_date: "",
  first_name: "",
  gender: "F",
  house_no: "",
  id: 0,
  income_source: "",
  indv_title: "",
  issuance_place: null,
  lga: "",
  marital_status: "",
  middle_name: "",
  mobile_number: null,
  mother_name: "",
  nationality: "",
  nin: null,
  occupation: "",
  phone_number: "",
  phone_no: "",
  platform: null,
  sector: "",
  stateOfOrigin: null,
  stateOfResidence: "",
  state_of_origin: null,
  state: null,
  state_of_residence: "",
  street: "",
  surname: "",
  tax_authority: "",
  tax_office: "",
  tp_type: null,
  update_by: "",
  update_time: "",
  ward: "",

  prev_first_name: "",
  prev_surname: "",
  prev_middle_name: "",
  prev_email: "",
  prev_e_mail: "",
  prev_phone_number: "",
  prev_phone_no: "",
  prev_coy_name: "",
  prev_lga: "",
  prev_state: "",
  prev_house_no: "",
  prev_street: "",
  prev_taxId: "",
  prev_company: "",
};
