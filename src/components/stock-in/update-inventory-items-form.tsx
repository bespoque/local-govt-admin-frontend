import React, {useState} from "react";
import {useForm, FormProvider} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {ThreeDots} from "react-loader-spinner";
import {updateInventoryItem} from "slices/actions/inventoryItemActions";
import {toast} from "react-toastify";
import {handleApiError} from "helpers/errors";
import {RootState, useAppSelector} from "store";
import {IStockIn} from "components/stock-in/stock-in.interfaces";

interface IEditPurchaseOrderFormProps {
  closeModal: () => void;
  stockIn?: IStockIn;
  updateStockInState: (stockIn: IStockIn) => void;
}

const Index: React.FC<IEditPurchaseOrderFormProps> = ({
  closeModal,
  stockIn,
  updateStockInState,
}) => {
  const methods = useForm();
  const [loadingItems, setLoadingItems] = useState<number[]>([]);
  const userData = useAppSelector((state: RootState) => state.auth);

  const {
    handleSubmit,
    reset,
    formState: {errors},
    register,
  } = methods;

  const onSubmit = async (uniqueId: any, itemId: number) => {
    try {
      setLoadingItems((prevLoadingItems) => [...prevLoadingItems, itemId]);
      const {data} = await updateInventoryItem(uniqueId, itemId);

      const updateItems = stockIn.itemsReceived.map((item) =>
        item.id === data.id ? data : item
      );

      const updateStockIn: IStockIn = {...stockIn, itemsReceived: updateItems};
      updateStockInState(updateStockIn);

      setLoadingItems((prevLoadingItems) =>
        prevLoadingItems.filter((id) => id !== itemId)
      );
      toast.success("Item updated successfully");
    } catch (error) {
      handleApiError(error, userData);
      setLoadingItems((prevLoadingItems) =>
        prevLoadingItems.filter((id) => id !== itemId)
      );
    }
  };

  const isItemLoading = (itemId: number) => loadingItems.includes(itemId);

  return (
    <FormProvider {...methods}>
      <form className="space-y-4 p-4 h-auto overflow-auto">
        <div className="space-y-2">
          {stockIn?.itemsReceived?.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12">
                <InputWrapper outerClassName="sm:col-span-3">
                  <Label id={`name-${item.id}`}>Item Name</Label>
                  <Label id={`name-val-${item.id}`}>
                    {item?.itemTypeId.itemType}
                  </Label>
                </InputWrapper>
                <InputWrapper outerClassName="sm:col-span-3">
                  <Label id={`description-${item.id}`}>Description</Label>
                  <Label id={`description-val-${item.id}`}>
                    {item?.itemTypeId?.description?.slice(0, 20)}...
                  </Label>
                </InputWrapper>
                <InputWrapper outerClassName="sm:col-span-3">
                  <Label id={`uniqueId-${item.id}`}>Unique ID</Label>
                  <input
                    className="border rounded-sm p-1"
                    {...register(`${item.id}`)}
                    type="text"
                    defaultValue={item?.uniqueId}
                  />
                </InputWrapper>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleSubmit((data) =>
                      isItemLoading(item.id)
                        ? undefined
                        : data && onSubmit(data[item.id], item.id)
                    )}
                    className={`inline-flex justify-center px-3 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    disabled={isItemLoading(item.id)}>
                    {isItemLoading(item.id) ? (
                      <ThreeDots
                        height="20"
                        width="20"
                        radius="3"
                        color="white"
                      />
                    ) : (
                      `${item.uniqueId ? "Update" : "Submit"}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-start space-x-2">
          <button
            onClick={() => {
              reset();
              closeModal();
            }}
            type="button"
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Close
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default Index;
