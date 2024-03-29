import {useForm, FormProvider} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {ErrorMessage} from "components/react-hook-form/error-message";
import {Input} from "components/react-hook-form/input";
import {Select} from "antd";
import {useState} from "react";
import {updateUser} from "slices/actions/userActions";
import {useDispatch} from "react-redux";
import {addUser} from "slices/users";
import {FormProps} from "./add-user-form";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import {useTaxOffices} from "hooks/useTaxOffices";
import {IUser} from "components/user/user.interface";
import {handleApiError} from "helpers/errors";
import {ThreeDots} from "react-loader-spinner";

const {Option} = Select;

const Index: React.FC<{user?: IUser; closeModal: () => void}> = ({
  user,
  closeModal,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {taxOffices, loading: isLoadingTaxOffices} = useTaxOffices();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<any>(
    user?.taxOffice?.name
  );
  const [selectedValues, setSelectedValues] = useState(
    user?.roles?.filter((usr: any) => usr.active).map((usr: any) => usr.role)
  );
  const [userInfo, setUser] = useState(user);

  const methods = useForm<FormProps>({
    defaultValues: user,
  });
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
      const {data} = await updateUser(user.userSlug, payload);
      toast.success("User updated successfully!");
      dispatch(addUser(data.updatedUser));
      router.push(`/users/${data.updatedUser.userSlug}`);
      closeModal();
    } catch (error) {
      handleApiError(error, userInfo);
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
              <Label id="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="number"
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
                defaultValue={selectedOption}
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
                style={{width: "100%", maxHeight: "100px", overflowY: "auto"}}
                placeholder="Select options"
                value={selectedValues}
                onChange={handleChange}
                dropdownStyle={{maxHeight: "150px", overflowY: "auto"}}>
                {userInfo.roles.map((option: any, key) => (
                  <Option key={key} value={option.role}>
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
              loading || isLoadingTaxOffices
                ? "disabled:opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={loading || isLoadingTaxOffices}>
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
