import {IInventoryItem} from "components/inventory-item/inventory-item.interface";
import {IStockOutRequest} from "components/stock-out-request/stock-out-request.interface";
import {ITaxOffice} from "components/tax-office/tax-office.interface";
import {IUser} from "components/user/user.interface";

export enum StockOutStatus {
  INITIATED = "INITIATED",
  VERIFIED = "VERIFIED",
  APPROVED = "APPROVED",
  SENTOUT = "SENTOUT",
  DELIVERED = "DELIVERED",
  AUDITED = "AUDITED",
}

export interface IStockOut {
  id: number;
  stockOutOrderId: string;
  stockOutRequest?: IStockOutRequest;
  initiator?: IUser;
  verifier?: IUser;
  approver?: IUser;
  fromLocation: ITaxOffice;
  toLocation: ITaxOffice;
  status: StockOutStatus;
  inventoryItems?: IInventoryItem[];
  verifiedAt?: Date;
  approvedAt?: Date;
  sentOutAt?: Date;
  deliveredAt?: Date;
  remarks?: string;
  createdAt: Date;
}

export interface IGenerateSoButtons {
  stockOut: IStockOut;
  openModal: () => void;
  userRoles: string[];
  userPermissions: string[];
  verifyStockOutHandler: () => void;
  approveStockOutHandler: () => void;
  sendOutStockOutHandler: () => void;
  auditModal: () => void;
  loadingApiRequest: boolean;
}

export interface IStockOutList {
  stockOuts: IStockOut[];
  link: string;
}
