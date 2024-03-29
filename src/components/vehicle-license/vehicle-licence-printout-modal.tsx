import React, {useEffect, useState} from "react";
import {PRINT_TEMPLATE} from "./constants";
import {IVehicleLicenceRequest, VL_ITEMS, IVehicle} from "./interface";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {Select} from "antd";
const {Option} = Select;

interface IdPair {
  label?: string;
  value?: string;
}

interface FormProps {
  printTemplateHandler: (template: PRINT_TEMPLATE) => void;
  closeModal: () => void;
  vehicleLicenseRequest: IVehicleLicenceRequest;
  setCurrentVehicle: (vehicle: IVehicle) => void;
  currentVehicle: IVehicle;
  currentVehicleData?: IdPair[];
  loading: boolean;
}
export const VehicleLicencePrintoutModal: React.FC<FormProps> = ({
  closeModal,
  printTemplateHandler,
  vehicleLicenseRequest,
  setCurrentVehicle,
  currentVehicle,
  currentVehicleData,
  loading,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>(
    vehicleLicenseRequest?.vehicles[0]?.chassisNumber
  );

  useEffect(() => {
    if (
      !selectedVehicle ||
      !setCurrentVehicle ||
      !vehicleLicenseRequest?.vehicles
    )
      return;

    const vehicle = vehicleLicenseRequest.vehicles.find(
      (licence) => licence.chassisNumber === selectedVehicle
    );
    setSelectedVehicle(vehicle?.chassisNumber);
    setCurrentVehicle(vehicle);
  }, [selectedVehicle, setCurrentVehicle, vehicleLicenseRequest.vehicles]);

  if (!closeModal || !printTemplateHandler || !vehicleLicenseRequest)
    return null;

  const handleVehicleChange = (val) => {
    setSelectedVehicle(val);
  };

  return (
    <div className="flex flex-col justify-between items-start">
      <InputWrapper outerClassName=" mb-10">
        <Label id="phone">Select Vehicle Chassis Number</Label>
        <Select
          value={selectedVehicle}
          onChange={handleVehicleChange}
          style={{width: "300px"}}>
          {vehicleLicenseRequest.vehicles.map((option) => (
            <Option key={option.chassisNumber} value={option.chassisNumber}>
              {option.chassisNumber}
            </Option>
          ))}
        </Select>
      </InputWrapper>
      {selectedVehicle && (
        <>
          <div className="flex flex-row justify-between w-full mb-10">
            {currentVehicle?.vehicleLicence?.itemsToSend?.includes(
              VL_ITEMS.LICENCE
            ) && (
              <div className="flex flex-col justify-between items-center w-full">
                <button
                  className={`inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? "disabled:opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                  onClick={() => {
                    printTemplateHandler(PRINT_TEMPLATE.A4);
                  }}>
                  Print A4 paper
                </button>
              </div>
            )}
            {currentVehicle?.vehicleLicence?.itemsToSend?.includes(
              VL_ITEMS.LICENCE
            ) && (
              <div className="flex flex-col justify-between items-center w-full">
                <button
                  className={`inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? "disabled:opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                  onClick={() => {
                    printTemplateHandler(PRINT_TEMPLATE.CARD_FRONT);
                  }}>
                  Print Card Front
                </button>
              </div>
            )}
            {currentVehicle?.vehicleLicence?.itemsToSend?.includes(
              VL_ITEMS.LICENCE
            ) && (
              <div className="flex flex-col justify-between items-center w-full">
                <button
                  className={`inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? "disabled:opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                  onClick={() => {
                    printTemplateHandler(PRINT_TEMPLATE.CARD_BACK);
                  }}>
                  Print Card Back
                </button>
              </div>
            )}

            {currentVehicle?.vehicleLicence?.itemsToSend?.includes(
              VL_ITEMS.LICENCE
            ) && (
              <div className="flex flex-col justify-between items-center w-full">
                <button
                  className={`inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? "disabled:opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                  onClick={() => {
                    printTemplateHandler(PRINT_TEMPLATE.STICKER);
                  }}>
                  Print Sticker
                </button>
              </div>
            )}

            {currentVehicle?.vehicleLicence?.itemsToSend?.includes(
              VL_ITEMS.HACKNEY_PERMIT
            ) && (
              <div className="flex flex-col justify-between items-center w-full">
                <button
                  className={`inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? "disabled:opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                  onClick={() => {
                    printTemplateHandler(PRINT_TEMPLATE.HACKNEY_PERMIT);
                  }}>
                  Print Hackney Permit
                </button>
              </div>
            )}
          </div>

          <div className=" w-full grid grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-3 gap-10 space-x-2 ">
            {currentVehicleData?.map((pair, index) => {
              return (
                <div key={index} className="flex flex-wrap items-start">
                  <span className="font-normal w-auto mr-3">{pair.label}:</span>
                  <span className="w-auto">{pair.value}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
      <div className="flex mt-5 justify-start space-x-2">
        <button
          onClick={() => {
            closeModal();
          }}
          type="button"
          className=" px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Cancel
        </button>
      </div>
    </div>
  );
};
