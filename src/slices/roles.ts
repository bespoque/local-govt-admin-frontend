import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IRole} from "components/user/user.interface";

type RolesState = IRole[];

const initialState: RolesState = [];

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    loadRoles: (state, action: PayloadAction<Partial<IRole>[]>) => {
      action.payload.forEach((rolePayload) => {
        const existingRole = state.find(
          (role: IRole) => role.id === rolePayload.id
        );
        if (existingRole) {
          Object.assign(existingRole, rolePayload);
        } else {
          state.push(rolePayload as IRole);
        }
      });
    },
  },
});

export const {loadRoles} = usersSlice.actions;

export default usersSlice.reducer;
