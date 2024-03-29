import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IUser} from "components/user/user.interface";

// Define a type for the slice state

const initialState: IUser = {
  id: null,
  userSlug: null,
  email: null,
  firstName: null,
  middleName: null,
  lastName: null,
  phone: null,
  last_login: null,
  onboarding_complete: false,
  account_status: null,
  createdBy: null,
  taxOffice: null,
  roles: [],
};

export const configSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<Partial<IUser>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateLoggedInUser: (state, action: PayloadAction<Partial<IUser>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    logoutLoggedInUser: () => {
      localStorage.clear();
      return {
        ...initialState,
      };
    },
  },
});

export const {loginUser, logoutLoggedInUser, updateLoggedInUser} =
  configSlice.actions;

export default configSlice.reducer;
