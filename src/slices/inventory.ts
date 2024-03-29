import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IItem} from "components/inventory-item/inventory-item.interface";

type inventoryState = IItem[];

const initialState: inventoryState = [];

export const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    loadInventoryItems: (state, action: PayloadAction<Partial<IItem>[]>) => {
      action.payload.forEach((payload) => {
        const existingTaxOffice = state.find(
          (role: IItem) => role.id === payload.id
        );
        if (existingTaxOffice) {
          Object.assign(existingTaxOffice, payload);
        } else {
          state.push(payload as IItem);
        }
      });
    },
    removeInventoryItem: (state, action: PayloadAction<string>) => {
      const itemTypeToRemove = action.payload;
      return state.filter((item) => item.id !== Number(itemTypeToRemove));
    },
  },
});

export const {loadInventoryItems, removeInventoryItem} = inventorySlice.actions;

export default inventorySlice.reducer;
