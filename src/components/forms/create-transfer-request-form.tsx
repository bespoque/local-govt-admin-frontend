import {useForm, FormProvider} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {Input} from "components/react-hook-form/input";
import {Select, InputNumber} from "antd";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {RootState, useAppSelector} from "store";
import {toast} from "react-toastify";
import {ThreeDots} from "react-loader-spinner";
import {handleApiError} from "helpers/errors";
import {DeleteOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {fetchInventoryItems} from "slices/actions/inventoryItemActions";
import {groupAndAggregateItems} from "functions/utils";
import {useFetchData} from "hooks/useFetcher";
import {ITaxOffice} from "components/tax-office/tax-office.interface";
import {createStockOutRequest} from "slices/actions/stockOutActions";
import {mutate} from "swr";
import {appendQueryParams} from "helpers/appendQueryParams";
const {Option} = Select;

export type FormProps = {
  fromLocation: string;
  descriptions: string;
  items?: [{itemId: string; quantity: string}];
};

interface IAddUserFormProps {
  closeModal: () => void;
}

const FormSection = ({
  sectionIndex,
  onRemove,
  inventoryItems,
  handleFormSectionChange,
  selectedItems,
  itemsLoading,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(
    selectedItems[sectionIndex]?.itemId || ""
  );
  const [maxQuantity, setMaxQuantity] = useState(1);
  const [quantity, setQuantity] = useState(
    selectedItems[sectionIndex]?.quantity || 1
  );
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedItemDescription, setSelectedItemDescription] = useState(
    selectedItems[sectionIndex]?.description
  );

  const handleProductChange = (val) => {
    setSelectedProduct(val);

    handleFormSectionChange(sectionIndex, val, 1);
  };

  const handleQuantityChange = (val) => {
    setQuantity(val);
    handleFormSectionChange(sectionIndex, selectedProduct, val);
  };

  useEffect(() => {
    const currentItem = inventoryItems.filter(
      (inv) => inv.name === selectedProduct
    );
    setCurrentItem(currentItem[0]);
  }, []);

  return (
    <div className="flex items-center mb-2">
      <InputWrapper outerClassName="sm:col-span-4 mr-5">
        <Label id="phone">Select Inventory Item</Label>
        <Select
          loading={itemsLoading}
          onChange={handleProductChange}
          defaultValue={selectedProduct}
          style={{width: "200px"}}>
          {inventoryItems
            .filter(
              (option) =>
                !selectedItems.some(
                  (item) => item.itemId === option.itemTypeId.itemType
                )
            )
            .map((option) => (
              <Option key={option.id} value={option.itemTypeId.itemType}>
                {option.itemType}
              </Option>
            ))}
        </Select>
      </InputWrapper>
      <InputWrapper outerClassName="sm:col-span-6 mr-4">
        <Label id={`Quantity-${sectionIndex}`}>Quantity</Label>
        <InputNumber
          min={1}
          max={currentItem?.quantity}
          defaultValue={quantity}
          onChange={handleQuantityChange}
        />
      </InputWrapper>
      <InputWrapper outerClassName="sm:col-span-6 w-full">
        <Label id="phone">Item Description</Label>
        <div>
          {currentItem?.itemTypeId?.description?.length > 40
            ? `${currentItem?.itemTypeId?.description?.substr(0, 40)}...`
            : currentItem?.itemTypeId?.description}
        </div>
      </InputWrapper>
      <DeleteOutlined
        style={{color: "red"}}
        onClick={() => onRemove(sectionIndex)}
      />
    </div>
  );
};

const Index: React.FC<IAddUserFormProps> = ({closeModal}) => {
  const defaultValues = [
    {
      itemId: "",
      quantity: 1,
    },
  ];

  const addSection = () => {
    setFormSectionValues((prevFormSectionValues) => [
      ...prevFormSectionValues,
      defaultValues[0],
    ]);
  };

  const removeSection = (indexToRemove) => {
    if (formSectionValues.length === 1) {
      return; // Don't remove the last section
    }

    setFormSectionValues((prevFormSectionValues) =>
      prevFormSectionValues.filter((_, idx) => idx !== indexToRemove)
    );
  };

  const methods = useForm<FormProps>({});
  const dispatch = useDispatch();

  const [inventoryItems, setInventoryItems] = useState([]);

  const [formSectionValues, setFormSectionValues] =
    useState<Array<any>>(defaultValues);

  const [loading, setLoading] = useState(false);
  const [inventoryItemsLoading, setInventoryItemsLoading] = useState(false);
  const {data: taxOffices, isLoading: taxOfficeLoading} =
    useFetchData<ITaxOffice[]>("/users/taxOffices");
  const userData = useAppSelector((state: RootState) => state.auth);

  const [selectedOption, setSelectedOption] = useState<any>(null);

  const {
    handleSubmit,
    reset,
    formState: {errors},
  } = methods;

  const mapFormSectionValuesToIds = (formSectionValues, inventoryItems) => {
    return formSectionValues.map((item) => {
      const correspondingInventoryItem = inventoryItems.find(
        (inventoryItem) => inventoryItem.itemTypeId.itemType === item.itemId
      );

      if (correspondingInventoryItem) {
        return {
          ...item,
          itemId: correspondingInventoryItem.itemTypeId.id,
        };
      }

      return item;
    });
  };

  const onSubmit = async (data: FormProps) => {
    data.items = mapFormSectionValuesToIds(formSectionValues, inventoryItems);
    data.fromLocation = selectedOption;
    setLoading(true);
    try {
      await createStockOutRequest(data);
      setLoading(false);
      const url = appendQueryParams("stock-out-requests", {
        requestBy: userData.taxOffice.name,
      });
      mutate(url);
      toast.success("Transfer Request created successfully!");
      closeModal();
    } catch (error) {
      setLoading(false);
      handleApiError(error, userData);
    }
  };

  const handleFormSectionChange = (index, newProductId, newQuantity) => {
    setFormSectionValues((prevFormSectionValues) => {
      const updatedFormSectionValues = prevFormSectionValues.map((item, idx) =>
        idx === index
          ? {
              ...item,
              itemId: newProductId,
              quantity: newQuantity,
            }
          : item
      );

      return updatedFormSectionValues;
    });
  };

  const handleTaxOfficeChange = async (taxOffice) => {
    setFormSectionValues(defaultValues);
    setSelectedOption(taxOffice);
    try {
      setInventoryItemsLoading(true);
      const {data} = await fetchInventoryItems({
        location: taxOffice,
        locked: false,
        sold: false,
      });

      const grouped = groupAndAggregateItems(data);
      setInventoryItems(grouped);
      setInventoryItemsLoading(false);
    } catch (error) {
      setInventoryItemsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12 ">
            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="phone">Select Tax office</Label>
              <Select
                loading={taxOfficeLoading}
                onChange={handleTaxOfficeChange}
                style={{width: "300px"}}>
                {taxOffices?.map((option) => (
                  <Option key={option.id} value={option.name}>
                    {option.value}
                  </Option>
                ))}
              </Select>
            </InputWrapper>
            <InputWrapper outerClassName="sm:col-span-6">
              <Label id="description">Description</Label>
              <Input id="description" name="description" type="text" />
            </InputWrapper>
          </div>

          <div>
            {formSectionValues.map(({itemId}, index) => (
              <FormSection
                handleFormSectionChange={handleFormSectionChange}
                inventoryItems={inventoryItems}
                key={itemId}
                sectionIndex={index}
                onRemove={() => removeSection(index)}
                selectedItems={formSectionValues}
                itemsLoading={inventoryItemsLoading}
              />
            ))}
          </div>
          <div className="flex justify-end">
            <PlusCircleOutlined onClick={addSection} />
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
              loading || taxOfficeLoading || inventoryItemsLoading
                ? "disabled:opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={loading}>
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
