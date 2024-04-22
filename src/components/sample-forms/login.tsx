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
      password: "test123",
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
      console.log("response data", response.data);



      const userData = {
        "id": 44,
        "userSlug": "48474514_kennedy_user",
        "email": "super.user5@gmail.com",
        "firstName": "kennedy",
        "middleName": "benson",
        "lastName": "user",
        "phone": "08000000005",
        "last_login": "2024-04-02T16:50:23.000Z",
        "onboarding_complete": true,
        "account_status": "ACTIVE",
        "createdBy": null,
        "createdAt": "2023-08-23T15:40:27.608Z",
        "roles": [
          {
            "role": "SUPER_ADMIN",
            "permissions": [
              "all"
            ],
            "active": true
          },
          {
            "role": "ASSESSMENT",
            "roleId": "7",
            "permissions": [
              "create",
              "edit",
              "view",
              "delete",
              "print"
            ],
            "active": true
          },
          {
            "role": "IDENTITY_MANAGEMENT",
            "roleId": "11",
            "permissions": [
              "create",
              "view",
              "edit",
              "print"
            ],
            "active": true
          },
          {
            "role": "REVENUE_CHART",
            "roleId": "12",
            "permissions": [
              "view",
              "print"
            ],
            "active": true
          },
          {
            "role": "COLLECTIONS",
            "roleId": "14",
            "permissions": [
              "view",
              "print"
            ],
            "active": true
          },
          {
            "role": "REPORTS",
            "roleId": "17",
            "permissions": [
              "view",
              "print"
            ],
            "active": true
          }
        ],
        "taxOffice": {
          "id": 12,
          "name": "STORE",
          "value": "Store"
        }
      }

      const origJson = {
        "user": [
          {
            "id": "1",
            "name": "John Mary",
            "email": "johnmary@lga.com",
            "usergroup": "1",
            "phone": "08037379863",
            "dept": "IT",
            "designation": "Developer"
          }
        ],
        "taxOffice": [
          {
            "id": "1",
            "taxOffice": "DEFAULT",
            "adminuser": "johnmary@lga.com",
            "add1": "Lokoja",
            "add2": null,
            "phone": "090999934",
            "email": "info@bespoque.ng",
            "primarycolor": "#000000",
            "logourl": "https://irs.kg.gov.ng/wp-content/uploads/2018/05/KGIRS-logo-txt-2.png"
          }
        ],
        "permissions": [
          "user_login",
          "user_password",
          "group_create",
          "group_permission_add",
          "group_permission_remove",
          "group_permission_list",
          "user_new",
          "user_list",
          "user_view",
          "user_update",
          "collection_view",
          "identity_indv_list",
          "identity_corp_list",
          "identity_agent_list"
        ],
        "status": "200",
        "message": "OKAY",
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MTM2OTkwMTksIm5iZiI6MTcxMzY5OTAxOSwiZXhwIjoxNzEzNzAyNjE5LCJkYXRhIjp7InVzZXJfaWQiOiIxIiwiY2xpZW50aWQiOiIxIiwidXNlcl9lbWFpbCI6ImpvaG5tYXJ5QGxnYS5jb20ifX0.FQWVGuQPpXG_EAlxZCgTWuRdEGwAOR_QPlo0CcGk2-I",
        "redirect": "false"
      };

      // Transforming permissions array to roles array
      const updatedUser = origJson.user[0];
      const updatedJson = {
        "user": {
          ...updatedUser,
          "roles": origJson.permissions.map((permission, index) => ({
            "roleId": index + 1,
            "role": permission,
            "permissions": ["all"],
            "active": true
          })),
          "taxOffice": origJson.taxOffice[0]
        },
        "status": origJson.status,
        "message": origJson.message,
        "token": origJson.token,
        "redirect": origJson.redirect
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
