import {Role} from "components/user/user.interface";
import React from "react";
import {IGenerateVCOButtons, VehicleChangeOfOwnershipStatus} from "./interface";
import RoundSpinner from "components/spinners/roundSpinner";
import {GROUP_CHANGE_OF_OWNERSHIP_CAPTURE} from "components/left-sidebar-1/constants";
import {useRouter} from "next/router";

export const VCofOActionButtons: React.FC<IGenerateVCOButtons> = ({
  vco,
  userRoles,
  userPermissions,
  createAssessmentHandler,
  printAssessmentHandler,
  verifyHandler,
  approveHandler,
  sendToPrinterHandler,
  reqLoading,
}) => {
  const router = useRouter();

  if (!vco || !verifyHandler || !approveHandler) return null;

  const canEdit =
    (userPermissions.includes("all") || userPermissions.includes("edit")) &&
    [
      VehicleChangeOfOwnershipStatus.INITIATED,
      VehicleChangeOfOwnershipStatus.REJECTED,
      VehicleChangeOfOwnershipStatus.PARTIAL_DOCUMENTS,
      VehicleChangeOfOwnershipStatus.DOCUMENTS_UPLOADED,
    ].includes(vco.status);

  const canCreateAssessment =
    (userPermissions.includes("all") ||
      (userPermissions.includes("print") &&
        userRoles.includes(Role.VEHICLE_CHANGE_OF_OWNERSHIP_CAPTURE_INITIATOR))) &&
    vco.status === VehicleChangeOfOwnershipStatus.DOCUMENTS_UPLOADED;

  const canPrintAssessment =
    (userPermissions.includes("all") ||
      (userPermissions.includes("print") &&
        userRoles.includes(Role.VEHICLE_CHANGE_OF_OWNERSHIP_CAPTURE_INITIATOR))) &&
    vco.status === VehicleChangeOfOwnershipStatus.ASSESSMENT_CREATED;

  const canVerify =
    (userPermissions.includes("all") ||
      (userPermissions.includes("write") &&
        userRoles.includes(Role.VEHICLE_CHANGE_OF_OWNERSHIP_CAPTURE_VERIFIER))) &&
    vco.status === VehicleChangeOfOwnershipStatus.PAID;

  const canApprove =
    (userPermissions.includes("all") ||
      (userPermissions.includes("write") &&
        userRoles.includes(Role.VEHICLE_CHANGE_OF_OWNERSHIP_CAPTURE_APPROVER))) &&
    vco.status === VehicleChangeOfOwnershipStatus.VERIFIED;

  const canSendToPrinter =
    (userPermissions.includes("all") ||
      (userPermissions.includes("write") &&
        GROUP_CHANGE_OF_OWNERSHIP_CAPTURE.some((item) =>
          userRoles.includes(item)
        ))) &&
    [
      VehicleChangeOfOwnershipStatus.EXTERNAL_IDS_APPROVED,
      VehicleChangeOfOwnershipStatus.ISSUED,
    ].includes(vco.status);

  return (
    <div className="flex flex-row items-center justify-start p-4">
      <div className="shrink-0 hidden ml-auto space-x-2 lg:flex">
        {reqLoading ? (
          <RoundSpinner />
        ) : (
          <>
            {canEdit && (
              <button
                onClick={() =>
                  router.push(
                    `/change-ownerships/edit?id=${vco.coRequestSlug}`
                  )
                }
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
                Edit
              </button>
            )}

            {canCreateAssessment && (
              <button
                onClick={createAssessmentHandler}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
                Create Assessment
              </button>
            )}

            {canPrintAssessment && (
              <button
                onClick={printAssessmentHandler}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
                Print Assessment
              </button>
            )}

            {canVerify && (
              <button
                onClick={verifyHandler}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-green-500 rounded-lg hover:bg-green-600">
                Verify
              </button>
            )}
            {canApprove && (
              <button
                onClick={approveHandler}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-green-500 rounded-lg hover:bg-green-600">
                Approve
              </button>
            )}

            {canSendToPrinter && (
              <button
                onClick={sendToPrinterHandler}
                className="px-4 py-2 text-xs font-bold text-black border uppercase bg-white-500 rounded-lg hover:bg-white-600">
                Print Licence
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
