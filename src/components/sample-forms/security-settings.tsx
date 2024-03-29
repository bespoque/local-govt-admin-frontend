import {useForm, FormProvider} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {ErrorMessage} from "components/react-hook-form/error-message";
import {Input} from "components/react-hook-form/input";
import {updatePassword} from "slices/actions/authActions";
import {fetchUser} from "slices/actions/userActions";
import {useDispatch} from "react-redux";
import {updateLoggedInUser} from "slices/auth";
import {handleApiError} from "helpers/errors";
import {useAppSelector} from "store";
import {useState} from "react";
import {ThreeDots} from "react-loader-spinner";
import {toast} from "react-toastify";

export type FormProps = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const Index: React.FC<{userSlug: string}> = ({userSlug}) => {
  const dispatch = useDispatch();
  const userData = useAppSelector((state) => state.auth);
  const [reqLoading, setReqLoading] = useState<boolean>(false);
  const methods = useForm<FormProps>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: {errors},
  } = methods;

  const onSubmit = async (payload: FormProps) => {
    try {
      setReqLoading(true);
      await updatePassword(payload);
      toast.success("Password updated successfully");
      reset();
      const {data} = await fetchUser({userSlug});
      dispatch(updateLoggedInUser(data));
    } catch (error) {
      handleApiError(error, userData, "There was an error Updating password");
    } finally {
      setReqLoading(false);
    }
  };

  const passwordValidation = (value: string) => {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!pattern.test(value)) {
      return "Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)";
    }

    return true;
  };

  const confirmPasswordValidation = (value: string) => {
    const newPassword = methods.getValues("newPassword");
    return value === newPassword || "Passwords do not match";
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-y-1 gap-x-2 sm:grid-cols-12">
            <InputWrapper outerClassName="sm:col-span-12">
              <Label id="old-password">Current password</Label>
              <Input
                id="old-password"
                name="oldPassword"
                type="password"
                rules={{
                  required: "Please enter a password",
                }}
              />
              {errors?.oldPassword?.message && (
                <ErrorMessage>{errors.oldPassword.message}</ErrorMessage>
              )}
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-12">
              <Label id="new-password">New password</Label>
              <Input
                id="new-password"
                name="newPassword"
                type="password"
                rules={{
                  required: "Please enter a password",
                  validate: passwordValidation,
                }}
              />
              {errors?.newPassword?.message && (
                <ErrorMessage>{errors.newPassword.message}</ErrorMessage>
              )}
            </InputWrapper>
            <InputWrapper outerClassName="sm:col-span-12">
              <Label id="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                rules={{
                  required: "Please re-enter a password",
                  validate: confirmPasswordValidation,
                }}
              />
              {errors?.confirmPassword?.message && (
                <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
              )}
            </InputWrapper>
          </div>
        </div>

        <div className="flex justify-start space-x-2">
          <button
            onClick={() => {
              reset();
            }}
            type="button"
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancel
          </button>
          <button
            type="submit"
            className={`inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              reqLoading ? "disabled:opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={reqLoading}>
            {reqLoading ? (
              <ThreeDots
                height="30"
                width="30"
                radius="5"
                color="white"
                wrapperClass="button-container-spinner"
              />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
export default Index;
