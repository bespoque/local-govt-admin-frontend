import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// Define a type for the slice state
interface IStock {
  storeName: string;
  items: {
    itemType: string;
    count: number;
  }[];
}

const initialState: IStock[] = [];

export const configSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    loadStocks: (state, action: PayloadAction<Partial<IStock>[]>) => {
      return action.payload as IStock[];
    },
  },
});

export const {loadStocks} = configSlice.actions;

export default configSlice.reducer;
