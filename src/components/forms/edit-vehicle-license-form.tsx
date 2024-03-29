import {useForm, FormProvider} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {Input} from "components/react-hook-form/input";

import {
  Select,
  Checkbox,
  Spin,
  Descriptions,
  Radio,
  Input as AntInput,
  DatePicker,
} from "antd";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
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
  createVehicleLicenseRequest,
  updateVehicleLicenseRequest,
} from "slices/actions/vehicleLicense";
import {useRouter} from "next/router";
import {
  itemsToSend,
  taxPayerTypeList,
  categoryMappings
} from "components/vehicle-license/constants";
import Modal from "components/modals/modal-1";
import {IVehicleLicenceRequest} from "components/vehicle-license/interface";

import moment from "moment";

const {Option} = Select;

export type FormProps = {
  first_name: string;
  surname: string;
  company: string;
  middle_name: string;
  email: string;
  e_mail: string;
  phone_number: string;
  phone_no: string;
  chassisNumber: string;
  house_no: string;
  state: string;
  lga: string;
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
  existingItemsToSend,
  defaultVehicleValues,
}) => {
  const [vehicleMakes, setVehicleMakes] = useState([]);
  const [selectedType, setSelectedType] = useState(defaultVehicleValues?.type);
  const [selectedCategory, setSelectedCategory] = useState(
    defaultVehicleValues?.category
  );
  const [selectedMake, setSelectedMake] = useState(defaultVehicleValues?.make);
  const [selectedYearOfManufacture, setSelectedYearOfManufacture] =
    useState(null);
  const [vehicleModels, setVehicleModel] = useState([]);
  const [selectedModel, setSelectedModel] = useState(
    defaultVehicleValues?.model
  );
  const [itemsToSend, setItemsToSend] = useState(existingItemsToSend);
  const [itemsToSendList, setItemsToSendList] = useState([]);
  const [selectedColor, setSelectedColor] = useState(
    defaultVehicleValues?.color
  );
  const [selectedEngineCapacity, setSelectedEngineCapacity] = useState(
    defaultVehicleValues?.engineCapacity
  );
  const [selectedPurpose, setSelectedPurpose] = useState(
    defaultVehicleValues?.purpose
  );


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
        item.value === "VEHICLE_PLATE_NUMBER" || item.value === "MOTORCYCLE_PLATE_NUMBER" ? { ...item, value: "PLATE_NUMBER" } : item
      )
    );

    handleFormSectionChange(sectionIndex, {type: lastItem});
  };

  const handleVehicleCategoryChange = (vehicleCategory) => {
  const lastItem = vehicleCategory[vehicleCategory.length - 1];
  const mappedCategory = vehicleCategories[lastItem];
  setSelectedCategory(lastItem);
  handleFormSectionChange(sectionIndex, { category: mappedCategory });
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
    if (val === "COMMERCIAL") {
      const item = itemsToSend?.find((it) => it === "HACKNEY_PERMIT");
      if (!item) {
        setItemsToSend((prev) => {
          const newItems = [...prev, "HACKNEY_PERMIT"];
          return newItems;
        });
      }
    }

    handleFormSectionChange(sectionIndex, {purpose: val});
  };

  const handleCheckboxChange = (value) => {
    if (value === "HACKNEY_PERMIT") {
      return;
    } else {
     // Check if the checkbox being updated is the PLATE_NUMBER checkbox
  const isPlateNumberCheckbox = value === "PLATE_NUMBER";

  // Generate the checkbox value based on the selected vehicle type
  let updatedValue = value;
  if (isPlateNumberCheckbox && selectedType) {
    // Apply specific prefixes based on the selected vehicle type
    updatedValue = selectedType === "Automobiles" ? "VEHICLE_PLATE_NUMBER" : "MOTORCYCLE_PLATE_NUMBER";
  }
  
  setItemsToSend((prevItemsToSend) => {
    const updatedItemsToSend = prevItemsToSend.includes(updatedValue)
    ? prevItemsToSend.filter((item) => item !== updatedValue)
    : [...prevItemsToSend, updatedValue];
    

      // Use the callback to ensure it's called after the state update
      handleFormSectionChange(sectionIndex, {itemsToSend: updatedItemsToSend});
      
    //    setItemsToSendList((prevItems) =>
    //   prevItems.map((item) =>
    //     item.value === value ? { ...item, value: updatedValue } : item
    //   )
    // );
      
      return updatedItemsToSend;
    });

      // Update the checked state for the PLATE_NUMBER checkbox separately
  if (isPlateNumberCheckbox) {
    setItemsToSendList((prevItems) =>
      prevItems.map((item) =>
        item.value === updatedValue ? { ...item, checked: !item.checked } : item
      )
    );
  }
    }
  };

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

  useEffect(() => {
    const dateObject = moment(defaultVehicleValues?.yearOfManufacture);
    setSelectedYearOfManufacture(dateObject);
  }, []);

  useEffect(() => {
    
  const updatedValue = selectedType === "Automobiles" ? "VEHICLE_PLATE_NUMBER" : "MOTORCYCLE_PLATE_NUMBER";

  // Dynamically update itemsToSendList based on the latest changes in itemsToSend
    setItemsToSendList((prevItems) =>
      prevItems.map((item) =>
        item.value === "PLATE_NUMBER" ? { ...item, value: updatedValue } : item
      )
    ); 
  }, []);

  return (
    <div>
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
          <AntInput
            onChange={(e) => {
              handleFormSectionChange(sectionIndex, {
                chassisNumber: e.target.value,
              });
            }}
            defaultValue={defaultVehicleValues?.chassisNumber}
            type="text"
          />
        </InputWrapper>
        <InputWrapper outerClassName="sm:col-span-3">
          <Label id="prevRegNumber">Previous Reg Number</Label>
          <AntInput
            onChange={(e) => {
              handleFormSectionChange(sectionIndex, {
                previousRegNumber: e.target.value,
              });
            }}
            defaultValue={defaultVehicleValues?.previousRegNumber}
            type="text"
          />
        </InputWrapper>
        <InputWrapper outerClassName="sm:col-span-3">
          <Label id={`${sectionIndex}-engineNumber`}>Engine Number</Label>
          <AntInput
            onChange={(e) => {
              handleFormSectionChange(sectionIndex, {
                engineNumber: e.target.value,
              });
            }}
            defaultValue={defaultVehicleValues?.engineNumber}
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
            {itemsToSendList?.map((item) => (
              <Checkbox
                disabled={item.value === "HACKNEY_PERMIT"}
                defaultChecked={itemsToSend?.includes(item.value)}
                key={item.label}
                value={item.value}
                onChange={(e) => handleCheckboxChange(e.target.value)}
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

const Index: React.FC<{vlr: IVehicleLicenceRequest}> = ({vlr}) => {
  const [lgas, setLgas] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taxIdValidating, setTaxIdValidating] = useState(false);
  const [taxPayerType, setTaxPayerType] = useState(null);
  const [formSectionValues, setFormSectionValues] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [taxPayer, setTaxPayer] = useState<ITaxPayer>(vlr?.ownerData);
  const [selectedState, setSelectedState] = useState("");
  const [selectedLga, setSelectedLga] = useState("");
  const userData = useAppSelector((state: RootState) => state.auth);
  const router = useRouter();
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
      return;
    }

    setFormSectionValues((prevFormSectionValues) =>
      prevFormSectionValues.filter((_, idx) => idx !== indexToRemove)
    );
  };

  const methods = useForm<FormProps>();

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

    if (taxPayerType === "INDIVIDUAL") {
      delete data.company;
      delete data.e_mail;
      delete data.phone_no;
    } else {
      delete data.email;
      delete data.first_name;
      delete data.middle_name;
      delete data.surname;
      delete data.phone_number;
    }

    const payload = {
      ownerTin: data.taxId,
      taxPayerType,
      requestType: "NEW",
      vehicles: formSectionValues,
      userData: {
        ...data,
      },
    };

    try {
      setLoading(true);
      const {data} = await updateVehicleLicenseRequest(
        payload,
        vlr.vlRequestSlug
      );

      toast.success("Vehicle License Request updated successfully");
      setLoading(false);
      router.push(`/vehicle-licence/new/${data?.vlRequestSlug}`);
    } catch (error) {
      setLoading(false);
      handleApiError(
        error,
        userData,
        "There was an error updating vehicle license request"
      );
    }
  };

  const handleStateChange = (stateName) => {
    setSelectedLga("");
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
        setTaxPayer(data);

        reset({
          taxId: vlr.ownerTin,
          first_name: data?.first_name,
          surname: data?.surname,
          middle_name: data?.middle_name,
          company: data?.coy_name,
          email: data?.email,
          e_mail: data?.e_mail,
          phone_number: data?.phone_number,
          phone_no: data?.phone_no,
          house_no: data?.house_no,
          street: data?.street,
          state: data?.state_of_residence,
          lga: data?.lga,
        });
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

  useEffect(() => {
    const {
      coy_name: company,
      first_name,
      surname,
      middle_name,
      email,
      e_mail,
      phone_no,
      phone_number,
      lga,
      state_of_residence,
      state,
      house_no,
      street,
    } = vlr?.ownerData || {};

    reset({
      company,
      first_name,
      surname,
      middle_name,
      email,
      e_mail,
      phone_no,
      phone_number,
      lga,
      state: state_of_residence || state,
      house_no,
      street,
    });
    setTaxPayer(vlr?.ownerData);
    setTaxPayerType(vlr?.taxPayerType);
    setSelectedLga(vlr?.ownerData?.lga);
    setSelectedState(vlr?.ownerData?.stateOfResidence || state);
    setFormSectionValues(
      vlr?.vehicles?.map((veh) => ({
        ...veh,
        itemsToSend: veh?.vehicleLicence?.itemsToSend,
      }))
    );
  }, [vlr]);

  const formData = watch(); // This returns an object with all form field values

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
      {/* confirmation modal begins
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
      {/* confirmation modal ends
       */}

      <Spin tip="Validating Tax Id..." spinning={taxIdValidating}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <div className="space-y-2">
              <div>
                <Label id="taxId">Select Tax Payer Type</Label>
                <div className="w-full my-1 flex justify-between items-center">
                  <Radio.Group
                    value={taxPayerType}
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
              <p className=" text-base">Owner Information</p>
              <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12">
                <InputWrapper outerClassName="sm:col-span-3">
                  <Label id="taxId">Tax Id</Label>
                  <Input
                    defaultValue={taxPayer?.KGTIN}
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
                  <Label>Select State of Residence</Label>
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
                  <Label>Select LGA of Residence</Label>
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
                {formSectionValues?.map((vehicle, index) => (
                  <FormSection
                    defaultVehicleValues={vehicle}
                    existingItemsToSend={vehicle.itemsToSend}
                    defaultItemsToSendList={itemsToSend}
                    purpose={purpose}
                    engineCapacity={engineCapacity}
                    carColors={carColors}
                    vehicles={vehicles}
                    vehicleTypes={vehicleTypes}
                    vehicleCategories={categoryMappings}
                    handleFormSectionChange={handleFormSectionChange}
                    key={vehicle?.id}
                    sectionIndex={index}
                    onRemove={() => removeSection(index)}
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
