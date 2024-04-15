import { useForm, FormProvider } from "react-hook-form";
import { InputWrapper } from "components/react-hook-form/input-wrapper";
import { Label } from "components/react-hook-form/label";
import { Input } from "components/react-hook-form/input";
import { Select } from "antd";
import { ITaxOffice } from "components/tax-office/tax-office.interface";
import { IRole } from "components/user/user.interface";

const { Option } = Select;

export type FormProps = {
  firstName: string;
  lastName: string;
  email: string;
  middleName?: string;
  phone: string;
  roles?: IRole[];
  taxOffice?: ITaxOffice;
};

interface IAddUserFormProps {
  closeModal: () => void;
}

const Index: React.FC<IAddUserFormProps> = ({ closeModal }) => {
  const methods = useForm<FormProps>({});


  return (
    <FormProvider {...methods}>
      <form className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12">
            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="first-name">full name</Label>
              <div className="relative">
                <img src="/images/icons/user.png" alt="First Name" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  type="text"
                  name="lastName"
                  className="appearance-none border rounded w-full py-3 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="email">Email</Label>
              <div className="relative">
                <img src="/images/icons/mail.png" alt="First Name" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  type="text"
                  name="firstName"
                  className="appearance-none border rounded w-full py-3 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="phone">Phone Number</Label>
              <div className="relative">
                <img src="/images/icons/mobile.png" alt="First Name" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  type="text"
                  name="firstName"
                  className="appearance-none border rounded w-full py-3 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="phone">Local Government</Label>
              <div className="relative">
                <img src="/images/icons/location.png" alt="First Name" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />

                <select name="" className="appearance-none border text-center rounded w-full py-3 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">
                    Kogi
                  </option>
                  <option value="">
                    Kogi
                  </option>
                  <option value="">
                    Kogi
                  </option>
                </select>
              </div>
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="language">Select User Roles</Label>
              <div className="relative">
                <img src="/images/icons/users.png" alt="First Name" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />

                <select className="appearance-none border text-center  rounded w-full py-3 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">
                    SUPER_ADMIN
                  </option>
                  <option value="">
                    ADMIN
                  </option>
                  <option value="">
                    ASSESSMENT
                  </option>
                  <option value="">
                    IDENTITY_MANAGEMENT
                  </option>
                  <option value="">
                    IDENTITY_MANAGEMENT_AGENT
                  </option>
                  <option value="">
                    REVENUE_CHART
                  </option>
                  <option value="">
                    COLLECTIONS
                  </option>
                  <option value="">
                    REPORTS
                  </option>
                </select>

              </div>
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="phone">Status</Label>
              <div className="relative">
                <img src="/images/icons/mail.png" alt="First Name" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <select className="appearance-none border text-center rounded w-full py-3 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">
                    ACTIVE
                  </option>
                </select>
              </div>
              {/* <Select
                style={{ width: "350px" }}>

                <Option>
                  ACTIVE
                </Option>

              </Select> */}
            </InputWrapper>
          </div>
        </div>

        {/* <div className="flex justify-start space-x-2">
          <button
            onClick={() => {
              closeModal();
            }}
            type="button"
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"       >

            Submit
          </button>
        </div> */}
      </form>
    </FormProvider>
  );
};
export default Index;
