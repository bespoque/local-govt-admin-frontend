import {Role} from "components/user/user.interface";
import React from "react";
import {IGenerateSiButtons, StockInStatus} from "./stock-in.interfaces";
import RoundSpinner from "components/spinners/roundSpinner";

export const StockInActionButtons: React.FC<IGenerateSiButtons> = ({
  stockIn,
  openInventoryModal,
  userRoles,
  userPermissions,
  verifyStockOutHandler,
  openAuditModal,
  approveStockOutHandler,
  loadingApiRequest,
}) => {
  if (
    !stockIn ||
    !openInventoryModal ||
    !verifyStockOutHandler ||
    !approveStockOutHandler ||
    !openAuditModal ||
    !approveStockOutHandler
  )
    return null;

  const canEdit =
    (userPermissions.includes("all") || userPermissions.includes("edit")) &&
    [
      StockInStatus.VERIFIED,
      StockInStatus.INITIATED,
      StockInStatus.AUDITED,
    ].includes(stockIn.status);

  const canVerify =
    (userPermissions.includes("all") ||
      (userPermissions.includes("write") &&
        userRoles.includes(Role.INVENTORY_RECEIVE_VERIFIER))) &&
    stockIn.status === StockInStatus.INITIATED;

  const canAudit =
    (userPermissions.includes("all") ||
      (userPermissions.includes("write") &&
        userRoles.includes(Role.INVENTORY_RECEIVE_AUDITOR))) &&
    stockIn.status === StockInStatus.VERIFIED;

  const canApprove =
    (userPermissions.includes("all") ||
      (userPermissions.includes("write") &&
        userRoles.includes(Role.INVENTORY_RECEIVE_APPROVER))) &&
    stockIn.status === StockInStatus.AUDITED;

  return (
    <div className="flex flex-row items-center justify-start p-4">
      <div className="shrink-0 hidden ml-auto space-x-2 lg:flex">
        {loadingApiRequest ? (
          <RoundSpinner />
        ) : (
          <>
            {canEdit && (
              <button
                onClick={openInventoryModal}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
                Update
              </button>
            )}
            {canVerify && (
              <button
                onClick={verifyStockOutHandler}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-green-500 rounded-lg hover:bg-green-600">
                Verify
              </button>
            )}

            {canAudit && (
              <button
                onClick={openAuditModal}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-green-500 rounded-lg hover:bg-green-600">
                Audit
              </button>
            )}
            {canApprove && (
              <button
                onClick={approveStockOutHandler}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-green-500 rounded-lg hover:bg-green-600">
                Approve
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
