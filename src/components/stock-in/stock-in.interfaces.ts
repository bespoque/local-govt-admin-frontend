import {IInventoryItem} from "components/inventory-item/inventory-item.interface";
import {IProcurement} from "components/procurement/procurement.interface";
import {IStockOut} from "components/stock-out/stock-out.interfaces";
import {ITaxOffice} from "components/tax-office/tax-office.interface";
import {IUser} from "components/user/user.interface";

export enum StockInStatus {
  INITIATED = "INITIATED",
  VERIFIED = "VERIFIED",
  AUDITED = "AUDITED",
  APPROVED = "APPROVED",
}

export interface IStockIn {
  id: number;
  stockInOrderId: string;
  stockOut?: IStockOut;
  procurement?: IProcurement;
  initiator: IUser;
  verifier?: IUser;
  auditor?: IUser;
  approver?: IUser;
  status: StockInStatus;
  fromLocation: ITaxOffice;
  toLocation: ITaxOffice;
  itemsReceived?: IInventoryItem[];
  verifiedAt?: Date;
  auditedAt?: Date;
  approvedAt?: Date;
  receivedAt?: Date;
  auditComments?: string;
  remarks?: string;
  createdAt: Date;
}
export interface IStockInList {
  stockIns: IStockIn[];
}

export interface IGenerateSiButtons {
  stockIn: IStockIn;
  openInventoryModal: () => void;
  openAuditModal: () => void;
  userRoles: string[];
  userPermissions: string[];
  verifyStockOutHandler: () => void;
  approveStockOutHandler: () => void;
  loadingApiRequest: boolean;
}
