import React from "react";

type RoleBasedButtonsProps = {
  userRoles: string[];
  roleToButtonActions: string[];
};

const RoleBasedButtons: React.FC<RoleBasedButtonsProps> = ({
  userRoles,
  roleToButtonActions,
}) => {
  // Check if user has admin or super admin role
  const isAdminOrSuperAdmin = userRoles.includes("all");
  // console.log(roleToButtonActions, "acc");
  // console.log(userRoles, "usracc");
  return (
    <div className="shrink-0 hidden ml-auto space-x-2 lg:flex">
      {isAdminOrSuperAdmin ? (
        // If admin or super admin, show all buttons
        <>
          {roleToButtonActions.includes("edit") && (
            <button className="px-4 py-2 text-xs font-bold text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
              Edit
            </button>
          )}
          {roleToButtonActions.includes("write") && (
            <button className="px-4 py-2 text-xs font-bold text-white uppercase bg-green-500 rounded-lg hover:bg-green-600">
              Verify
            </button>
          )}
          {roleToButtonActions.includes("write") && (
            <button className="px-4 py-2 text-xs font-bold text-white uppercase bg-green-500 rounded-lg hover:bg-green-600">
              Approve
            </button>
          )}
          {roleToButtonActions.includes("write") && (
            <button className="px-4 py-2 text-xs font-bold text-white uppercase bg-green-500 rounded-lg hover:bg-green-600">
              EC Approve
            </button>
          )}
          {roleToButtonActions.includes("print") && (
            <button className="px-4 py-2 text-xs font-bold text-black border uppercase bg-white-500 rounded-lg hover:bg-white-600">
              Print
            </button>
          )}
        </>
      ) : (
        // Render buttons based on user's roles and allowed actions
        userRoles.flatMap((role) => {
          if (roleToButtonActions.includes(role)) {
            let buttonColorClass = "";

            // Set button colors based on action
            // console.log(role);
            switch (role) {
              case "edit":
                buttonColorClass = "bg-blue-500 hover:bg-blue-600";
                break;

              case "write":
                buttonColorClass = "bg-green-500 hover:bg-green-600";
                break;

              case "print":
                buttonColorClass =
                  "text-black border bg-white-500 hover:bg-white-600";
                break;

              default:
                break;
            }

            return (
              <button
                key={`${role}`}
                className={`px-4 py-2 text-xs font-bold text-white uppercase rounded-lg ${buttonColorClass}`}>
                {role}
              </button>
            );
          }
          return null; // Don't render if there's no allowed actions for the role
        })
      )}
    </div>
  );
};

export default RoleBasedButtons;
