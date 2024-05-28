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

      // const response = {
      //   "data": {
      //     "user": [
      //       {
      //         "id": "1",
      //         "name": "John Mary",
      //         "email": "johnmary@lga.com",
      //         "usergroup": "1",
      //         "phone": "08037379863",
      //         "dept": "IT",
      //         "designation": "Developer"
      //       }
      //     ],
      //     "taxOffice": [
      //       {
      //         "id": "1",
      //         "taxOffice": "DEFAULT",
      //         "adminuser": "johnmary@lga.com",
      //         "add1": "Lokoja",
      //         "add2": null,
      //         "phone": "090999934",
      //         "email": "info@bespoque.ng",
      //         "primarycolor": "#000000",
      //         "logourl": "https://irs.kg.gov.ng/wp-content/uploads/2018/05/KGIRS-logo-txt-2.png"
      //       }
      //     ],
      //     "permissions": [
      //       "user_login",
      //       "user_password",
      //       "group_create",
      //       "group_permission_add",
      //       "group_permission_remove",
      //       "group_permission_list",
      //       "user_new",
      //       "user_list",
      //       "user_view",
      //       "user_update",
      //       "SUPERADMIN",
      //       "collection_view",
      //       "identity_indv_list",
      //       "identity_corp_list",
      //       "identity_agent_list"
      //     ],
      //     "status": "200",
      //     "message": "OKAY",
      //     "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTYzODM5OTgsImV4cCI6MTc0NzkxOTk5OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.jtmug4_RzUtR-1yAjzEqWe6CawN6MyhSsvdX95ai0Wo",
      //     "redirect": "false"
      //   }
      // };

    
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

      if (updatedJson.token) {
        localStorage.setItem("access_token", response.data.token);
      }

      dispatch(loginUser(updatedJson?.user));
      setLoading(false);
      router.push("/dashboard");

    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        setErrorMessage(error.response.data?.message);
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
