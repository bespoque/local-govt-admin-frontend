import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IVendor} from "components/vendor/vendor.interface";

type vendorState = IVendor[];

const initialState: vendorState = [];

export const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    loadVendors: (state, action: PayloadAction<Partial<IVendor>[]>) => {
      action.payload.forEach((payload) => {
        const existingTaxOffice = state.find(
          (role: IVendor) => role.id === payload.id
        );
        if (existingTaxOffice) {
          Object.assign(existingTaxOffice, payload);
        } else {
          state.push(payload as IVendor);
        }
      });
    },
  },
});

export const {loadVendors} = vendorSlice.actions;

export default vendorSlice.reducer;
