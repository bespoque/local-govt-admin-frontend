import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IStockIn} from "components/stock-in/stock-in.interfaces";

type StockInsState = IStockIn[];

const initialState: StockInsState = [];

export const stockInSlice = createSlice({
  name: "stockIns",
  initialState,
  reducers: {
    loadStockIns: (state, action: PayloadAction<Partial<IStockIn>[]>) => {
      state.length = 0;
      action.payload?.length &&
        action.payload.forEach((payload) => {
          state.push(payload as IStockIn);
        });
    },
    addStockIn: (state, action: PayloadAction<Partial<IStockIn>>) => {
      const existingStockIn = state.find(
        (stockIn) => stockIn.id === action.payload.id
      );
      if (existingStockIn) {
        Object.assign(existingStockIn, action.payload);
      } else {
        state.push(action.payload as IStockIn);
      }
    },
  },
});

export const {loadStockIns, addStockIn} = stockInSlice.actions;

export default stockInSlice.reducer;
