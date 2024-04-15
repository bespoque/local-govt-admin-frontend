import {useForm, FormProvider} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {ErrorMessage} from "components/react-hook-form/error-message";
import {Input} from "components/react-hook-form/input";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {authenticate} from "slices/actions/authActions";
import {useState} from "react";
import {loginUser} from "slices/auth";
import { ThreeDots } from "react-loader-spinner";
import { IRole } from "components/user/user.interface";

export type FormProps = {
  username: string;
  password: string;
};

interface Data {
  user: { [key: string]: any }[];
  taxOffice: { [key: string]: any }[];
  roles: IRole[];
  status: string;
  message: string;
  token: string;
  redirect: string;
}

const Index: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const methods = useForm<FormProps>({
    defaultValues: {
      username: "johnmary@lga.com",
      password: "123456",
      // "email": "super.user5@gmail.com",
      // "password": "Test1234$"
    },
  });
  const {
    handleSubmit,
    formState: {errors},
  } = methods;

  const onSubmit = async (data: FormProps) => {
    try {
      setErrorMessage(null);
      setLoading(true);
      const response = await authenticate(data);
      if (response.data.token) {
        localStorage.setItem("access_token", response.data.token);
        // localStorage.setItem("access_token", response.data.accessToken);
      }
      console.log("response data", response.data);

      
      const addActiveProperty = (jsonData: Data): string => {
        // Loop through roles array and add "active" property with value true to each role object
        jsonData.roles.forEach(role => role.active = true);

        // Convert back to JSON and return
        return JSON.stringify(jsonData);
        
      }
      const tesd = addActiveProperty(response.data)
      const parsedData: Data = JSON.parse(tesd);
      console.log("parsedData", parsedData);
      
    
      let userDataAPI = parsedData.user[0];
      const taxOfficeDataAPI = parsedData.taxOffice[0];
      const rolesDataAPI = parsedData.roles;

      // Deleting the user key from the originalJson
      delete parsedData.user;
      delete parsedData.taxOffice;
      delete parsedData.roles;

      userDataAPI.taxOffice = taxOfficeDataAPI
      userDataAPI.roles = rolesDataAPI

      // Creating a new object with user data at the top level
      const rearrangedJson = Object.assign({ user: userDataAPI }, parsedData);

      console.log("rearrangedJson", rearrangedJson);
      console.log("userOnly", rearrangedJson.user);
      
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
          // {
          //   "role": "ADMIN",
          //   "permissions": [
          //     "all"
          //   ],
          //   "active": false
          // },
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

      

      dispatch(loginUser(rearrangedJson.user));
      
      // dispatch(loginUser(response.data.user));
      setLoading(false);
      // if (!response.data.user.onboarding_complete) {
      //   router.push("/user-profile");
      // } else {
      //   router.push("/dashboard");
      // }
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
                rules={{required: "Please enter a valid email"}}
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
            className={`py-3.5 bg-cyan-950 rounded shadow justify-center items-center gap-2.5 inline-flex text-sm font-medium text-white border border-transparent shadow-sm rounded-md w-full ${
              loading ? "opacity-60 cursor-not-allowed" : "opacity-100"
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
