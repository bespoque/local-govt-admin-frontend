import SectionTitle from "components/section-title";
import {UnderlinedTabs} from "components/tabs";
import Widget from "components/social-feed/widget";
import {useRouter} from "next/router";
import Modal from "components/modals/modal-1";
import {useEffect, useMemo, useState} from "react";
import {Table as AntTable} from "antd";
import {toast} from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import InfoBlock from "components/user-profile";
import {useAppSelector} from "store";
import {handleApiError} from "helpers/errors";
import UploadRenewalDocsForm from "components/forms/upload-renewal-licence-form";
import ExternalIdVerification from "components/vehicle-license/external-id-verification";
import {useFetchData} from "hooks/useFetcher";
import {vehicleLicenseInfoPairs} from "components/vehicle-license/vehicleLicenseOrderInfoPairs";
import {IVehicleLicenceRequest} from "components/vehicle-license/interface";
import {ColumnsType} from "antd/es/table";
import moment from "moment";
import {vehicleInfoPairs} from "components/vehicle-license/vehicleInfoPairs";
import {VlrActionButtons} from "components/vehicle-license/vehicleLicenseRequestActions";
import {
  approveVlr,
  printVlrAssessment,
  sendToPrinterHandler,
  verifyVlr,
} from "slices/actions/vehicleLicense";
import {mutate} from "swr";
import {VlrAssessmentPrintout} from "components/vehicle-license/prints/VlrAssessmentPrintout";
import {PRINT_TEMPLATE} from "components/vehicle-license/constants";
import {VehicleLicencePrintoutModal} from "components/vehicle-license/vehicle-licence-printout-modal";
import {A4PrintOut} from "components/vehicle-license/prints/A4PrintOut";
import {
  CardPrintOutFront,
  CardPrintOutBack,
} from "components/vehicle-license/prints/cardPrintOut";
import {HackneyPrintOut} from "components/vehicle-license/prints/HackneyPrintOut";
import {StickerPrintOut} from "components/vehicle-license/prints/StickerPrintout";
import RoundSpinner from "components/spinners/roundSpinner";
import { vehicleIdPairs } from "components/vehicle-license/vehicleIdPairs";

const Index: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [reqLoading, setReqLoading] = useState<boolean>(false);
  const [printTemplate, setPrintTemplate] = useState<PRINT_TEMPLATE>(
    PRINT_TEMPLATE.ASSESSMENT
  );
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [uploadModal, setUploadModal] = useState<boolean>(false);
  const [verifyModal, setVerifyModal] = useState<boolean>(false);
  const [approveModal, setApproveModal] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const userData = useAppSelector((state) => state.auth);
  const router = useRouter();
  const renewLicenseId = router?.query?.renewLicenseId as string;
  const {data, isLoading: loading} = useFetchData<IVehicleLicenceRequest>(
    `/vehicle-licence-requests/${renewLicenseId}`
  );

  let userRoles: any = useAppSelector((state) => state.auth.roles)
    .filter((usr) => usr.active)
    .map((usr) => usr.role);

  userRoles = [...new Set(userRoles.flat())];

  const userPermissions = useMemo(
    () => [
      ...new Set(
        userData.roles
          .filter((usr) => usr.active)
          .flatMap((usr) => usr.permissions)
      ),
    ],
    [userData.roles]
  );

  const orderInfoPairs = vehicleLicenseInfoPairs(data);
  const columns: ColumnsType = [
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      title: "Make",
      dataIndex: "make",
      key: "make",
    },

    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Year",
      dataIndex: "yearOfManufacture",
      key: "yearOfManufacture",
      render: (year) => moment(year).format("YYYY"),
    },
    {
      title: "Chassis Number",
      dataIndex: "chassisNumber",
      key: "chassisNumber",
    },
    {
      title: "Engine Number",
      dataIndex: "engineNumber",
      key: "engineNumber",
    },

    {
      title: "Documents",
      dataIndex: "",
      key: "x",
      render: (e) => (
        <div className="flex justify-around">
          <button
            onClick={() => {
              setCurrentVehicle(e);
              setUploadModal(true);
            }}
            className="px-2 py-2 text-xs font-semibold text-green-500 uppercase ">
            View
          </button>
        </div>
      ),
    },
  ];

  const vehicles = data?.vehicles?.map((veh) => ({
    ...veh,
    key: veh.id,
  }));

  const tabs = [
    {
      index: 0,
      title: "Request Info",
      active: true,
      content: <InfoBlock infoPairs={orderInfoPairs} />,
    },

    {
      index: 1,
      title: "Vehicle(s)",
      active: false,
      content: (
        <AntTable
          expandable={{
            expandedRowRender: (record) => (
              <>
                <InfoBlock
                  infoPairs={vehicleInfoPairs(record.vehicleLicence)}
                  datasource={vehicleIdPairs(record)}
                />
                <ExternalIdVerification
                  vlrId={renewLicenseId}
                  requestStatus={data?.status}
                  vehicle={record}
                />
              </>
            ),
            rowExpandable: (record: any) =>
              record.createdAt !== "Not Expandable",
          }}
          columns={columns}
          dataSource={vehicles}
        />
      ),
    },
  ];

  const createAssessmentHandler = async () => {
    if (!renewLicenseId) return;
    try {
      setReqLoading(true);
      await printVlrAssessment(renewLicenseId);
      mutate(`/vehicle-licence-requests/${renewLicenseId}`);
      toast.success("Assessment Created Successfully!");
    } catch (error) {
      handleApiError(
        error,
        userData,
        "There was an error creating the Assessment"
      );
    } finally {
      setReqLoading(false);
    }
  };

  const verifyHandler = async () => {
    if (!renewLicenseId) return;
    try {
      setReqLoading(true);
      await verifyVlr(renewLicenseId);
      mutate(`/vehicle-licence-requests/${renewLicenseId}`);
      toast.success("Request has been Verified Successfully!");
      setVerifyModal(false);
    } catch (error) {
      handleApiError(
        error,
        userData,
        "There was an error verifying the request"
      );
    } finally {
      setReqLoading(false);
    }
  };

  const approveHandler = async () => {
    if (!renewLicenseId) return;
    try {
      setReqLoading(true);
      await approveVlr(renewLicenseId);
      mutate(`/vehicle-licence-requests/${renewLicenseId}`);
      toast.success("Request has been Verified Successfully!");
      setApproveModal(false);
    } catch (error) {
      handleApiError(
        error,
        userData,
        "There was an error approving the request"
      );
    } finally {
      setReqLoading(false);
    }
  };

  const printTemplateHandler = async (template: PRINT_TEMPLATE) => {
    if (!renewLicenseId) return;
    try {
      setReqLoading(true);
      await sendToPrinterHandler(renewLicenseId);
      setPrintTemplate(template);
      mutate(`/vehicle-licence-requests/${renewLicenseId}`);
      handlePrint();
    } catch (error) {
      handleApiError(
        error,
        userData,
        "There was an error Printing the Licence"
      );
    } finally {
      setReqLoading(false);
    }
  };

  // Add an event listener for the "afterprint" event
  useEffect(() => {
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
    });
  };

  // Function to handle the "afterprint" event
  const handleAfterPrint = () => {
    setIsPrinting(false);
  };

  const closeUploadModal = () => {
    setUploadModal(false);
    mutate(`/vehicle-licence-requests/${renewLicenseId}`);
  };

  const openPrintModal = () => {
    setIsPrintModalOpen(true);
  };

  const closePrintModal = () => {
    setIsPrintModalOpen(false);
  };

  if (isPrinting) {
    switch (printTemplate) {
      case PRINT_TEMPLATE.ASSESSMENT:
        return <VlrAssessmentPrintout vlr={data} />;
      case PRINT_TEMPLATE.A4:
        return <A4PrintOut v={currentVehicle} vlr={data} owner={data?.ownerData} 
        insurance="" insurancePolicy=""
            type={data?.taxPayerType} />;
      case PRINT_TEMPLATE.CARD_FRONT:
        return (
          <CardPrintOutFront
            v={currentVehicle}
            owner={data.ownerData}
            type={data.taxPayerType}
          />
        );
      case PRINT_TEMPLATE.CARD_BACK:
        return (
          <CardPrintOutBack
            v={currentVehicle}
            owner={data.ownerData}
            type={data.taxPayerType}
          />
        );
      case PRINT_TEMPLATE.HACKNEY_PERMIT:
        return <HackneyPrintOut v={currentVehicle} />;
      case PRINT_TEMPLATE.STICKER:
        return <StickerPrintOut v={currentVehicle} />;
      default:
        return <VlrAssessmentPrintout vlr={data} />;
    }
  }

  return (
    <>
      <SectionTitle
        title="Vehicle Licence Request"
        subtitle="View Vehicle Licence Request Details"
      />
      {loading ? (
        <div className="mt-5">
          <Skeleton count={6} />
        </div>
      ) : (
        <Widget>
          <div className="flex flex-row items-center justify-start p-4">
            <div className="shrink-0 hidden ml-auto space-x-2 lg:flex">
              <VlrActionButtons
                vlr={data}
                userRoles={userRoles}
                userPermissions={userPermissions}
                createAssessmentHandler={createAssessmentHandler}
                printAssessmentHandler={handlePrint}
                verifyHandler={() => setVerifyModal(true)}
                approveHandler={() => setApproveModal(true)}
                sendToPrinterHandler={openPrintModal}
                reqLoading={reqLoading}
              />
            </div>
          </div>
          <Modal
            title="Upload supporting documents"
            isOpen={uploadModal}
            closeModal={closeUploadModal}>
            <div>
              <UploadRenewalDocsForm
                vlrId={renewLicenseId}
                vehicleLicence={currentVehicle?.vehicleLicence}
                closeModal={closeUploadModal}
              />
            </div>
          </Modal>
          <Modal
            title="Print Items"
            isOpen={isPrintModalOpen}
            closeModal={closePrintModal}>
            <div>
              <VehicleLicencePrintoutModal
                vehicleLicenseRequest={data}
                closeModal={closePrintModal}
                printTemplateHandler={printTemplateHandler}
                setCurrentVehicle={setCurrentVehicle}
                currentVehicle={currentVehicle}
                currentVehicleData={vehicleIdPairs(currentVehicle)}
                loading={reqLoading}
              />
            </div>
          </Modal>

          <Modal
            title="Verify Licence Request"
            isOpen={verifyModal}
            closeModal={() => setVerifyModal(false)}>
            <div>
              <p className="text-justify">
                Please confirm that you have done your due diligence in
                verifying that the information provided for the vehicle(s)
                Licence request
              </p>
              <div className="mt-4 flex justify-center items-center">
                <div className="flex">
                  <button
                    onClick={() => setVerifyModal(false)}
                    className="px-4 py-2 text-xs font-bold border border-red-500 text-red-500 uppercase rounded-lg mr-5">
                    No, I have not
                  </button>
                  {reqLoading ? (
                    <RoundSpinner />
                  ) : (
                    <button
                      onClick={verifyHandler}
                      className="px-4 py-2 text-xs font-bold text-white uppercase bg-green-500 rounded-lg hover:bg-green-600">
                      Yes, I have
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Modal>
          <Modal
            title="Approve Licence Request"
            isOpen={approveModal}
            closeModal={() => setApproveModal(false)}>
            <div>
              <p className="text-justify">
                Please confirm that you have done your due diligence in
                verifying that the information provided for the vehicle(s)
                Licence request
              </p>
              <div className="mt-4 flex justify-center items-center">
                <div className="flex">
                  <button
                    onClick={() => setApproveModal(false)}
                    className="px-4 py-2 text-xs font-bold border border-red-500 text-red-500 uppercase rounded-lg mr-5">
                    No, I have not
                  </button>
                  {reqLoading ? (
                    <RoundSpinner />
                  ) : (
                    <button
                      onClick={approveHandler}
                      className="px-4 py-2 text-xs font-bold text-white uppercase bg-green-500 rounded-lg hover:bg-green-600">
                      Yes, I have
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Modal>
          <div className="flex flex-wrap">
            <div className="w-full p-4">
              <UnderlinedTabs tabs={tabs} />
            </div>
          </div>
        </Widget>
      )}
    </>
  );
};

export default Index;
