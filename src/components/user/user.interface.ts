import { ITaxOffice, ITaxOfficeUser } from "components/tax-office/tax-office.interface";

export enum Role {
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
  collection_view = "collection_view",
  user_update = "user_update",
  user_view = "user_view",
  user_list = "user_list",
  user_new = "user_new",
  user_password = "user_password",
  user_login = "user_login",
  group_create = "group_create",
  group_permission_add = "group_permission_add",
  group_permission_remove = "group_permission_remove",
  group_permission_list = "group_permission_list",
  identity_indv_list = "identity_indv_list",
  identity_corp_list = "identity_corp_list",
  identity_agent_list = "identity_agent_list",
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





