import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IProcurement} from "components/procurement/procurement.interface";

type ProcurementsState = IProcurement[];

const initialState: ProcurementsState = [];

export const usersSlice = createSlice({
  name: "procurements",
  initialState,
  reducers: {
    loadProcurements: (
      state,
      action: PayloadAction<Partial<IProcurement>[]>
    ) => {
      action.payload.forEach((payload) => {
        const existingProcurement = state.find(
          (user) => user.id === payload.id
        );
        if (existingProcurement) {
          Object.assign(existingProcurement, payload);
        } else {
          state.push(payload as IProcurement);
        }
      });
    },
    addProcurement: (state, action: PayloadAction<Partial<IProcurement>>) => {
      const existingProcurement = state.find(
        (procurement) => procurement.id === action.payload.id
      );
      if (existingProcurement) {
        Object.assign(existingProcurement, action.payload);
      } else {
        state.push(action.payload as IProcurement);
      }
    },
  },
});

export const {loadProcurements, addProcurement} = usersSlice.actions;

export default usersSlice.reducer;
