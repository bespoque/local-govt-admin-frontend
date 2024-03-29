import {Role} from "components/user/user.interface";
import React from "react";
import {IGenerateSoButtons, StockOutStatus} from "./stock-out.interfaces";
import RoundSpinner from "components/spinners/roundSpinner";

export const StockOutActionButtons: React.FC<IGenerateSoButtons> = ({
  stockOut,
  openModal,
  userRoles,
  userPermissions,
  verifyStockOutHandler,
  approveStockOutHandler,
  sendOutStockOutHandler,
  loadingApiRequest,
  auditModal,
}) => {
  if (
    !stockOut ||
    !openModal ||
    !verifyStockOutHandler ||
    !approveStockOutHandler ||
    !sendOutStockOutHandler
  )
    return null;

  const canEdit =
    (userPermissions.includes("all") || userPermissions.includes("edit")) &&
    [StockOutStatus.VERIFIED, StockOutStatus.INITIATED].includes(
      stockOut.status
    );

  const canVerify =
    (userPermissions.includes("all") ||
      (userPermissions.includes("write") &&
        userRoles.includes(Role.INVENTORY_TRANSFER_VERIFIER))) &&
    stockOut.status === StockOutStatus.INITIATED;

  const canApprove =
    (userPermissions.includes("all") ||
      (userPermissions.includes("write") &&
        userRoles.includes(Role.INVENTORY_TRANSFER_APPROVER))) &&
    stockOut.status === StockOutStatus.AUDITED;

  const canAudit =
    (userPermissions.includes("all") ||
      (userPermissions.includes("write") &&
        userRoles.includes(Role.INVENTORY_TRANSFER_APPROVER))) &&
    stockOut.status === StockOutStatus.VERIFIED;

  const canPrint =
    (userPermissions.includes("all") ||
      (userPermissions.includes("print") &&
        userRoles.includes(Role.INVENTORY_TRANSFER_INITIATOR))) &&
    [StockOutStatus.APPROVED, StockOutStatus.SENTOUT].includes(stockOut.status);

  return (
    <div className="flex flex-row items-center justify-start p-4">
      <div className="shrink-0 hidden ml-auto space-x-2 lg:flex">
        {loadingApiRequest ? (
          <RoundSpinner />
        ) : (
          <>
            {canEdit && (
              <button
                onClick={openModal}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
                Edit
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
                onClick={auditModal}
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
            {canPrint && (
              <button
                onClick={sendOutStockOutHandler}
                className="px-4 py-2 text-xs font-bold text-black border uppercase bg-white-500 rounded-lg hover:bg-white-600">
                Print
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
