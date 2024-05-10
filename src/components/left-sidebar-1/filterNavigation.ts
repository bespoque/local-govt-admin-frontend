import {TaxOfficeEnum} from "components/tax-office/tax-office.interface";
import {Role} from "components/user/user.interface";
import {NavigationState} from "components/left-sidebar-1/navigation";

export const filterNavigation = (
  navigation: NavigationState[],
  userRoles: Role[],
  userLocation: TaxOfficeEnum
): NavigationState[] => {
  return navigation.filter((section) => {
    const isAdminOrSuperAdmin =
      userRoles.includes(Role.ADMIN) || userRoles.includes(Role.SUPERADMIN);

    const isDashboard = section.title?.toLowerCase() === "dashboard";

    const hasMatchingRole = section.allowedRoles?.some((role) =>
      userRoles.includes(role)
    );

    const isAllowedLocation =
      !section.allowedLocations ||
      section.allowedLocations.includes(userLocation);

    const isNotAllowedLocation =
      section.notAllowLocations?.includes(userLocation);

    if (
      isAdminOrSuperAdmin ||
      isDashboard ||
      (hasMatchingRole && isAllowedLocation && !isNotAllowedLocation)
    ) {
      if (section.items.length) {
        section.items = filterNavigation(
          section.items,
          userRoles,
          userLocation
        );
      }

      // Remove Transfer section if it has no children - if it is a Receive user from store
      if (
        section.title.toLowerCase() === "transfer" &&
        !section.items?.length
      ) {
        return false;
      }
      return true;
    }

    return false;
  });
};
