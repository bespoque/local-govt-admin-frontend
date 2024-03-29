import {IUser} from "components/user/user.interface";
import {logErrors} from "slices/actions/otherActions";
import {toast} from "react-toastify";

const handleError = ({
  error,
  userData,
  defaultMessage,
}: {
  error: any;
  userData: IUser;
  defaultMessage?: string;
}): string[] => {
  if (error.statusCode === 401) {
    window.location.reload();
  }
  let mainMessage =
    error?.response?.data?.innerError?.message ||
    error?.response?.data?.message;
  if (typeof error === "string") {
    mainMessage = [error];
  }

  const currentPath = window.location.pathname;

  logErrors({path: currentPath, error: mainMessage, user: userData?.userSlug});

  return Array.isArray(mainMessage)
    ? mainMessage
    : mainMessage
    ? [mainMessage]
    : [defaultMessage || "There was an error! Please, contact admin."];
};

export const handleApiError = (error, userData, defaultMessage?) => {
  const errors = handleError({error, userData, defaultMessage});

  for (const error of errors) {
    toast.error(error);
  }
};
