import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IStockOut} from "components/stock-out/stock-out.interfaces";

type StockOutsState = IStockOut[];

const initialState: StockOutsState = [];

export const usersSlice = createSlice({
  name: "stockOuts",
  initialState,
  reducers: {
    loadStockOuts: (state, action: PayloadAction<Partial<IStockOut>[]>) => {
      state.length = 0;
      action.payload?.length &&
        action.payload.forEach((payload) => {
          state.push(payload as IStockOut);
        });
    },
    addStockOut: (state, action: PayloadAction<Partial<IStockOut>>) => {
      const existingStockOut = state.find(
        (stockOut) => stockOut.id === action.payload.id
      );
      if (existingStockOut) {
        Object.assign(existingStockOut, action.payload);
      } else {
        state.push(action.payload as IStockOut);
      }
    },
  },
});

export const {loadStockOuts, addStockOut} = usersSlice.actions;

export default usersSlice.reducer;
