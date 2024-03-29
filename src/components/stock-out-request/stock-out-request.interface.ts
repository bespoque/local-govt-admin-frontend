import {IInventoryItem} from "components/inventory-item/inventory-item.interface";
import {ITaxOffice} from "components/tax-office/tax-office.interface";

export interface IStockOutRequest {
  id: number;
  stockOutRequestOrderId: string;
  requestBy: ITaxOffice;
  requestItems: IInventoryItem[];
  requestFrom: ITaxOffice;
  status: string;
  description?: string;
  createdAt: Date;
}
