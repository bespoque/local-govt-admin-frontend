import React, {useState} from "react";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {useAppSelector} from "store";
import {toast} from "react-toastify";
import {ThreeDots} from "react-loader-spinner";
import {handleApiError} from "helpers/errors";

import {
  IVehicle,
  VehicleLicenceStatus,
} from "components/vehicle-license/interface";
import {FormProvider, useForm} from "react-hook-form";
import {verifyExternalIds} from "slices/actions/vehicleLicense";
import {mutate} from "swr";

interface IVerifyExternalIds {
  requestStatus: VehicleLicenceStatus;
  vehicle: IVehicle;
  vlrId: string;
}

export type FormProps = {
  insuranceId: string;
  roadWorthinessId: string;
};

const Index: React.FC<IVerifyExternalIds> = ({
  requestStatus,
  vehicle,
  vlrId,
}) => {
  const methods = useForm<FormProps>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userData = useAppSelector((state) => state.auth);

  if (
    !vlrId ||
    !vehicle ||
    ![
      VehicleLicenceStatus.APPROVED,
      VehicleLicenceStatus.EXTERNAL_IDS_APPROVED,
    ].includes(requestStatus)
  )
    return null;

  const {
    handleSubmit,
    reset,
    formState: {errors},
    register,
  } = methods;

  const onSubmit = async (payload: FormProps) => {
    try {
      setIsLoading(true);
      await verifyExternalIds({
        data: payload,
        vehicleId: vehicle.id,
        requestId: vlrId,
      });
      toast.success("External Ids updated successfully");
      mutate(`/vehicle-licence-requests/${vlrId}`);
    } catch (error) {
      handleApiError(error, userData);
    } finally {
      setIsLoading(false);
    }
  };

  const externalLink = (link) => {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {link}
      </a>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col justify-around items-start mt-10 border-y-4 p-4">
          <Label>
            <b>Verify External Ids</b>
          </Label>
          <div className="flex justify-around items-center mt-5 w-full">
            <InputWrapper outerClassName="sm:col-span-3">
              <Label id="name-insuranceId">Insurance Id</Label>
              <input
                className="border rounded-sm p-1"
                type="text"
                id="insuranceId"
                {...register("insuranceId", {
                  value: vehicle.insuranceId,
                })}
              />

              <Label>
                <i>Verify Id on {externalLink("https://niip.ng/")}</i>
              </Label>
            </InputWrapper>
            <InputWrapper outerClassName="sm:col-span-3">
              <Label id="name-roadWorthinessId">
                Road Worthiness receipt number
              </Label>
              <input
                className="border rounded-sm p-1"
                type="text"
                id="roadWorthinessId"
                {...register("roadWorthinessId", {
                  value: vehicle.roadWorthinessId,
                })}
              />
            </InputWrapper>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="submit"
            className={`inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? "disabled:opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}>
            {isLoading ? (
              <ThreeDots
                height="30"
                width="30"
                radius="5"
                color="white"
                wrapperClass="button-container-spinner"
              />
            ) : requestStatus === VehicleLicenceStatus.APPROVED ? (
              "Save"
            ) : (
              "Update"
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default Index;
