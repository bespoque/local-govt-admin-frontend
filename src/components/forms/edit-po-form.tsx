import {useForm, FormProvider} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {ErrorMessage} from "components/react-hook-form/error-message";
import {Input} from "components/react-hook-form/input";
import {Select, InputNumber, DatePicker} from "antd";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useSelector} from "react-redux";
import {RootState} from "store";
import {toast} from "react-toastify";
import {fetchVendors} from "slices/actions/vendorActions";
import {updatePurchasingOrder} from "slices/actions/procurementActions";
import {loadVendors} from "slices/vendor";
import {calculateFormSectionSumTotal, deepCompare} from "functions/utils";
import dayjs from "dayjs";
import {ThreeDots} from "react-loader-spinner";
import {DeleteOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {IProcurement} from "components/procurement/procurement.interface";
const {Option} = Select;

export type FormProps = {
  expectedDate: string;
  vendorSlug: string;
  description: string;
  items?: [{itemId: string; quantity: string}];
};

interface IEditPurchaseOrderFormProps {
  closeModal: () => void;
  order: IProcurement;
  items: any;
  setPo: any;
}

const FormSection = ({
  sectionIndex,
  onRemove,
  inventoryItems,
  handleFormSectionChange,
  selectedItems,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(
    selectedItems[sectionIndex]?.itemId || ""
  );

  const [quantity, setQuantity] = useState(
    selectedItems[sectionIndex]?.quantity || 1
  );
  const [totalPrice, setTotalPrice] = useState(
    selectedItems[sectionIndex]?.price || 0
  );

  const calculateSelectedProductPrice = (productId) => {
    const selectedProductInfo = inventoryItems?.find(
      (item) => item.itemType === productId
    );
    return selectedProductInfo ? parseFloat(selectedProductInfo.price) : 0;
  };

  const handleProductChange = (val) => {
    setSelectedProduct(val);
    const newSelectedProductPrice = calculateSelectedProductPrice(val);
    setQuantity(1);
    setTotalPrice(newSelectedProductPrice * 1);
    handleFormSectionChange(sectionIndex, val, 1, newSelectedProductPrice);
  };

  const handleQuantityChange = (val) => {
    const newTotalPrice = selectedProductPrice * val;
    setQuantity(val);
    setTotalPrice(newTotalPrice);
    handleFormSectionChange(sectionIndex, selectedProduct, val, newTotalPrice);
  };

  const selectedProductPrice = calculateSelectedProductPrice(selectedProduct);

  return (
    <div className="flex justify-between items-center mb-2">
      <InputWrapper outerClassName="sm:col-span-6">
        <Label id="phone">Select Inventory Item</Label>
        <Select
          onChange={handleProductChange}
          defaultValue={selectedProduct}
          style={{width: "200px"}}>
          {inventoryItems
            .filter(
              (option) =>
                !selectedItems.some((item) => item.itemId === option.itemType)
            )
            .map((option) => (
              <Option key={option.id} value={option.itemType}>
                {option.itemType}
              </Option>
            ))}
        </Select>
      </InputWrapper>
      <InputWrapper outerClassName="sm:col-span-6">
        <Label id={`Quantity-${sectionIndex}`}>Quantity</Label>
        <InputNumber
          min={1}
          defaultValue={quantity}
          onChange={handleQuantityChange}
        />
      </InputWrapper>
      <InputWrapper outerClassName="sm:col-span-6">
        <Label id="phone">Price Per Item</Label>
        <div>{selectedProductPrice.toFixed(2)}</div>
      </InputWrapper>
      <InputWrapper outerClassName="sm:col-span-6">
        <Label id="phone">Total Price</Label>
        <div>{totalPrice.toFixed(2)}</div>
      </InputWrapper>

      <DeleteOutlined
        style={{color: "red"}}
        onClick={() => onRemove(sectionIndex)}
      />
    </div>
  );
};

const Index: React.FC<IEditPurchaseOrderFormProps> = ({
  closeModal,
  order,
  items,
  setPo,
}) => {
  const formItems = items.map((it) => ({
    itemId: it.name,
    quantity: it.quantity,
    price: it.totalProcuredPrice,
  }));

  const addSection = () => {
    setFormSectionValues((prevFormSectionValues) => [
      ...prevFormSectionValues,
      {
        itemId: "", // Set the default item ID here
        quantity: 1,
        price: 0, // Set the default price here
      },
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

  const methods = useForm<FormProps>({
    defaultValues: {
      description: order?.description,
    },
  });
  const dispatch = useDispatch();

  const vendors = useSelector((state: RootState) => state.vendor);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [expectedDate, setExpectedDate] = useState(dayjs(order.expectedDate));
  const [formSectionValues, setFormSectionValues] =
    useState<Array<any>>(formItems);
  const [vendor, setVendor] = useState(order?.vendor?.name);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [sumTotal, setSumTotal] = useState(
    calculateFormSectionSumTotal(formItems)
  );

  const {
    handleSubmit,
    reset,
    formState: {errors},
  } = methods;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorsResponse = await fetchVendors();

        dispatch(loadVendors(vendorsResponse.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const mapFormSectionValuesToIds = (formSectionValues, inventoryItems) => {
    return formSectionValues.map((item) => {
      const correspondingInventoryItem = inventoryItems.find(
        (inventoryItem) => inventoryItem.itemType === item.itemId
      );

      if (correspondingInventoryItem) {
        return {
          ...item,
          itemId: correspondingInventoryItem.id,
        };
      }

      return item;
    });
  };

  useEffect(() => {
    const vendorItems = vendors.filter((vend) => vend.name === vendor);
    setInventoryItems(vendorItems[0]?.items);
  }, [vendor, vendors, vendors.length]);

  const handleVendorChange = (vendorSlug) => {
    setFormSectionValues([]);
    setVendor(vendorSlug);
  };

  const onSubmit = async (data: FormProps) => {
    const formattedDate = expectedDate.format("YYYY-MM-DD");
    data.expectedDate = formattedDate;
    data.vendorSlug = vendors.find(
      (ven) => ven.name === vendor || ven.slug === vendor
    )?.slug;
    data.items = mapFormSectionValuesToIds(formSectionValues, inventoryItems);

    const existingFormValues = {
      items: items.map((it) => ({
        itemId: it.itemTypeId.id,
        quantity: it.quantity,
        price: it.totalProcuredPrice,
      })),
      description: order.description,
      vendorSlug: order.vendor.slug,
      expectedDate: order.expectedDate,
    };
    const changedValues = deepCompare(data, existingFormValues);

    if (Object.keys(changedValues).length > 0) {
      if (changedValues["items"]?.length > 0) {
        changedValues["items"] = data.items;
      }
      setLoading(true);
      //   Make the API request with changedValues
      await updatePurchasingOrder(changedValues, order.orderId)
        .then((res) => {
          toast.success("Purchasing Order updated successfully!");
          setLoading(false);
          setPo(res.data);
          closeModal();
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err?.response?.data?.message);
        });
    } else {
      toast.warn("No Changes made");
      closeModal();
    }
  };

  const handleFormSectionChange = (
    index,
    newProductId,
    newQuantity,
    newProductPrice
  ) => {
    setFormSectionValues((prevFormSectionValues) => {
      const updatedFormSectionValues = prevFormSectionValues.map((item, idx) =>
        idx === index
          ? {
              ...item,
              itemId: newProductId,
              quantity: newQuantity,
              price: newProductPrice,
            }
          : item
      );

      const calculatedSumTotal = calculateFormSectionSumTotal(
        updatedFormSectionValues
      );
      setSumTotal(calculatedSumTotal.toFixed(2));

      return updatedFormSectionValues;
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12">
            <InputWrapper outerClassName="sm:col-span-4">
              <Label id="last-name">Expected Date</Label>
              <DatePicker
                value={expectedDate}
                style={{width: "200px", height: "38px"}}
                onChange={(val) => setExpectedDate(val)}
              />
              {errors?.expectedDate?.message && (
                <ErrorMessage>{errors.expectedDate.message}</ErrorMessage>
              )}
            </InputWrapper>
            <InputWrapper outerClassName="sm:col-span-4">
              <Label id="first-name">Select vendor</Label>
              <Select
                onChange={(val) => handleVendorChange(val)}
                defaultValue={vendor}
                style={{width: "200px"}}>
                {vendors?.map((option) => (
                  <Option key={option.id} value={option.slug}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            </InputWrapper>
            <InputWrapper outerClassName="sm:col-span-4">
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
              />
            ))}
          </div>
          <div className="flex justify-end">
            <PlusCircleOutlined onClick={addSection} />
          </div>
        </div>
        <div className="flex">
          <h3 className=" font-medium">Sum Total:</h3>
          <div className="ml-1 font-semibold">{sumTotal}</div>
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
              loading ? "disabled:opacity-50 cursor-not-allowed" : ""
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
