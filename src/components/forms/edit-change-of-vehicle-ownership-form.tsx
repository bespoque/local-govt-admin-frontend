// import {useForm, FormProvider} from "react-hook-form";
// import {InputWrapper} from "components/react-hook-form/input-wrapper";
// import {Label} from "components/react-hook-form/label";
// import {Input} from "components/react-hook-form/input";

// import {
//   Select,
//   Checkbox,
//   Spin,
//   Descriptions,
//   Radio,
//   Input as AntInput,
//   DatePicker,
// } from "antd";
// import {useEffect, useState} from "react";

// import {RootState, useAppSelector} from "store";
// import {toast} from "react-toastify";
// import {ThreeDots} from "react-loader-spinner";
// import {handleApiError} from "helpers/errors";
// import {fetchKgtin} from "slices/actions/kgtinActions";
// import stateLga from "constants/states-lga.json";
// import {
//   ITaxPayer,
//   NewITaxPayer,
//   defaultNewTaxPayer,
//   defaultTaxPayer,
// } from "components/user/user.interface";
// import vehicleTypes from "constants/vehicle-types.json";
// import vehicleCategories from "constants/vehicle-categories.json";
// import vehicles from "constants/vehicles.json";
// import carColors from "constants/car-colors.json";
// import engineCapacity from "constants/engine-capacity.json";
// import purpose from "constants/purpose.json";
// import {updateChangeOfOwnershipRequest} from "slices/actions/vehicleLicense";
// import {useRouter} from "next/router";
// import {
//   itemsToSend,
//   taxPayerTypeList,
// } from "components/vehicle-license/constants";
// import Modal from "components/modals/modal-1";
// import {IVehicleChangeOfOwnershipRequest} from "components/vehicle-license/interface";

// import moment from "moment";

// const {Option} = Select;

// export type FormProps = {
//   //Existing owner fields
//   first_name: string;
//   surname: string;
//   middle_name: string;
//   email: string;
//   e_mail: string;
//   phone_number: string;
//   phone_no: string;
//   coy_name: string;
//   lga: string;
//   state: string;
//   house_no: string;
//   street: string;
//   taxId: string;
//   company: string;

//   // New owner fields
//   new_first_name: string;
//   new_surname: string;
//   new_middle_name: string;
//   new_email: string;
//   new_e_mail: string;
//   new_phone_number: string;
//   new_phone_no: string;
//   new_coy_name: string;
//   new_lga: string;
//   new_state: string;
//   new_house_no: string;
//   new_street: string;
//   new_taxId: string;
//   new_company: string;
//   category: string;
//   engineCapacity: string;
//   chassisNumber: string;
//   purpose: string;
//   tankCapacity;
//   vehicles: any[];
// };

// const FormSection = ({
//   sectionIndex,
//   handleFormSectionChange,
//   vehicleTypes,
//   vehicleCategories,
//   vehicles,
//   carColors,
//   engineCapacity,
//   purpose,
//   defaultItemsToSendList,
//   existingItemsToSend,
//   defaultVehicleValues,
// }) => {
//   const [vehicleMakes, setVehicleMakes] = useState([]);
//   const [selectedType, setSelectedType] = useState(defaultVehicleValues?.type);
//   const [selectedCategory, setSelectedCategory] = useState(
//     defaultVehicleValues?.category
//   );
//   const [selectedMake, setSelectedMake] = useState(defaultVehicleValues?.make);
//   const [selectedYearOfManufacture, setSelectedYearOfManufacture] =
//     useState(null);
//   const [vehicleModels, setVehicleModel] = useState([]);
//   const [selectedModel, setSelectedModel] = useState(
//     defaultVehicleValues?.model
//   );
//   const [itemsToSend, setItemsToSend] = useState(existingItemsToSend);
//   const [itemsToSendList, setItemsToSendList] = useState([]);
//   const [selectedColor, setSelectedColor] = useState(
//     defaultVehicleValues?.color
//   );
//   const [selectedEngineCapacity, setSelectedEngineCapacity] = useState(
//     defaultVehicleValues?.engineCapacity
//   );
//   const [selectedPurpose, setSelectedPurpose] = useState(
//     defaultVehicleValues?.purpose
//   );

//   const handleVehicleTypeChange = (vehicleType) => {
//     const lastItem = vehicleType[vehicleType.length - 1];
//     const selectedType = vehicles.filter(
//       (vehicle) => vehicle.type === lastItem
//     );
//     setSelectedType(lastItem);
//     setVehicleMakes(selectedType);

//     handleFormSectionChange(sectionIndex, {type: lastItem});
//   };

//   const handleVehicleCategoryChange = (vehicleCategory) => {
//     const lastItem = vehicleCategory[vehicleCategory.length - 1];
//     setSelectedCategory(lastItem);

//     handleFormSectionChange(sectionIndex, {category: lastItem});
//   };

//   const handleVehicleMakeChange = (vehicleMake) => {
//     const lastItem = vehicleMake[vehicleMake.length - 1];
//     const selectedMakes = vehicleMakes
//       .filter((vehicle) => vehicle.brand === lastItem)
//       .map((make) => make.models);
//     setVehicleModel(selectedMakes[0]);
//     setSelectedMake(lastItem);
//     handleFormSectionChange(sectionIndex, {make: lastItem});
//   };

//   const handleModelChange = (model) => {
//     const lastItem = model[model.length - 1];
//     setSelectedModel(lastItem);
//     handleFormSectionChange(sectionIndex, {model: lastItem});
//   };

//   const handlePurposeChange = (val) => {
//     setSelectedPurpose(val);
//     if (val === "COMMERCIAL") {
//       const item = itemsToSend?.find((it) => it === "HACKNEY_PERMIT");
//       if (!item) {
//         setItemsToSend((prev) => {
//           const newItems = [...prev, "HACKNEY_PERMIT"];
//           return newItems;
//         });
//       }
//     }

//     handleFormSectionChange(sectionIndex, {purpose: val});
//   };

//   const handleCheckboxChange = (value) => {
//     if (value === "HACKNEY_PERMIT") {
//       return;
//     } else {
//       setItemsToSend((prevItemsToSend) => {
//         const updatedItemsToSend = prevItemsToSend.includes(value)
//           ? prevItemsToSend.filter((item) => item !== value)
//           : [...prevItemsToSend, value];

//         // Use the callback to ensure it's called after the state update
//         handleFormSectionChange(sectionIndex, {
//           itemsToSend: updatedItemsToSend,
//         });
//         return updatedItemsToSend;
//       });
//     }
//   };

//   useEffect(() => {
//     let items = defaultItemsToSendList;
//     if (selectedPurpose === "PRIVATE" || selectedPurpose === "GOVERNMENT") {
//       items = defaultItemsToSendList.filter(
//         (it) => it.label !== "HACKNEY PERMIT"
//       );
//     }
//     if (selectedPurpose === "COMMERCIAL") {
//       const item = itemsToSend.find((it) => it === "HACKNEY_PERMIT");
//       if (!item) {
//         setItemsToSend((prev) => {
//           const newItems = [...prev, "HACKNEY_PERMIT"];
//           return newItems;
//         });
//       }
//     }

//     setItemsToSendList(items);
//   }, [selectedPurpose]);

//   useEffect(() => {
//     const dateObject = moment(defaultVehicleValues?.yearOfManufacture);
//     setSelectedYearOfManufacture(dateObject);
//   }, []);

//   return (
//     <div>
//       <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12">
//         <InputWrapper outerClassName="sm:col-span-3">
//           <Label id="phone">Type</Label>
//           <Select
//             mode="tags"
//             maxTagCount={1}
//             showSearch={true}
//             value={selectedType}
//             onChange={handleVehicleTypeChange}
//             style={{width: "290px"}}>
//             {vehicleTypes?.map((option) => (
//               <Option key={option} value={option}>
//                 {option}
//               </Option>
//             ))}
//           </Select>
//         </InputWrapper>

//         <InputWrapper outerClassName="sm:col-span-3">
//           <Label id="phone">Category</Label>
//           <Select
//             mode="tags"
//             maxTagCount={1}
//             showSearch={true}
//             value={selectedCategory}
//             onChange={handleVehicleCategoryChange}
//             style={{width: "290px"}}>
//             {vehicleCategories?.map((option) => (
//               <Option key={option} value={option}>
//                 {option}
//               </Option>
//             ))}
//           </Select>
//         </InputWrapper>

//         <InputWrapper outerClassName="sm:col-span-3">
//           <Label id="phone">Make</Label>
//           <Select
//             mode="tags"
//             maxTagCount={1}
//             showSearch={true}
//             value={selectedMake}
//             onChange={handleVehicleMakeChange}
//             style={{width: "290px"}}>
//             {vehicleMakes?.map((option) => (
//               <Option key={option.brand} value={option.brand}>
//                 {option.brand}
//               </Option>
//             ))}
//           </Select>
//         </InputWrapper>
//         <InputWrapper outerClassName="sm:col-span-3">
//           <Label id="phone">Model</Label>
//           <Select
//             mode="tags"
//             maxTagCount={1}
//             showSearch={true}
//             value={selectedModel}
//             onChange={(val) => handleModelChange(val)}
//             style={{width: "290px"}}>
//             {vehicleModels?.map((option, index) => (
//               <Option key={index} value={option}>
//                 {option}
//               </Option>
//             ))}
//           </Select>
//         </InputWrapper>
//         <InputWrapper outerClassName="sm:col-span-3">
//           <Label id="color">Color</Label>
//           <Select
//             showSearch={true}
//             onChange={(val) => {
//               setSelectedColor(val);
//               handleFormSectionChange(sectionIndex, {color: val});
//             }}
//             value={selectedColor}
//             style={{width: "290px"}}>
//             {carColors.map((option) => (
//               <Option key={option} value={option}>
//                 {option}
//               </Option>
//             ))}
//           </Select>
//         </InputWrapper>
//         <InputWrapper outerClassName="sm:col-span-3">
//           <Label id="chassisNumber">Chassis Number</Label>
//           <AntInput
//             onChange={(e) => {
//               handleFormSectionChange(sectionIndex, {
//                 chassisNumber: e.target.value,
//               });
//             }}
//             defaultValue={defaultVehicleValues?.chassisNumber}
//             type="text"
//           />
//         </InputWrapper>
//         <InputWrapper outerClassName="sm:col-span-3">
//           <Label id="prevRegNumber">Previous Reg Number</Label>
//           <AntInput
//             onChange={(e) => {
//               handleFormSectionChange(sectionIndex, {
//                 previousRegNumber: e.target.value,
//               });
//             }}
//             defaultValue={defaultVehicleValues?.prevRegNumber}
//             type="text"
//           />
//         </InputWrapper>
//         <InputWrapper outerClassName="sm:col-span-3">
//           <Label id={`${sectionIndex}-engineNumber`}>Engine Number</Label>
//           <AntInput
//             onChange={(e) => {
//               handleFormSectionChange(sectionIndex, {
//                 engineNumber: e.target.value,
//               });
//             }}
//             defaultValue={defaultVehicleValues?.engineNumber}
//             type="text"
//           />
//         </InputWrapper>
//         <InputWrapper outerClassName="sm:col-span-3">
//           <Label id="engine capacity">Engine Capacity</Label>
//           <Select
//             showSearch={true}
//             value={selectedEngineCapacity}
//             onChange={(val) => {
//               setSelectedEngineCapacity(val);
//               handleFormSectionChange(sectionIndex, {engineCapacity: val});
//             }}
//             style={{width: "290px"}}>
//             {engineCapacity.map((option) => (
//               <Option key={option} value={option}>
//                 {option}
//               </Option>
//             ))}
//           </Select>
//         </InputWrapper>
//         <InputWrapper outerClassName="sm:col-span-3">
//           <Label id={`${sectionIndex}-year`}>Year Of Manufacture</Label>
//           <DatePicker
//             style={{width: "290px"}}
//             value={selectedYearOfManufacture}
//             picker="year"
//             disabledDate={(current) => current && current > moment()}
//             onChange={(val) => {
//               setSelectedYearOfManufacture(val);
//               handleFormSectionChange(sectionIndex, {
//                 yearOfManufacture: val,
//               });
//             }}
//           />
//         </InputWrapper>

//         <InputWrapper outerClassName="sm:col-span-3">
//           <Label id="phone">Purpose</Label>
//           <Select
//             onChange={(val) => handlePurposeChange(val)}
//             value={selectedPurpose}
//             style={{width: "290px"}}>
//             {purpose.map((option) => (
//               <Option key={option} value={option}>
//                 {option}
//               </Option>
//             ))}
//           </Select>
//         </InputWrapper>
//       </div>
//       {selectedPurpose && (
//         <>
//           <p className="text-base my-1">
//             Select Items included in this registration
//           </p>
//           <div className="w-full my-1">
//             {itemsToSendList?.map((item) => (
//               <Checkbox
//                 disabled={item.value === "HACKNEY_PERMIT"}
//                 defaultChecked={itemsToSend?.includes(item.value)}
//                 key={item.label}
//                 value={item.value}
//                 onChange={(e) => handleCheckboxChange(e.target.value)}>
//                 {item.label}
//               </Checkbox>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// const Index: React.FC<{changeOwnership: IVehicleChangeOfOwnershipRequest}> = ({
//   changeOwnership,
// }) => {
//   const [lgas, setLgas] = useState([]);
//   const [newLgas, setNewLgas] = useState([]);
//   const [selectedNewState, setSelectedNewState] = useState(null);
//   const [selectedNewLga, setSelectedNewLga] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [taxIdValidating, setTaxIdValidating] = useState(false);
//   const [taxPayerType, setTaxPayerType] = useState(null);
//   const [newTaxPayerType, setNewTaxPayerType] = useState(null);
//   const [formSectionValues, setFormSectionValues] = useState<Array<any>>([]);
//   const [loading, setLoading] = useState(false);
//   const [taxPayer, setTaxPayer] = useState<ITaxPayer>(
//     changeOwnership?.ownerData
//   );
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedLga, setSelectedLga] = useState("");
//   const userData = useAppSelector((state: RootState) => state.auth);
//   const router = useRouter();

//   const methods = useForm<FormProps>();

//   const {
//     handleSubmit,
//     reset,
//     formState: {errors},
//     watch,
//   } = methods;

//   const onSubmit = async (data: FormProps) => {
//     if (selectedLga) {
//       data.lga = selectedLga;
//     }
//     if (selectedState) {
//       data.state = selectedState;
//     }

//     // if (selectedNewLga) {
//     //   data.new_lga = selectedNewLga;
//     // }
//     // if (selectedNewState) {
//     //   data.new_state = selectedNewState;
//     // }

//     if (taxPayerType === "INDIVIDUAL") {
//       delete data.company;
//       delete data.e_mail;
//       delete data.phone_no;
//     } else {
//       delete data.email;
//       delete data.first_name;
//       delete data.middle_name;
//       delete data.surname;
//       delete data.phone_number;
//     }

//     if (newTaxPayerType === "INDIVIDUAL") {
//       delete data.new_company;
//       delete data.new_e_mail;
//       delete data.new_phone_no;
//     } else {
//       delete data.new_email;
//       delete data.new_first_name;
//       delete data.new_middle_name;
//       delete data.new_surname;
//       delete data.new_phone_number;
//     }

//     const payload = {
//       ownerTin: data.taxId,
//       newOwnerTin: data.new_taxId,
//       requestType: "CHANGE_OF_OWNERSHIP",
//       vehicles: formSectionValues,
//       taxPayerType: taxPayerType,
//       newTaxPayerType: newTaxPayerType,
//       userData: {
//         ...data,
//       },

//       newOwnerData: {
//         //  new owner data
//         first_name: data.new_first_name,
//         surname: data.new_surname,
//         middle_name: data.new_middle_name,
//         email: data.new_email,
//         e_mail: data.new_e_mail,
//         phone_number: data.new_phone_number,
//         phone_no: data.new_phone_no,
//         house_no: data.new_house_no,
//         street: data.new_street,
//         state: data.new_state,
//         lga: data.new_lga,
//         company: data.new_company,
//       },
//     };

//     try {
//       setLoading(true);
//       const {data} = await updateChangeOfOwnershipRequest(
//         payload,
//         changeOwnership.coRequestSlug
//       );

//       toast.success("Vehicle Change of Ownership Request updated successfully");
//       setLoading(false);
//       router.push(`/vehicle-licence/new/${data?.vlRequestSlug}`);
//     } catch (error) {
//       setLoading(false);
//       handleApiError(
//         error,
//         userData,
//         "There was an error updating vehicle Change of Ownership request"
//       );
//     }
//   };

//   const handleStateChange = (stateName) => {
//     setSelectedLga("");
//     const state = stateLga.filter((st) => st.name === stateName)[0];
//     setLgas(state.lgas);
//     setSelectedState(state.name);
//   };

//   const handleNewStateChange = (stateName) => {
//     setSelectedNewLga("");
//     const state = stateLga.filter((st) => st.name === stateName)[0];
//     setNewLgas(state.lgas);
//     setSelectedNewState(state.name);
//   };

//   const handleFormSectionChange = (index, updatedValues) => {
//     setFormSectionValues((prevFormSectionValues) => {
//       const updatedFormSectionValues = [...prevFormSectionValues];
//       const updatedSection = {...updatedFormSectionValues[index]};

//       for (const key in updatedValues) {
//         if (Object.prototype.hasOwnProperty.call(updatedValues, key)) {
//           updatedSection[key] = updatedValues[key];
//         }
//       }

//       updatedFormSectionValues[index] = updatedSection;

//       return updatedFormSectionValues;
//     });
//   };

//   const TaxIdHandler = async (taxId) => {
//     if (taxId.length === 10 && taxId.trim() !== "") {
//       setTaxIdValidating(true);
//       try {
//         const {data} = await fetchKgtin(taxId, taxPayerType);
//         setTaxPayer(data);

//         reset({
//           taxId: changeOwnership.newOwnerTin,
//           first_name: data?.first_name,
//           surname: data?.surname,
//           middle_name: data?.middle_name,
//           company: data?.coy_name,
//           email: data?.email,
//           e_mail: data?.e_mail,
//           phone_number: data?.phone_number,
//           phone_no: data?.phone_no,
//           house_no: data?.house_no,
//           street: data?.street,
//           state: data?.state_of_residence,
//           lga: data?.lga,
//         });
//       } catch (error) {
//         handleApiError(
//           error,
//           userData,
//           "There was an error validating the provided Tax Id "
//         );
//       } finally {
//         setTaxIdValidating(false);
//       }
//     }
//   };

//   const newTaxIdHandler = async (taxId) => {
//     if (taxId.length === 10 && taxId.trim() !== "") {
//       setTaxIdValidating(true);
//       try {
//         const {data} = await fetchKgtin(taxId, newTaxPayerType);
//         setTaxPayer(data);

//         reset({
//           new_taxId: changeOwnership.newOwnerTin,
//           new_first_name: data?.first_name,
//           new_surname: data?.surname,
//           new_middle_name: data?.middle_name,
//           new_company: data?.coy_name,
//           new_email: data?.email,
//           new_e_mail: data?.e_mail,
//           new_phone_number: data?.phone_number,
//           new_phone_no: data?.phone_no,
//           new_house_no: data?.house_no,
//           new_street: data?.street,
//           new_state: data?.state_of_residence,
//           new_lga: data?.lga,
//         });
//       } catch (error) {
//         handleApiError(
//           error,
//           userData,
//           "There was an error validating the provided Tax Id "
//         );
//       } finally {
//         setTaxIdValidating(false);
//       }
//     }
//   };

//   useEffect(() => {
//     const {
//       coy_name: company,
//       first_name,
//       surname,
//       middle_name,
//       email,
//       e_mail,
//       phone_no,
//       phone_number,
//       lga,
//       state,
//       house_no,
//       street,
//       coy_name: new_company,
//       new_first_name,
//       new_surname,
//       new_middle_name,
//       new_email,
//       new_e_mail,
//       new_phone_no,
//       new_phone_number,
//       new_lga,
//       new_state,
//       new_house_no,
//       new_street,
//     } = changeOwnership?.ownerData || {};

//     reset({
//       company,
//       first_name,
//       surname,
//       middle_name,
//       email,
//       e_mail,
//       phone_no,
//       phone_number,
//       lga,
//       state,
//       house_no,
//       street,

//       new_company,
//       new_first_name,
//       new_surname,
//       new_middle_name,
//       new_email,
//       new_e_mail,
//       new_phone_no,
//       new_phone_number,
//       new_lga,
//       new_state,
//       new_house_no,
//       new_street,
//     });
//     setTaxPayer(changeOwnership?.ownerData);
//     setTaxPayerType(changeOwnership?.taxPayerType);
//     setNewTaxPayerType(changeOwnership?.taxPayerType);
//     setSelectedNewLga(changeOwnership?.ownerData?.lga);
//     setSelectedLga(changeOwnership?.ownerData?.lga);
//     setSelectedNewState(changeOwnership?.ownerData?.stateOfResidence || "KOGI");
//     setSelectedState(changeOwnership?.ownerData?.state);
//     setFormSectionValues(

//     );
//   }, [changeOwnership]);

//   const formData = watch(); // This returns an object with all form field values

//   const currentFormItems = [
//     {
//       label: "Name",
//       value:
//         taxPayerType === "INDIVIDUAL"
//           ? `${formData?.first_name} ${formData?.surname}`
//           : `${formData?.company}`,
//     },
//     {
//       label: "Email",
//       value:
//         taxPayerType === "INDIVIDUAL"
//           ? `${formData?.email}`
//           : `${formData?.e_mail}`,
//     },
//     {
//       label: "Phone Number",
//       value:
//         taxPayerType === "INDIVIDUAL"
//           ? `${formData?.phone_number}`
//           : `${formData?.phone_no}`,
//     },

//     {
//       label: "State",
//       value: selectedState,
//     },
//     {
//       label: "Lga",
//       value: selectedLga,
//     },
//     {
//       label: "House No.",
//       value: formData.house_no,
//     },
//     {
//       label: "Street",
//       value: formData.street,
//     },
//   ];

//   const newFormItems = [
//     {
//       label: "Name",
//       value:
//         newTaxPayerType === "INDIVIDUAL"
//           ? `${formData?.new_first_name} ${formData?.new_surname}`
//           : `${formData?.new_company}`,
//     },
//     {
//       label: "Email",
//       value:
//         newTaxPayerType === "INDIVIDUAL"
//           ? `${formData?.new_email}`
//           : `${formData?.new_e_mail}`,
//     },
//     {
//       label: "Phone Number",
//       value:
//         newTaxPayerType === "INDIVIDUAL"
//           ? `${formData?.new_phone_number}`
//           : `${formData?.new_phone_no}`,
//     },

//     {
//       label: "State",
//       value: selectedNewState,
//     },
//     {
//       label: "Lga",
//       value: selectedNewLga,
//     },
//     {
//       label: "House No.",
//       value: formData.new_house_no,
//     },
//     {
//       label: "Street",
//       value: formData.new_street,
//     },
//   ];

//   // Concatenate the arrays to get the FormItems array
//   const formItems = currentFormItems.concat(newFormItems);

//   return (
//     <>
//       {/* confirmation modal begins
//        */}
//       <Modal
//         title="Tax Payer information"
//         isOpen={isModalOpen}
//         closeModal={() => setIsModalOpen(false)}>
//         <div>
//           <p className=" text-justify text-sm mb-3">
//             Please verify that these details provided are accurate as they will
//             be used to update the information in the provided Tax ID
//           </p>
//           <h4 className="font-bold mb-2">Current owner's information</h4>
//           <Descriptions>
//             {currentFormItems.map((item) => (
//               <Descriptions.Item key={item.label} label={item.label}>
//                 {item.value}
//               </Descriptions.Item>
//             ))}
//           </Descriptions>
//           <h4 className="font-bold mb-2">New Owner's information</h4>
//           <Descriptions>
//             {newFormItems.map((item) => (
//               <Descriptions.Item key={item.label} label={item.label}>
//                 {item.value}
//               </Descriptions.Item>
//             ))}
//           </Descriptions>

//           <div className="flex justify-start space-x-2">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               type="button"
//               className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={() => handleSubmit(onSubmit)()}
//               className={`inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                 loading ? "disabled:opacity-50 cursor-not-allowed" : ""
//               }`}
//               disabled={loading}>
//               {loading ? (
//                 <ThreeDots
//                   height="30"
//                   width="30"
//                   radius="5"
//                   color="white"
//                   wrapperClass="button-container-spinner"
//                 />
//               ) : (
//                 "Submit"
//               )}
//             </button>
//           </div>
//         </div>
//       </Modal>
//       {/* confirmation modal ends
//        */}

//       <Spin tip="Validating Tax Id..." spinning={taxIdValidating}>
//         <FormProvider {...methods}>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
//             <div className="space-y-2">
//               {/* current owner's info */}
//               <div className="mb-5">
//                 <p className=" text-base font-bold">
//                   Current Owner's Information
//                 </p>

//                 <div>
//                   <Label id="taxId">Select Tax Payer Type</Label>
//                   <div className="w-full my-1 flex justify-between items-center">
//                     <Radio.Group
//                       defaultValue={taxPayerType}
//                       onChange={(e) => {
//                         setTaxPayerType(e.target.value);
//                         reset(defaultNewTaxPayer);
//                       }}>
//                       {taxPayerTypeList.map((tp) => (
//                         <Radio key={tp.label} value={tp.value}>
//                           {tp.label}
//                         </Radio>
//                       ))}
//                     </Radio.Group>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12">
//                   <InputWrapper outerClassName="sm:col-span-3">
//                     <Label id="taxId">Tax Id</Label>
//                     <Input
//                       disabled={taxIdValidating}
//                       onChange={(e) => TaxIdHandler(e.target.value)}
//                       id="TaxId"
//                       name="TaxId"
//                       type="number"
//                       placeholder="Please enter your tax Id"
//                     />
//                   </InputWrapper>
//                   {taxPayerType === "INDIVIDUAL" ? (
//                     <>
//                       {" "}
//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="name">First Name</Label>
//                         <Input
//                           defaultValue={taxPayer?.first_name}
//                           id="first_name"
//                           name="first_name"
//                           type="text"
//                           readonly
//                         />
//                       </InputWrapper>
//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="middle_name">Middle Name</Label>
//                         <Input
//                           defaultValue={taxPayer?.middle_name}
//                           id="middle_name"
//                           name="middle_name"
//                           type="text"
//                           readonly
//                         />
//                       </InputWrapper>
//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="surname">Last Name</Label>
//                         <Input
//                           defaultValue={taxPayer?.surname}
//                           id="surname"
//                           name="surname"
//                           type="text"
//                           readonly
//                         />
//                       </InputWrapper>
//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="email">Email</Label>
//                         <Input
//                           defaultValue={taxPayer?.email}
//                           id="email"
//                           name="email"
//                           type="text"
//                         />
//                       </InputWrapper>
//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="phone_number">Phone Number</Label>
//                         <Input
//                           defaultValue={taxPayer?.phone_number}
//                           id="phone_number"
//                           name="phone_number"
//                           type="number"
//                         />
//                       </InputWrapper>
//                     </>
//                   ) : (
//                     <>
//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="company">Company / Organization Name</Label>
//                         <Input
//                           id="company"
//                           name="company"
//                           type="text"
//                           readonly
//                         />
//                       </InputWrapper>

//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="email">Email</Label>
//                         <Input
//                           defaultValue={taxPayer?.e_mail}
//                           id="e_mail"
//                           name="e_mail"
//                           type="text"
//                         />
//                       </InputWrapper>
//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="phone_number">Phone Number</Label>
//                         <Input
//                           defaultValue={taxPayer?.phone_no}
//                           id="phone_no"
//                           name="phone_no"
//                           type="number"
//                         />
//                       </InputWrapper>
//                     </>
//                   )}
//                 </div>
//                 <p className=" text-base">Physical Address</p>
//                 <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12">
//                   <InputWrapper outerClassName="sm:col-span-3">
//                     <Label id="house_no">House / Building No</Label>
//                     <Input
//                       defaultValue={taxPayer?.house_no}
//                       id="house_no"
//                       name="house_no"
//                       type="text"
//                     />
//                   </InputWrapper>
//                   <InputWrapper outerClassName="sm:col-span-3">
//                     <Label id="street">Street</Label>
//                     <Input
//                       defaultValue={taxPayer?.street}
//                       id="street"
//                       name="street"
//                       type="text"
//                     />
//                   </InputWrapper>
//                   <InputWrapper outerClassName="sm:col-span-3">
//                     <Label id="state">Select State of Residence</Label>
//                     <Select
//                       showSearch={true}
//                       onChange={(val) => handleStateChange(val)}
//                       value={selectedState}
//                       style={{width: "280px"}}>
//                       {stateLga?.map((option) => (
//                         <Option key={option.code} value={option.name}>
//                           {option.name}
//                         </Option>
//                       ))}
//                     </Select>
//                   </InputWrapper>
//                   <InputWrapper outerClassName="sm:col-span-3">
//                     <Label id="lga">Select LGA of Residence</Label>
//                     <Select
//                       showSearch={true}
//                       value={selectedLga}
//                       onChange={(val) => setSelectedLga(val)}
//                       style={{width: "280px"}}>
//                       {lgas?.map((option) => (
//                         <Option key={option} value={option}>
//                           {option}
//                         </Option>
//                       ))}
//                     </Select>
//                   </InputWrapper>
//                 </div>
//               </div>

//               {/* New owner's info */}
//               <div className="">
//                 <p className=" text-base font-bold mt-10 ">
//                   New Owner's Information
//                 </p>

//                 <div>
//                   <Label id="taxId">Select Tax Payer Type</Label>
//                   <div className="w-full my-1 flex justify-between items-center">
//                     <Radio.Group
//                       defaultValue={newTaxPayerType}
//                       onChange={(e) => {
//                         setNewTaxPayerType(e.target.value);
//                         reset(defaultNewTaxPayer);
//                       }}>
//                       {taxPayerTypeList.map((tp) => (
//                         <Radio key={tp.label} value={tp.value}>
//                           {tp.label}
//                         </Radio>
//                       ))}
//                     </Radio.Group>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12">
//                   <InputWrapper outerClassName="sm:col-span-3">
//                     <Label id="taxId">Tax Id</Label>
//                     <Input
//                       disabled={taxIdValidating}
//                       onChange={(e) => newTaxIdHandler(e.target.value)}
//                       id="new_taxId"
//                       name="new_taxId"
//                       type="number"
//                       placeholder="Please enter your tax Id"
//                     />
//                   </InputWrapper>
//                   {newTaxPayerType === "INDIVIDUAL" ? (
//                     <>
//                       {" "}
//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="first_name">First Name</Label>
//                         <Input
//                           defaultValue={taxPayer?.new_first_name}
//                           id="new_first_name"
//                           name="new_first_name"
//                           type="text"
//                           readonly
//                         />
//                       </InputWrapper>
//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="middle_name">Middle Name</Label>
//                         <Input
//                           defaultValue={taxPayer?.new_middle_name}
//                           id="new_middle_name"
//                           name="new_middle_name"
//                           type="text"
//                           readonly
//                         />
//                       </InputWrapper>
//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="surname">Last Name</Label>
//                         <Input
//                           defaultValue={taxPayer?.new_surname}
//                           id="new_surname"
//                           name="new_surname"
//                           type="text"
//                           readonly
//                         />
//                       </InputWrapper>
//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="email">Email</Label>
//                         <Input
//                           defaultValue={taxPayer?.new_email}
//                           id="new_email"
//                           name="new_email"
//                           type="text"
//                         />
//                       </InputWrapper>
//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="phone_number">Phone Number</Label>
//                         <Input
//                           defaultValue={taxPayer?.new_phone_number}
//                           id="new_phone_number"
//                           name="new_phone_number"
//                           type="number"
//                         />
//                       </InputWrapper>
//                     </>
//                   ) : (
//                     <>
//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="company">Company / Organization Name</Label>
//                         <Input
//                           id="new_company"
//                           name="new_company"
//                           type="text"
//                           readonly
//                         />
//                       </InputWrapper>

//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="email">Email</Label>
//                         <Input
//                           defaultValue={taxPayer?.new_e_mail}
//                           id="new_e_mail"
//                           name="new_e_mail"
//                           type="text"
//                         />
//                       </InputWrapper>
//                       <InputWrapper outerClassName="sm:col-span-3">
//                         <Label id="phone_number">Phone Number</Label>
//                         <Input
//                           defaultValue={taxPayer?.new_phone_no}
//                           id="new_phone_no"
//                           name="new_phone_no"
//                           type="number"
//                         />
//                       </InputWrapper>
//                     </>
//                   )}
//                 </div>
//                 <p className=" text-base">Physical Address</p>
//                 <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12">
//                   <InputWrapper outerClassName="sm:col-span-3">
//                     <Label id="house_no">House / Building No</Label>
//                     <Input
//                       defaultValue={taxPayer?.new_house_no}
//                       id="new_house_no"
//                       name="new_house_no"
//                       type="text"
//                     />
//                   </InputWrapper>
//                   <InputWrapper outerClassName="sm:col-span-3">
//                     <Label id="street">Street</Label>
//                     <Input
//                       defaultValue={taxPayer?.new_street}
//                       id="new_street"
//                       name="new_street"
//                       type="text"
//                     />
//                   </InputWrapper>
//                   <InputWrapper outerClassName="sm:col-span-3">
//                     <Label id="state">Select State of Residence</Label>
//                     <Select
//                       showSearch={true}
//                       onChange={(val) => handleNewStateChange(val)}
//                       value={selectedNewState}
//                       style={{width: "280px"}}>
//                       {stateLga?.map((option) => (
//                         <Option key={option.code} value={option.name}>
//                           {option.name}
//                         </Option>
//                       ))}
//                     </Select>
//                   </InputWrapper>
//                   <InputWrapper outerClassName="sm:col-span-3">
//                     <Label id="lga">Select LGA of Residence</Label>
//                     <Select
//                       showSearch={true}
//                       value={selectedNewLga}
//                       onChange={(val) => setSelectedNewLga(val)}
//                       style={{width: "280px"}}>
//                       {newLgas?.map((option) => (
//                         <Option key={option} value={option}>
//                           {option}
//                         </Option>
//                       ))}
//                     </Select>
//                   </InputWrapper>
//                 </div>
//               </div>

//               <div>
//                 <p className=" text-base">Vehicle(s) Information</p>
//                 {formSectionValues?.map((vehicle, index) => (
//                   <FormSection
//                     defaultVehicleValues={vehicle}
//                     existingItemsToSend={vehicle.itemsToSend}
//                     defaultItemsToSendList={itemsToSend}
//                     purpose={purpose}
//                     engineCapacity={engineCapacity}
//                     carColors={carColors}
//                     vehicles={vehicles}
//                     vehicleTypes={vehicleTypes}
//                     vehicleCategories={vehicleCategories}
//                     handleFormSectionChange={handleFormSectionChange}
//                     key={vehicle?.id}
//                     sectionIndex={index}
//                   />
//                 ))}
//               </div>
//             </div>
//             <div className="flex justify-start space-x-2">
//               <button
//                 onClick={() => {
//                   reset();
//                 }}
//                 type="button"
//                 className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(true)}
//                 className="inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                 Preview
//               </button>
//             </div>
//           </form>
//         </FormProvider>
//       </Spin>
//     </>
//   );
// };
// export default Index;

import React from "react";

export default function () {
  return <div>edit-change-of-vehicle-ownership-form</div>;
}
