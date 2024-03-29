import {useForm, FormProvider} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {ErrorMessage} from "components/react-hook-form/error-message";
import {Input} from "components/react-hook-form/input";
import {Select} from "antd";
import {useState} from "react";
import {createUser} from "slices/actions/userActions";
import {useDispatch} from "react-redux";
import {addUser} from "slices/users";
import {toast} from "react-toastify";
import {useTaxOffices} from "hooks/useTaxOffices";
import {useRoles} from "hooks/useRoles";
import {ITaxOffice} from "components/tax-office/tax-office.interface";
import {IRole} from "components/user/user.interface";
import {ThreeDots} from "react-loader-spinner";
import {handleApiError} from "helpers/errors";
import {RootState, useAppSelector} from "store";

const {Option} = Select;

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

const Index: React.FC<IAddUserFormProps> = ({closeModal}) => {
  const methods = useForm<FormProps>({});
  const dispatch = useDispatch();
  const userData = useAppSelector((state: RootState) => state.auth);
  const {taxOffices, loading: taxOfficeLoading} = useTaxOffices();
  const {userRoles, loading: rolesLoading} = useRoles();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedOption, setSelectedOption] = useState<any>(
    taxOffices[0]?.value
  );
  const handleChange = (values) => {
    setSelectedValues(values);
  };

  const {
    handleSubmit,
    reset,
    formState: {errors},
  } = methods;

  const onSubmit = async (payload: FormProps) => {
    try {
      setLoading(true);
      payload.roles = selectedValues;
      payload.taxOffice = selectedOption;
      const {data} = await createUser(payload);
      toast.success("User created successfully!");
      dispatch(addUser(data));
      closeModal();
    } catch (error) {
      handleApiError(error, userData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12">
            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="first-name">First name</Label>
              <Input
                id="first-name"
                name="firstName"
                type="text"
                rules={{required: "First name is required"}}
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
                rules={{required: "Last name is required"}}
              />
              {errors?.lastName?.message && (
                <ErrorMessage>{errors.lastName.message}</ErrorMessage>
              )}
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                rules={{required: "Please enter a valid email"}}
              />
              {errors?.email?.message && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="text"
                rules={{required: "Phone is required"}}
              />
              {errors?.phone?.message && (
                <ErrorMessage>{errors.phone.message}</ErrorMessage>
              )}
            </InputWrapper>
            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="phone">Select Tax office</Label>
              <Select
                onChange={(val) => setSelectedOption(val)}
                defaultValue={taxOffices[0]?.value}
                style={{width: "350px"}}>
                {taxOffices?.map((option) => (
                  <Option key={option.id} value={option.name}>
                    {option.value}
                  </Option>
                ))}
              </Select>
            </InputWrapper>

            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="language">Select User Roles</Label>
              <Select
                mode="multiple"
                style={{width: "100%"}}
                placeholder="Select options"
                value={selectedValues}
                onChange={handleChange}
                dropdownStyle={{maxHeight: "150px", overflowY: "auto"}}>
                {userRoles?.map((option) => (
                  <Option key={option.id} value={option.role}>
                    {option.role}
                  </Option>
                ))}
              </Select>
            </InputWrapper>
          </div>
        </div>

        <div className="flex justify-start space-x-2">
          <button
            onClick={() => {
              reset();
              closeModal();
            }}
            type="button"
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancel
          </button>
          <button
            type="submit"
            className={`inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading || taxOfficeLoading || rolesLoading
                ? "disabled:opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={loading || taxOfficeLoading || rolesLoading}>
            {loading ? (
              <ThreeDots
                height="30"
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
