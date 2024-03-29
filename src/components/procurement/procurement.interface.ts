import {IInventoryItem} from "components/inventory-item/inventory-item.interface";
import {IUser} from "components/user/user.interface";
import {IVendor} from "components/vendor/vendor.interface";

export enum ProcurementStatus {
  INITIATED = "INITIATED",
  VERIFIED = "VERIFIED",
  APPROVED = "APPROVED",
  ECAPPROVED = "ECAPPROVED",
  SENTOUT = "SENTOUT",
  DELIVERED = "DELIVERED",
  AUDITED = "AUDITED",
  FINANCE_APPROVED = "FINANCE_APPROVED",
}

interface IPaymentReceipt {
  id: string;
  fileKey: string;
  fileBucket: string;
  fileType: string;
  createdAt: string;
}

export interface IProcurement {
  id: number;
  orderId: string;
  status: ProcurementStatus;
  description: string;
  expectedDate: string;
  verifiedAt: string;
  approvedAt: string;
  ecApprovedAt: string;
  sentOutAt: string;
  deliveredAt: string;
  createdAt: string;
  vendor: IVendor;
  inventoryItems: IInventoryItem[];
  initiator: IUser;
  verifier: IUser;
  approver: IUser;
  ecUser: IUser;
  paymentReceipt?: IPaymentReceipt;
}

export interface IGenerateProcurementButtons {
  procurement: IProcurement;
  openModal: () => void;
  userRoles: string[];
  userPermissions: string[];
  verifyOrderHandler: (orderId: any) => Promise<void>;
  approveOrderHandler: (orderId: any) => Promise<void>;
  sendOutOrderHandler: (orderId: any) => Promise<void>;
  ecApproveOrderHandler: (orderId: any) => Promise<void>;
  auditHandler: () => void;
  financeHandler: () => void;
  reqLoading: boolean;
}
