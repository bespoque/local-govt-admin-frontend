import { useForm, FormProvider } from "react-hook-form";
import { InputWrapper } from "components/react-hook-form/input-wrapper";
import { Label } from "components/react-hook-form/label";
import { ErrorMessage } from "components/react-hook-form/error-message";
import { Input } from "components/react-hook-form/input";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { authenticate } from "slices/actions/authActions";
import { useState } from "react";
import { loginUser } from "slices/auth";
import { ThreeDots } from "react-loader-spinner";

export type FormProps = {
  username: string;
  password: string;
};

const Index: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const methods = useForm<FormProps>({
    defaultValues: {
      username: "johnmary@lga.com",
      password: "Windows@1p",
    },
  });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: FormProps) => {
    try {
      setErrorMessage(null);
      setLoading(true);
      const response = await authenticate(data);
      if (response.data.token) {
        localStorage.setItem("access_token", response.data.token);
      }      

      // Transforming permissions array to roles array
      const updatedUser = response.data.user[0];
      const updatedJson = {
        "user": {
          ...updatedUser,
          "roles": response.data.permissions.map((permission, index) => ({
            "roleId": index + 1,
            "role": permission,
            "permissions": ["all"],
            "active": true
          })),
          "taxOffice": response.data.taxOffice[0]
        },
        "status": response.data.status,
        "message": response.data.message,
        "token": response.data.token,
        "redirect": response.data.redirect
      };

      // Conditionally add SUPER_ADMIN role
      if (updatedUser.usergroup === "1") {
        updatedJson.user.roles.push({
          "roleId": updatedJson.user.roles.length + 1,
          "role": "SUPER_ADMIN",
          "permissions": ["all"],
          "active": true
        });
      }




      dispatch(loginUser(updatedJson?.user));
      // dispatch(loginUser(response.data.user));
      setLoading(false);
      router.push("/dashboard");

    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        if (error.response.data?.innerError?.code === "ENETUNREACH") {
          setErrorMessage("Network Error");
        } else {
          setErrorMessage(error.response.data?.message);
        }
      } else {
        setErrorMessage("There was an error, Please try again");
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
        {errorMessage && (
          <div className="border border-white rounded-md p-3 text-center bg-red-500 text-white">
            {" "}
            {errorMessage}
          </div>
        )}

        <div className="space-y-6">
          <p className="w-[430px] text-stone-950 text-[28px] font-bold font-['Onest']">Welcome administrator</p>
          <p className="w-[430px] text-stone-950 text-base font-small font-['Onest']">Please Input your details</p>
          <div className="grid grid-cols-1 gap-y-1 gap-x-2 sm:grid-cols-12">
            <InputWrapper outerClassName="sm:col-span-12">
              <Label id="email">Email</Label>
              <Input
                id="email"
                name="username"
                type="email"
                rules={{ required: "Please enter a valid email" }}
              />
              {errors?.username?.message && (
                <ErrorMessage>{errors.username.message}</ErrorMessage>
              )}
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-12">
              <Label id="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                rules={{
                  required: "Please enter a password",
                }}
              />
              {errors?.password?.message && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
              )}
            </InputWrapper>
          </div>
        </div>

        <div className="flex justify-start space-x-2">
          <button
            disabled={loading}
            type="submit"
            className={`py-3.5 bg-cyan-950 rounded shadow justify-center items-center gap-2.5 inline-flex text-sm font-medium text-white border border-transparent shadow-sm rounded-md w-full ${loading ? "opacity-60 cursor-not-allowed" : "opacity-100"
              }`}>
            {loading ? (
              <ThreeDots
                height="20"
                width="30"
                radius="5"
                color="white"
                wrapperClass="button-container-spinner"
              />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
export default Index;
