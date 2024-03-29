import {useForm, FormProvider} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {Input} from "components/react-hook-form/input";
import {Select, Checkbox, Spin, Descriptions, Radio, DatePicker} from "antd";
import {useEffect, useState} from "react";
import {RootState, useAppSelector} from "store";
import {toast} from "react-toastify";
import {ThreeDots} from "react-loader-spinner";
import {handleApiError} from "helpers/errors";
import {DeleteOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {fetchKgtin} from "slices/actions/kgtinActions";
import stateLga from "constants/states-lga.json";
import {ITaxPayer, defaultTaxPayer} from "components/user/user.interface";
import vehicleTypes from "constants/vehicle-types.json";
import vehicles from "constants/vehicles.json";
import carColors from "constants/car-colors.json";
import engineCapacity from "constants/engine-capacity.json";
import purpose from "constants/purpose.json";
import {
  createVehicleLicenceRenewalRequest,
  fetchVehicleDetails,
} from "slices/actions/vehicleLicense";
import {useRouter} from "next/router";
import {
  itemsToSend,
  taxPayerTypeList,
  categoryMappings,
} from "components/vehicle-license/constants";
import Modal from "components/modals/modal-1";
import moment from "moment";
import RoundSpinner from "components/spinners/roundSpinner";

const {Option} = Select;

export type FormProps = {
  first_name: string;
  surname: string;
  middle_name: string;
  email: string;
  e_mail: string;
  phone_number: string;
  phone_no: string;
  coy_name: string;
  chassisNumber: string;
  house_no: string;
  state: string;
  lga: string;
  company: string;
  street: string;
  category: string;
  engineCapacity: string;
  purpose: string;
  tankCapacity;
  taxId: string;
  vehicles: any[];
};

const FormSection = ({
  sectionIndex,
  onRemove,
  handleFormSectionChange,
  vehicleTypes,
  vehicleCategories,
  vehicles,
  carColors,
  engineCapacity,
  purpose,
  defaultItemsToSendList,
  userData,
}) => {
  const [vehicleMakes, setVehicleMakes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [vehicleModels, setVehicleModel] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [itemsToSend, setItemsToSend] = useState([]);
  const [itemsToSendList, setItemsToSendList] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedEngineCapacity, setSelectedEngineCapacity] = useState(null);
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [registrationNumberToFetch, setRegistrationNumberToFetch] =
    useState(null);
  const [selectedYearOfManufacture, setSelectedYearOfManufacture] =
    useState(null);

  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [fetching, setFetching] = useState(false);

  const handleVehicleTypeChange = (vehicleType) => {
    const lastItem = vehicleType[vehicleType.length - 1];
    const selectedType = vehicles.filter(
      (vehicle) => vehicle.type === lastItem
    );
    setSelectedType(lastItem);
    setVehicleMakes(selectedType);
    // Reset the itemsToSend array when the vehicle type changes
    setItemsToSend([]);

    // Dynamically update itemsToSendList based on the latest changes in itemsToSend
    setItemsToSendList((prevItems) =>
      prevItems.map((item) =>
        item.value === "VEHICLE_PLATE_NUMBER" ||
        item.value === "MOTORCYCLE_PLATE_NUMBER"
          ? {...item, value: "PLATE_NUMBER"}
          : item
      )
    );

    handleFormSectionChange(sectionIndex, {type: lastItem});
  };

  const handleVehicleCategoryChange = (vehicleCategory) => {
    const lastItem = vehicleCategory[vehicleCategory.length - 1];
    const mappedCategory = vehicleCategories[lastItem];
    setSelectedCategory(lastItem);
    handleFormSectionChange(sectionIndex, {category: mappedCategory});
  };

  const handleVehicleMakeChange = (vehicleMake) => {
    const lastItem = vehicleMake[vehicleMake.length - 1];
    const selectedMakes = vehicleMakes
      .filter((vehicle) => vehicle.brand === lastItem)
      .map((make) => make.models);
    setVehicleModel(selectedMakes[0]);
    setSelectedMake(lastItem);
    handleFormSectionChange(sectionIndex, {make: lastItem});
  };

  const handleModelChange = (model) => {
    const lastItem = model[model.length - 1];
    setSelectedModel(lastItem);
    handleFormSectionChange(sectionIndex, {model: lastItem});
  };

  const handlePurposeChange = (val) => {
    setSelectedPurpose(val);
    let items = defaultItemsToSendList;
    if (val === "PRIVATE" || val === "GOVERNMENT") {
      setItemsToSend([]);
      items = defaultItemsToSendList.filter(
        (it) => it.value !== "HACKNEY_PERMIT"
      );
    } else if (val === "COMMERCIAL") {
      setItemsToSend(["HACKNEY_PERMIT"]);
    }
    setItemsToSendList(items);
    handleFormSectionChange(sectionIndex, {purpose: val});
  };

  const handleCheckboxChange = (value) => {
    // Prevent toggling for the "HACKNEY_PERMIT" checkbox
    if (value === "HACKNEY_PERMIT") {
      return;
    }
    // Check if the checkbox being updated is the PLATE_NUMBER checkbox
    const isPlateNumberCheckbox = value === "PLATE_NUMBER";

    // Generate the checkbox value based on the selected vehicle type
    let updatedValue = value;
    if (isPlateNumberCheckbox && selectedType) {
      // Apply specific prefixes based on the selected vehicle type
      updatedValue =
        selectedType === "Automobiles"
          ? "VEHICLE_PLATE_NUMBER"
          : "MOTORCYCLE_PLATE_NUMBER";
    }

    setItemsToSend((prevItemsToSend) => {
      const updatedItemsToSend = prevItemsToSend.includes(updatedValue)
        ? prevItemsToSend.filter((item) => item !== updatedValue)
        : [...prevItemsToSend, updatedValue];

      // Use the callback to ensure it's called after the state update
      handleFormSectionChange(sectionIndex, {itemsToSend: updatedItemsToSend});

      setItemsToSendList((prevItems) =>
        prevItems.map((item) =>
          item.value === value ? {...item, value: updatedValue} : item
        )
      );

      return updatedItemsToSend;
    });

    // Update the checked state for the PLATE_NUMBER checkbox separately
    if (isPlateNumberCheckbox) {
      setItemsToSendList((prevItems) =>
        prevItems.map((item) =>
          item.value === updatedValue ? {...item, checked: !item.checked} : item
        )
      );
    }
  };

  const VehicleDetailsHandler = async () => {
    if (registrationNumberToFetch) {
      try {
        setFetching(true);
        const {data} = await fetchVehicleDetails(registrationNumberToFetch);
        setSelectedType(data[0]?.type);
        setSelectedCategory(data[0]?.category);
        setSelectedMake(data[0]?.make);
        setSelectedModel(data[0]?.model);
        setSelectedColor(data[0]?.color);
        setSelectedEngineCapacity(data[0]?.engineCapacity);
        setVehicleDetails(data[0]);
        setSelectedPurpose(data[0]?.purpose);
        const dateObject = moment(data[0]?.yearOfManufacture);
        setSelectedYearOfManufacture(dateObject);
      } catch (error) {
        handleApiError(
          error,
          userData,
          "There was an error validating the provided Tax Id "
        );
      } finally {
        setFetching(false);
      }
    }
  };

  useEffect(() => {
    handleFormSectionChange(sectionIndex, {color: selectedColor});
    handleFormSectionChange(sectionIndex, {make: selectedMake});
    handleFormSectionChange(sectionIndex, {model: selectedModel});
    handleFormSectionChange(sectionIndex, {
      yearOfManufacture: selectedYearOfManufacture,
    });
    handleFormSectionChange(sectionIndex, {type: selectedType});
    handleFormSectionChange(sectionIndex, {category: selectedCategory});
    handleFormSectionChange(sectionIndex, {purpose: selectedPurpose});
    handleFormSectionChange(sectionIndex, {
      engineCapacity: selectedEngineCapacity,
    });
    handleFormSectionChange(sectionIndex, {
      chassisNumber: vehicleDetails?.chassisNumber,
    });
    handleFormSectionChange(sectionIndex, {
      engineNumber: vehicleDetails?.engineNumber,
    });
    handleFormSectionChange(sectionIndex, {
      previousRegNumber: vehicleDetails?.previousRegNumber,
    });
    handleFormSectionChange(sectionIndex, {
      regNumber: registrationNumberToFetch,
    });
  }, [vehicleDetails]);

  useEffect(() => {
    let items = defaultItemsToSendList;
    if (selectedPurpose === "PRIVATE" || selectedPurpose === "GOVERNMENT") {
      items = defaultItemsToSendList.filter(
        (it) => it.label !== "HACKNEY PERMIT"
      );
    }
    if (selectedPurpose === "COMMERCIAL") {
      const item = itemsToSend.find((it) => it === "HACKNEY_PERMIT");
      if (!item) {
        setItemsToSend((prev) => {
          const newItems = [...prev, "HACKNEY_PERMIT"];
          return newItems;
        });
      }
    }

    setItemsToSendList(items);
  }, [selectedPurpose]);

  return (
    <div>
      <InputWrapper outerClassName="sm:col-span-3 mt-3">
        <Label id="phone">Please enter vehicle plate number</Label>
        <div className="flex mr-4">
          <Input
            width="w-72"
            type="text"
            disabled={fetching}
            onChange={(e) => {
              handleFormSectionChange(sectionIndex, {
                regNumber: e.target.value,
              });
              setRegistrationNumberToFetch(e.target.value);
            }}
            id="taxId"
            name={`${sectionIndex}-vehicle}`}
            placeholder="Please enter vehicle plate number"
          />
          {fetching ? (
            <RoundSpinner />
          ) : (
            <button
              type="button"
              onClick={VehicleDetailsHandler}
              className="inline-flex justify-center px-1 py-1 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              verify
            </button>
          )}
        </div>
      </InputWrapper>

      <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12">
        <InputWrapper outerClassName="sm:col-span-3">
          <Label id="phone">Type</Label>
          <Select
            mode="tags"
            maxTagCount={1}
            showSearch={true}
            value={selectedType}
            onChange={handleVehicleTypeChange}
            style={{width: "290px"}}>
            {vehicleTypes?.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </InputWrapper>

        <InputWrapper outerClassName="sm:col-span-3">
          <Label id="phone">Category</Label>
          <Select
            mode="tags"
            maxTagCount={1}
            showSearch={true}
            value={selectedCategory}
            onChange={handleVehicleCategoryChange}
            style={{width: "290px"}}>
            {Object.keys(vehicleCategories).map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </InputWrapper>

        <InputWrapper outerClassName="sm:col-span-3">
          <Label id="phone">Make</Label>
          <Select
            mode="tags"
            maxTagCount={1}
            showSearch={true}
            value={selectedMake}
            onChange={handleVehicleMakeChange}
            style={{width: "290px"}}>
            {vehicleMakes?.map((option) => (
              <Option key={option.brand} value={option.brand}>
                {option.brand}
              </Option>
            ))}
          </Select>
        </InputWrapper>
        <InputWrapper outerClassName="sm:col-span-3">
          <Label id="phone">Model</Label>
          <Select
            mode="tags"
            maxTagCount={1}
            showSearch={true}
            value={selectedModel}
            onChange={(val) => handleModelChange(val)}
            style={{width: "290px"}}>
            {vehicleModels?.map((option, index) => (
              <Option key={index} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </InputWrapper>
        <InputWrapper outerClassName="sm:col-span-3">
          <Label id="color">Color</Label>
          <Select
            showSearch={true}
            onChange={(val) => {
              setSelectedColor(val);
              handleFormSectionChange(sectionIndex, {color: val});
            }}
            value={selectedColor}
            style={{width: "290px"}}>
            {carColors.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </InputWrapper>
        <InputWrapper outerClassName="sm:col-span-3">
          <Label id="chassisNumber">Chassis Number</Label>
          <Input
            onChange={(e) => {
              handleFormSectionChange(sectionIndex, {
                chassisNumber: e.target.value,
              });
            }}
            defaultValue={vehicleDetails?.chassisNumber}
            id={`${sectionIndex}-chassisNumber`}
            name={`${sectionIndex}-chassisNumber`}
            type="text"
          />
        </InputWrapper>
        <InputWrapper outerClassName="sm:col-span-3">
          <Label id="previousRegNumber">Previous Reg Number</Label>
          <Input
            onChange={(e) => {
              handleFormSectionChange(sectionIndex, {
                previousRegNumber: e.target.value,
              });
            }}
            defaultValue={vehicleDetails?.previousRegNumber}
            id={`${sectionIndex}-previousRegNumber`}
            name={`${sectionIndex}-previousRegNumber`}
            type="text"
          />
        </InputWrapper>
        <InputWrapper outerClassName="sm:col-span-3">
          <Label id={`${sectionIndex}-engineNumber`}>Engine Number</Label>
          <Input
            onChange={(e) => {
              handleFormSectionChange(sectionIndex, {
                engineNumber: e.target.value,
              });
            }}
            defaultValue={vehicleDetails?.engineNumber}
            id={`${sectionIndex}-engineNumber`}
            name={`${sectionIndex}-engineNumber`}
            type="text"
          />
        </InputWrapper>
        <InputWrapper outerClassName="sm:col-span-3">
          <Label id="engine capacity">Engine Capacity</Label>
          <Select
            showSearch={true}
            value={selectedEngineCapacity}
            onChange={(val) => {
              setSelectedEngineCapacity(val);
              handleFormSectionChange(sectionIndex, {engineCapacity: val});
            }}
            style={{width: "290px"}}>
            {engineCapacity.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </InputWrapper>
        <InputWrapper outerClassName="sm:col-span-3">
          <Label id={`${sectionIndex}-year`}>Year Of Manufacture</Label>
          <DatePicker
            style={{width: "290px"}}
            value={selectedYearOfManufacture}
            picker="year"
            disabledDate={(current) => current && current > moment()}
            onChange={(val) => {
              setSelectedYearOfManufacture(val);
              handleFormSectionChange(sectionIndex, {
                yearOfManufacture: val,
              });
            }}
          />
        </InputWrapper>
        <InputWrapper outerClassName="sm:col-span-3">
          <Label id="phone">Purpose</Label>
          <Select
            onChange={(val) => handlePurposeChange(val)}
            value={selectedPurpose}
            style={{width: "290px"}}>
            {purpose.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </InputWrapper>
      </div>
      {selectedPurpose && (
        <>
          <p className="text-base my-1">
            Select Items included in this registration
          </p>
          <div className="w-full my-1">
            {itemsToSendList.map((item, index) => (
              <Checkbox
                key={`${item.value}_${index}`}
                value={item.value}
                onChange={() => handleCheckboxChange(item.value)}
                checked={itemsToSend.includes(item.value)}>
                {item.label}
              </Checkbox>
            ))}
          </div>
        </>
      )}
      <div className="flex justify-end">
        <DeleteOutlined
          style={{color: "red"}}
          onClick={() => onRemove(sectionIndex)}
        />
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  const addSection = () => {
    setFormSectionValues((prevFormSectionValues) => [
      ...prevFormSectionValues,
      {
        type: null,
        category: null,
        make: null,
        model: null,
        color: null,
        engineNumber: null,
        chassisNumber: null,
        engineCapacity: null,
        purpose: null,
        itemsToSend: [],
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

  const [lgas, setLgas] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedLga, setSelectedLga] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taxIdValidating, setTaxIdValidating] = useState(false);
  const [formSectionValues, setFormSectionValues] = useState<Array<any>>([
    {
      type: null,
      category: null,
      make: null,
      model: null,
      color: null,
      engineNumber: null,
      chassisNumber: null,
      engineCapacity: null,
      yearOfManufacture: null,
      purpose: null,
      itemsToSend: [],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [taxPayer, setTaxPayer] = useState<ITaxPayer>(defaultTaxPayer);
  const [taxPayerType, setTaxPayerType] = useState("INDIVIDUAL");
  const userData = useAppSelector((state: RootState) => state.auth);
  const router = useRouter();

  const methods = useForm<FormProps>({
    defaultValues: taxPayer,
  });

  const {
    handleSubmit,
    reset,
    formState: {errors},
    watch,
  } = methods;

  const onSubmit = async (data: FormProps) => {
    if (selectedLga) {
      data.lga = selectedLga;
    }
    if (selectedState) {
      data.state = selectedState;
    }

    const payload = {
      ownerTin: data.taxId,
      vehicles: formSectionValues,
      taxPayerType: taxPayerType,
      userData: {
        ...data,
      },
    };

    setLoading(true);
    try {
      const {data} = await createVehicleLicenceRenewalRequest(payload);
      toast.success("Vehicle License Request created successfully");
      setLoading(false);
      router.push(`/vehicle-licence/renewal/${data?.vlRequestSlug}`);
    } catch (error) {
      setLoading(false);
      handleApiError(
        error,
        userData,
        "There was an error creating vehicle license request"
      );
    }
  };

  const handleStateChange = (stateName) => {
    const state = stateLga.filter((st) => st.name === stateName)[0];
    setLgas(state.lgas);
    setSelectedState(state.name);
  };

  const handleFormSectionChange = (index, updatedValues) => {
    setFormSectionValues((prevFormSectionValues) => {
      const updatedFormSectionValues = [...prevFormSectionValues];
      const updatedSection = {...updatedFormSectionValues[index]};

      for (const key in updatedValues) {
        if (Object.prototype.hasOwnProperty.call(updatedValues, key)) {
          updatedSection[key] = updatedValues[key];
        }
      }

      updatedFormSectionValues[index] = updatedSection;

      return updatedFormSectionValues;
    });
  };

  const TaxIdHandler = async (taxId) => {
    if (taxId.length === 10 && taxId.trim() !== "") {
      setTaxIdValidating(true);
      try {
        const {data} = await fetchKgtin(taxId, taxPayerType);
        const tp = data;
        setTaxPayer(tp);
        reset({
          first_name: tp.first_name,
          surname: tp.surname,
          middle_name: tp.middle_name,
          email: tp.email,
          e_mail: tp.e_mail,
          phone_number: tp.phone_number,
          phone_no: tp.phone_no,
          house_no: tp.house_no,
          street: tp.street,
          state: tp.state,
          lga: tp.lga,
          company: tp.coy_name,
        });

        setSelectedState(tp?.state || tp?.stateOfResidence);
        setSelectedLga(tp?.lga);
      } catch (error) {
        handleApiError(
          error,
          userData,
          "There was an error validating the provided Tax Id "
        );
      } finally {
        setTaxIdValidating(false);
      }
    }
  };

  const formData = watch();

  const formItems = [
    {
      label: "Name",
      value:
        taxPayerType === "INDIVIDUAL"
          ? `${formData?.first_name} ${formData?.surname}`
          : `${formData?.company}`,
    },
    {
      label: "Email",
      value:
        taxPayerType === "INDIVIDUAL"
          ? `${formData?.email}`
          : `${formData?.e_mail}`,
    },
    {
      label: "Phone Number",
      value:
        taxPayerType === "INDIVIDUAL"
          ? `${formData?.phone_number}`
          : `${formData?.phone_no}`,
    },

    {
      label: "State",
      value: selectedState,
    },
    {
      label: "Lga",
      value: selectedLga,
    },
    {
      label: "House No.",
      value: formData.house_no,
    },
    {
      label: "Street",
      value: formData.street,
    },
  ];

  return (
    <>
      {/* confirmation modal
       */}
      <Modal
        title="Tax Payer information"
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}>
        <div>
          <p className=" text-justify text-sm mb-3">
            Please verify that these details provided are accurate as they will
            be used to update the information in the provided Tax ID
          </p>
          <Descriptions>
            {formItems.map((item) => (
              <Descriptions.Item key={item.label} label={item.label}>
                {item.value}
              </Descriptions.Item>
            ))}
          </Descriptions>

          <div className="flex justify-start space-x-2">
            <button
              onClick={() => setIsModalOpen(false)}
              type="button"
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(onSubmit)()}
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
        </div>
      </Modal>
      {/*  */}
      <Spin tip="Validating Tax Id..." spinning={taxIdValidating}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <div className="space-y-2">
              <p className=" text-base">Owner Information</p>

              <div>
                <Label id="taxId">Select Tax Payer Type</Label>
                <div className="w-full my-1 flex justify-between items-center">
                  <Radio.Group
                    defaultValue={taxPayerType}
                    onChange={(e) => {
                      setTaxPayerType(e.target.value);
                      reset(defaultTaxPayer);
                    }}>
                    {taxPayerTypeList.map((tp) => (
                      <Radio key={tp.label} value={tp.value}>
                        {tp.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12">
                <InputWrapper outerClassName="sm:col-span-3">
                  <Label id="taxId">Tax Id</Label>
                  <Input
                    disabled={taxIdValidating}
                    onChange={(e) => TaxIdHandler(e.target.value)}
                    id="taxId"
                    name="taxId"
                    type="number"
                    placeholder="Please enter your tax Id"
                  />
                </InputWrapper>
                {taxPayerType === "INDIVIDUAL" ? (
                  <>
                    {" "}
                    <InputWrapper outerClassName="sm:col-span-3">
                      <Label id="first_name">First Name</Label>
                      <Input
                        defaultValue={taxPayer?.first_name}
                        id="first_name"
                        name="first_name"
                        type="text"
                        readonly
                      />
                    </InputWrapper>
                    <InputWrapper outerClassName="sm:col-span-3">
                      <Label id="middle_name">Middle Name</Label>
                      <Input
                        defaultValue={taxPayer?.middle_name}
                        id="middle_name"
                        name="middle_name"
                        type="text"
                        readonly
                      />
                    </InputWrapper>
                    <InputWrapper outerClassName="sm:col-span-3">
                      <Label id="surname">Last Name</Label>
                      <Input
                        defaultValue={taxPayer?.surname}
                        id="surname"
                        name="surname"
                        type="text"
                        readonly
                      />
                    </InputWrapper>
                    <InputWrapper outerClassName="sm:col-span-3">
                      <Label id="email">Email</Label>
                      <Input
                        defaultValue={taxPayer?.email}
                        id="email"
                        name="email"
                        type="text"
                      />
                    </InputWrapper>
                    <InputWrapper outerClassName="sm:col-span-3">
                      <Label id="phone_number">Phone Number</Label>
                      <Input
                        defaultValue={taxPayer?.phone_number}
                        id="phone_number"
                        name="phone_number"
                        type="number"
                      />
                    </InputWrapper>
                  </>
                ) : (
                  <>
                    <InputWrapper outerClassName="sm:col-span-3">
                      <Label id="company">Company / Organization Name</Label>
                      <Input id="company" name="company" type="text" readonly />
                    </InputWrapper>

                    <InputWrapper outerClassName="sm:col-span-3">
                      <Label id="email">Email</Label>
                      <Input
                        defaultValue={taxPayer?.e_mail}
                        id="e_mail"
                        name="e_mail"
                        type="text"
                      />
                    </InputWrapper>
                    <InputWrapper outerClassName="sm:col-span-3">
                      <Label id="phone_number">Phone Number</Label>
                      <Input
                        defaultValue={taxPayer?.phone_no}
                        id="phone_no"
                        name="phone_no"
                        type="number"
                      />
                    </InputWrapper>
                  </>
                )}
              </div>
              <p className=" text-base">Physical Address</p>
              <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12">
                <InputWrapper outerClassName="sm:col-span-3">
                  <Label id="house_no">House / Building No</Label>
                  <Input
                    defaultValue={taxPayer?.house_no}
                    id="house_no"
                    name="house_no"
                    type="text"
                  />
                </InputWrapper>
                <InputWrapper outerClassName="sm:col-span-3">
                  <Label id="street">Street</Label>
                  <Input
                    defaultValue={taxPayer?.street}
                    id="street"
                    name="street"
                    type="text"
                  />
                </InputWrapper>
                <InputWrapper outerClassName="sm:col-span-3">
                  <Label id="state">Select State of Residence</Label>
                  <Select
                    showSearch={true}
                    onChange={(val) => handleStateChange(val)}
                    value={selectedState}
                    style={{width: "280px"}}>
                    {stateLga?.map((option) => (
                      <Option key={option.code} value={option.name}>
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </InputWrapper>
                <InputWrapper outerClassName="sm:col-span-3">
                  <Label id="lga">Select LGA of Residence</Label>
                  <Select
                    showSearch={true}
                    value={selectedLga}
                    onChange={(val) => setSelectedLga(val)}
                    style={{width: "280px"}}>
                    {lgas?.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                </InputWrapper>
              </div>
              <div>
                <p className=" text-base">Vehicle(s) Information</p>
                {formSectionValues.map(({itemId}, index) => (
                  <FormSection
                    defaultItemsToSendList={itemsToSend}
                    purpose={purpose}
                    engineCapacity={engineCapacity}
                    carColors={carColors}
                    vehicles={vehicles}
                    vehicleCategories={categoryMappings}
                    vehicleTypes={vehicleTypes}
                    handleFormSectionChange={handleFormSectionChange}
                    key={itemId}
                    sectionIndex={index}
                    onRemove={() => removeSection(index)}
                    userData={userData}
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
                }}
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Preview
              </button>
            </div>
          </form>
        </FormProvider>
      </Spin>
    </>
  );
};
export default Index;
