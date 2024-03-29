import {ITaxOffice} from "components/tax-office/tax-office.interface";
import {IVendor} from "components/vendor/vendor.interface";

export interface IItem {
  id: number;
  itemType: string;
  price: string;
  description?: string;
}

export interface IInventoryItem {
  id: number;
  uniqueId?: string;
  procuredPrice: string;
  sold?: boolean;
  soldAt?: string;
  soldTo?: string;
  createdAt: string;
  locked: boolean;
  itemTypeId: IItem;
  location: ITaxOffice;
  vendor: IVendor;
}
