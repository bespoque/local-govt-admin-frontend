import {IItem} from "components/inventory-item/inventory-item.interface";

export interface IVendor {
  id: number;
  name: string;
  slug: string;
  phone: string;
  description?: string;
  archived: boolean;
  createdAt: string;
  items: IItem[];
}
