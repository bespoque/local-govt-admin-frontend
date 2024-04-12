import { useForm, FormProvider } from "react-hook-form";
import { InputWrapper } from "components/react-hook-form/input-wrapper";
import { Label } from "components/react-hook-form/label";
import { ErrorMessage } from "components/react-hook-form/error-message";
import { Input } from "components/react-hook-form/input";
import { Select } from "antd";
import { useState } from "react";
import { createUser } from "slices/actions/userActions";
import { useDispatch } from "react-redux";
import { addUser } from "slices/users";
import { toast } from "react-toastify";
import { useTaxOffices } from "hooks/useTaxOffices";
import { useRoles } from "hooks/useRoles";
import { ITaxOffice } from "components/tax-office/tax-office.interface";
import { IRole } from "components/user/user.interface";
import { ThreeDots } from "react-loader-spinner";
import { handleApiError } from "helpers/errors";
import { RootState, useAppSelector } from "store";

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
              <Label id="first-name">First name</Label>
              <Input
                id="first-name"
                name="firstName"
                type="text"
                rules={{ required: "First name is required" }}
              />
            </InputWrapper>
            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="middle-name">Middle name</Label>
              <Input id="middle-name" name="middleName" type="text" />
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="last-name">Last name</Label>
              <Input
                id="last-name"
                name="lastName"
                type="text"
                rules={{ required: "Last name is required" }}
              />
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                rules={{ required: "Please enter a valid email" }}
              />
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="text"
                rules={{ required: "Phone is required" }}
              />
            </InputWrapper>
            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="phone">Select Tax office</Label>
              <Select
              dropdownClassName="appearance-none border rounded w-full py-3 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                style={{ width: "350px" }}>
                <Option>
                  Kogi
                </Option>
                <Option>
                  Kogi
                </Option>
                <Option>
                  Kogi
                </Option>

              </Select>
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="language">Select User Roles</Label>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select options"
                dropdownStyle={{ maxHeight: "150px", overflowY: "auto" }}>

                <Option>
                  SUPER_ADMIN
                </Option>
                <Option>
                  ADMIN
                </Option>
                <Option>
                  ASSESSMENT
                </Option>
                <Option>
                  IDENTITY_MANAGEMENT
                </Option>
                <Option>
                  REVENUE_CHART
                </Option>
                <Option>
                  COLLECTIONS
                </Option>
                <Option>
                  REPORTS
                </Option>
              </Select>
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="phone">Status</Label>
              <Select
                style={{ width: "350px" }}>

                <Option>
                  ACTIVE
                </Option>
        
              </Select>
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
