import {Role} from "components/user/user.interface";



export const GROUP_IDENTITY_MANAGEMENT: Role[] = [
  Role.identity_indv_list,
  Role.identity_corp_list,
  Role.identity_agent_list,
];
export const GROUP_USER_MANAGEMENT: Role[] = [
  Role.user_update,
  Role.user_view,
  Role.user_list,
  Role.user_new,
  Role.user_password,
  Role.user_login,
];
export const GROUP_PERMISSION_MANAGEMENT: Role[] = [
  Role.group_permission_list,
  Role.group_permission_remove,
  Role.group_permission_add,
  Role.group_create,
];
export const GROUP_COLLECTION: Role[] = [
  Role.collection_view,
];

