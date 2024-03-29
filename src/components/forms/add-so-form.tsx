import {useForm, FormProvider, Controller} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {Select} from "antd";
import {useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {RootState, useAppSelector} from "store";
import {toast} from "react-toastify";
import {ThreeDots} from "react-loader-spinner";
import {handleApiError} from "helpers/errors";
import {useTaxOffices} from "hooks/useTaxOffices";
import {useMyStock} from "hooks/useMyStock";
import {addStockOut} from "slices/stockOut";
import {createStockOut} from "slices/actions/stockOutActions";
import StockOutSummary from "components/stock-out/stock-out-summary";
const {Option} = Select;

type FormProps = {
  toLocation: string;
  items: number[];
};

interface IAddStockOutFormProps {
  closeModal: () => void;
}

const Index: React.FC<IAddStockOutFormProps> = ({closeModal}) => {
  const methods = useForm<FormProps>({});
  const dispatch = useDispatch();
  const [inventoryItem, setInventoryItem] = useState<number[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>();
  const [loading, setLoading] = useState(false);
  const userData = useAppSelector((state: RootState) => state.auth);
  const {taxOffices, loading: taxOfficeLoading} = useTaxOffices();
  const {stockList, loading: stockLoading} = useMyStock();

  const handleChange = (values) => {
    setInventoryItem(values);
  };
  const handleLocationChange = (value) => {
    setSelectedLocation(value);
  };

  const {
    handleSubmit,
    reset,
    formState: {errors},
  } = methods;

  const onSubmit = async (data: FormProps) => {
    try {
      setLoading(true);
      const response = await createStockOut(data);
      toast.success("StockOut created successfully!");
      dispatch(addStockOut(response.data));
      closeModal();
    } catch (error) {
      handleApiError(error, userData);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = useMemo(
    () =>
      loading ||
      taxOfficeLoading ||
      stockLoading ||
      !selectedLocation ||
      !inventoryItem.length,
    [
      inventoryItem.length,
      loading,
      selectedLocation,
      stockLoading,
      taxOfficeLoading,
    ]
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12">
            <InputWrapper outerClassName="sm:col-span-4">
              <Label>Select Inventory Items to Send</Label>
              <Controller
                name="items"
                control={methods.control}
                defaultValue={inventoryItem}
                render={({field}) => (
                  <Select
                    mode="multiple"
                    onChange={(value) => {
                      handleChange(value);
                      field.onChange(value);
                    }}
                    value={field.value}
                    dropdownStyle={{maxHeight: "150px", overflowY: "auto"}}
                    style={{width: "100%"}}>
                    {stockList?.map((option) => {
                      return (
                        <Option key={option.id} value={option.id}>
                          {option.itemTypeId.itemType}: {option.uniqueId}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              />
            </InputWrapper>
            <InputWrapper outerClassName="sm:col-span-4">
              <Label>Destination</Label>
              <Controller
                name="toLocation"
                control={methods.control}
                defaultValue={selectedLocation}
                render={({field}) => (
                  <Select
                    onChange={(value) => {
                      handleLocationChange(value);
                      field.onChange(value);
                    }}
                    value={field.value}
                    dropdownStyle={{maxHeight: "150px", overflowY: "auto"}}
                    style={{width: "100%"}}>
                    {taxOffices?.map((option) => {
                      return (
                        <Option key={option.id} value={option.name}>
                          {option.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              />
            </InputWrapper>
          </div>
        </div>
        <div className="flex">
          <h3 className="font-medium">Summary</h3>
        </div>

        <StockOutSummary inventoryItems={inventoryItem} stockList={stockList} />

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
              isDisabled ? "disabled:opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isDisabled}>
            {loading || taxOfficeLoading || stockLoading ? (
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
