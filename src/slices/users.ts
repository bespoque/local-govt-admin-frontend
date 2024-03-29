import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IUser} from "components/user/user.interface";

// Define the slice state as an array of users
type UsersState = IUser[];

const initialState: UsersState = [];

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateUsers: (state, action: PayloadAction<Partial<IUser>[]>) => {
      action.payload.forEach((userPayload) => {
        const existingUser = state.find((user) => user.id === userPayload.id);
        if (existingUser) {
          Object.assign(existingUser, userPayload);
        } else {
          state.push(userPayload as IUser);
        }
      });
    },
    addUser: (state, action: PayloadAction<Partial<IUser>>) => {
      const existingUser = state.find((user) => user.id === action.payload.id);
      if (existingUser) {
        Object.assign(existingUser, action.payload);
      } else {
        state.push(action.payload as IUser);
      }
    },
  },
});

export const {updateUsers, addUser} = usersSlice.actions;

export default usersSlice.reducer;
