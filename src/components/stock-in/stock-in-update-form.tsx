import React, {useMemo, useState, useEffect} from "react";
import {useForm, FormProvider, Controller} from "react-hook-form";
import {DatePicker, Select} from "antd";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {Input} from "components/react-hook-form/input";
import {ThreeDots} from "react-loader-spinner";
import {toast} from "react-toastify";
import {IInventoryItem} from "components/inventory-item/inventory-item.interface";
import {IStockIn} from "./stock-in.interfaces";
import {updateStockIn} from "slices/actions/stockInActions";
import {handleApiError} from "helpers/errors";
import {RootState, useAppSelector} from "store";
import dayjs from "dayjs";
import moment from "moment";
const {Option} = Select;

type FormProps = {
  itemsReceived: number[];
  receivedAt: string;
  remarks: string;
};

interface IEditStockInFormProps {
  closeModal: () => void;
  stockIn: IStockIn;
  updateStockInState: (stockIn: IStockIn) => void;
}

export const UpdateStockInForm: React.FC<IEditStockInFormProps> = ({
  closeModal,
  stockIn,
  updateStockInState,
}) => {
  const methods = useForm<FormProps>({});
  const [inventoryItems, setInventoryItems] = useState<number[]>(
    stockIn?.itemsReceived.map((inventoryItem) => inventoryItem.id) || []
  );
  const [receivedAt, setReceivedAt] = useState(
    stockIn?.receivedAt ? dayjs(stockIn.receivedAt) : dayjs()
  );
  const [remarks, setRemarks] = useState<string>(stockIn?.remarks || "");
  const [loading, setLoading] = useState<boolean>(false);
  const userData = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    setInventoryItems(
      stockIn?.itemsReceived.map((inventoryItem) => inventoryItem.id) || []
    );
    setReceivedAt(stockIn?.receivedAt ? dayjs(stockIn.receivedAt) : dayjs());
    setRemarks(stockIn?.remarks || "");
  }, [stockIn]);

  const isDisabled = useMemo(
    () => loading || !inventoryItems.length,
    [inventoryItems, loading]
  );

  if (!stockIn || !closeModal || !updateStockInState) return null;

  const {
    handleSubmit,
    reset,
    formState: {errors},
    control,
  } = methods;
  const onSubmit = async (payload: FormProps) => {
    try {
      setLoading(true);

      const updatedPayload = {
        itemsReceived: payload.itemsReceived,
        receivedAt: payload.receivedAt,
        remarks: payload.remarks,
        transferType: "STOCK_OUT",
      };

      if (
        payload.itemsReceived.every((item) =>
          stockIn.itemsReceived.map((i) => i.id).includes(item)
        ) &&
        stockIn.itemsReceived.every((item) =>
          payload.itemsReceived.includes(item.id)
        )
      ) {
        delete updatedPayload.itemsReceived;
      }

      if (moment(payload.receivedAt).isSame(stockIn.receivedAt?.toString())) {
        delete updatedPayload.receivedAt;
      }

      if (payload.remarks === stockIn.remarks) {
        delete updatedPayload.remarks;
      }
      if (Object.keys(updatedPayload).length > 1) {
        const {data} = await updateStockIn(
          stockIn.stockInOrderId,
          updatedPayload
        );
        updateStockInState(data);
        toast.success("Stock In updated successfully!");
      }

      closeModal();
    } catch (error) {
      handleApiError(
        error.message,
        userData,
        "There was an error updating the Stock In"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeInventoryItems = (values: number[]) => {
    setInventoryItems(values);
  };
  const undeliveredItems = () => {
    stockIn.stockOut?.inventoryItems?.filter(
      (item) => item.locked || item.sold
    );
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12">
            <InputWrapper outerClassName="sm:col-span-4">
              <Label>Inventory Items Received</Label>
              <Controller
                name="itemsReceived"
                control={control}
                defaultValue={inventoryItems}
                render={({field}) => (
                  <Select
                    mode="multiple"
                    onChange={(value) => {
                      handleChangeInventoryItems(value);
                      field.onChange(value);
                    }}
                    value={field.value}
                    dropdownStyle={{maxHeight: "150px", overflowY: "auto"}}
                    style={{width: "100%"}}>
                    {stockIn.stockOut?.inventoryItems?.map(
                      (option: IInventoryItem) => {
                        return (
                          option.locked && (
                            <Option key={option.id} value={option.id}>
                              {`${option?.itemTypeId?.itemType}: ${option.uniqueId}`}
                            </Option>
                          )
                        );
                      }
                    )}
                  </Select>
                )}
              />
            </InputWrapper>
            <InputWrapper outerClassName="sm:col-span-4">
              <Label id="receivedAt">Received At</Label>
              <DatePicker
                name="receivedAt"
                value={receivedAt}
                style={{width: "200px", height: "38px"}}
                onChange={(val) => setReceivedAt(val)}
              />
            </InputWrapper>
            <InputWrapper outerClassName="sm:col-span-4">
              <Controller
                name="remarks"
                control={control}
                defaultValue={remarks}
                render={({field}) => (
                  <>
                    <Label id="remarks">remarks</Label>
                    <Input id="remarks" name="remarks" type="text" {...field} />
                  </>
                )}
              />
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
              isDisabled ? "disabled:opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isDisabled}>
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
