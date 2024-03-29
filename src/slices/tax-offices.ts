import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface ITaxOffice {
  id: number;
  name: string;
  value: string[];
}

type TaxOfficeState = ITaxOffice[];

const initialState: TaxOfficeState = [];

export const taxOfficeSlice = createSlice({
  name: "taxOffice",
  initialState,
  reducers: {
    loadTaxOffices: (state, action: PayloadAction<Partial<ITaxOffice>[]>) => {
      action.payload.forEach((taxOfficePayload) => {
        const existingTaxOffice = state.find(
          (role: ITaxOffice) => role.id === taxOfficePayload.id
        );
        if (existingTaxOffice) {
          Object.assign(existingTaxOffice, taxOfficePayload);
        } else {
          state.push(taxOfficePayload as ITaxOffice);
        }
      });
    },
  },
});

export const {loadTaxOffices} = taxOfficeSlice.actions;

export default taxOfficeSlice.reducer;
