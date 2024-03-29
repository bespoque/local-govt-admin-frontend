import {Role} from "components/user/user.interface";
import React from "react";
import {
  IGenerateProcurementButtons,
  ProcurementStatus,
} from "./procurement.interface";
import RoundSpinner from "components/spinners/roundSpinner";

export const ProcurementActionButtons: React.FC<
  IGenerateProcurementButtons
> = ({
  procurement,
  openModal,
  userRoles,
  userPermissions,
  verifyOrderHandler,
  approveOrderHandler,
  sendOutOrderHandler,
  ecApproveOrderHandler,
  auditHandler,
  reqLoading,
  financeHandler,
}) => {
  if (
    !procurement ||
    !openModal ||
    !verifyOrderHandler ||
    !approveOrderHandler ||
    !sendOutOrderHandler
  )
    return null;

  const canEdit =
    (userPermissions.includes("all") || userPermissions.includes("edit")) &&
    [ProcurementStatus.VERIFIED, ProcurementStatus.INITIATED].includes(
      procurement.status
    );

  const canVerify =
    (userPermissions.includes("all") ||
      (userPermissions.includes("write") &&
        userRoles.includes(Role.INVENTORY_PROCUREMENT_VERIFIER))) &&
    procurement.status === ProcurementStatus.INITIATED;
  const canAudit =
    (userPermissions.includes("all") ||
      (userPermissions.includes("write") &&
        userRoles.includes(Role.INVENTORY_PROCUREMENT_AUDITOR))) &&
    procurement.status === ProcurementStatus.VERIFIED;

  const canApprove =
    (userPermissions.includes("all") ||
      (userPermissions.includes("write") &&
        userRoles.includes(Role.INVENTORY_PROCUREMENT_APPROVER))) &&
    procurement.status === ProcurementStatus.AUDITED;

  const canEcApprove =
    (userPermissions.includes("all") ||
      (userPermissions.includes("write") &&
        userRoles.includes(Role.INVENTORY_PROCUREMENT_EC))) &&
    procurement.status === ProcurementStatus.APPROVED;

  const canFinanceApprove =
    (userPermissions.includes("all") ||
      (userPermissions.includes("write") &&
        userRoles.includes(Role.INVENTORY_PROCUREMENT_FINANCE_APPROVER))) &&
    procurement.status === ProcurementStatus.ECAPPROVED;

  const canPrint =
    (userPermissions.includes("all") ||
      (userPermissions.includes("print") &&
        userRoles.includes(Role.INVENTORY_PROCUREMENT_INITIATOR))) &&
    [ProcurementStatus.FINANCE_APPROVED, ProcurementStatus.SENTOUT].includes(
      procurement.status
    );

  return (
    <div className="flex flex-row items-center justify-start p-4">
      <div className="shrink-0 hidden ml-auto space-x-2 lg:flex">
        {reqLoading ? (
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
            {canAudit && (
              <button
                onClick={auditHandler}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
                Audit
              </button>
            )}
            {canVerify && (
              <button
                onClick={verifyOrderHandler}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-green-500 rounded-lg hover:bg-green-600">
                Verify
              </button>
            )}
            {canApprove && (
              <button
                onClick={approveOrderHandler}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-green-500 rounded-lg hover:bg-green-600">
                Approve
              </button>
            )}
            {canEcApprove && (
              <button
                onClick={ecApproveOrderHandler}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-green-500 rounded-lg hover:bg-green-600">
                ECApprove
              </button>
            )}
            {canFinanceApprove && (
              <button
                onClick={financeHandler}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-green-500 rounded-lg hover:bg-green-600">
                Finance Approve
              </button>
            )}
            {canPrint && (
              <button
                onClick={sendOutOrderHandler}
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
