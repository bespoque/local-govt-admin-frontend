import SectionTitle from "components/section-title";
import {UnderlinedTabs} from "components/tabs";
import EditPoForm from "components/forms/edit-po-form";
import Widget from "components/social-feed/widget";
import {useRouter} from "next/router";
import Modal from "components/modals/modal-1";
import {useEffect, useMemo, useState} from "react";
import Table from "components/tables/custom-table";
import {toast} from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  approveProcurement,
  ecApproveProcurement,
  fetchProcurementsByOrderId,
  sendOut,
  verifyProcurement,
} from "slices/actions/procurementActions";
import InfoBlock from "components/user-profile";
import DocPreview from "components/viewers/doc-viewer";
import {groupAndAggregateItems} from "functions/utils";
import {useAppSelector} from "store";
import {IProcurement} from "components/procurement/procurement.interface";
import {handleApiError} from "helpers/errors";
import {ProcurementPrintOut} from "components/procurement/procurementPrintOut";
import {ProcurementActionButtons} from "components/procurement/ProcurementActionButtons";
import {procurementOrderInfoPairs} from "components/procurement/procurementOrderInfoPairs";
import AuditPoForm from "components/forms/audit-po-form";
import FinanceApproveForm from "components/forms/finance-approval-form";

const Index: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [reqLoading, setReqLoading] = useState<boolean>(false);
  const [po, setPo] = useState<IProcurement | null>(null);
  const [auditModal, setAuditModal] = useState(false);
  const [financeModal, setFinanceModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const userData = useAppSelector((state) => state.auth);
  const router = useRouter();
  const orderId = router?.query?.orderId;

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchProcurementsByOrderId(orderId);
        setPo(response.data);
      } catch (error) {
        handleApiError(error, userData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, userData]);

  const inventoryItems = groupAndAggregateItems(po?.inventoryItems);

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

  const orderInfoPairs = procurementOrderInfoPairs(po);

  const tabs = [
    {
      index: 0,
      title: "Order Info",
      active: true,
      content: <InfoBlock infoPairs={orderInfoPairs} />,
    },

    {
      index: 1,
      title: "Inventory Items",
      active: false,
      content: (
        <Table
          fields={[
            {name: "name", key: "name"},
            {name: "description", key: "description"},
            {name: "quantity", key: "quantity"},
            {name: "price per Item", key: "procuredPrice"},
            {name: "procured Price", key: "totalProcuredPrice"},
          ]}
          tableData={inventoryItems}
        />
      ),
    },
    {
      index: 2,
      title: "Uploaded Receipt",
      active: false,
      content: <DocPreview po={po} />,
    },
  ];

  const verifyOrderHandler = async () => {
    if (!orderId) return;
    try {
      setReqLoading(true);
      const {data} = await verifyProcurement(orderId);
      toast.success("Order verified successfully!");
      setPo(data);
    } catch (error) {
      handleApiError(
        error,
        userData,
        "There was an error Verifying the Purchase Order"
      );
    } finally {
      setReqLoading(false);
    }
  };

  const approveOrderHandler = async () => {
    if (!orderId) return;
    try {
      setReqLoading(true);
      const {data} = await approveProcurement(orderId);
      toast.success("Order approved successfully!");
      setPo(data);
    } catch (error) {
      handleApiError(
        error,
        userData,
        "There was an error Approving the purchase order"
      );
    } finally {
      setReqLoading(false);
    }
  };

  const openAuditModal = () => {
    setAuditModal(true);
  };
  const closeAuditModal = () => {
    setAuditModal(false);
  };
  const openFinanceModal = () => {
    setFinanceModal(true);
  };
  const closeFinanceModal = () => {
    setFinanceModal(false);
  };

  const ecApproveOrderHandler = async () => {
    if (!orderId) return;
    try {
      setReqLoading(true);
      const {data} = await ecApproveProcurement(orderId);
      toast.success("Order approved successfully by the EC!");
      setPo(data);
    } catch (error) {
      handleApiError(
        error,
        userData,
        "There was an error EC Approving the purchase order"
      );
    } finally {
      setReqLoading(false);
    }
  };

  const sendOutOrderHandler = async () => {
    if (!orderId) return;
    try {
      setReqLoading(true);
      const {data} = await sendOut(orderId);
      setPo(data);
      handlePrint();
    } catch (error) {
      handleApiError(
        error,
        userData,
        "There was an error Printing the purchase order"
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isPrinting) {
    return <ProcurementPrintOut po={po} />;
  }

  return (
    <>
      <SectionTitle
        title="Purchasing Order Details"
        subtitle="View  Purchasing Order"
      />
      {loading ? (
        <div className="mt-5">
          <Skeleton count={6} />
        </div>
      ) : (
        <Widget>
          <div className="flex flex-row items-center justify-start p-4">
            <div className="shrink-0 hidden ml-auto space-x-2 lg:flex">
              <ProcurementActionButtons
                procurement={po}
                openModal={openModal}
                userRoles={userRoles}
                userPermissions={userPermissions}
                verifyOrderHandler={verifyOrderHandler}
                approveOrderHandler={approveOrderHandler}
                ecApproveOrderHandler={ecApproveOrderHandler}
                sendOutOrderHandler={sendOutOrderHandler}
                reqLoading={reqLoading}
                auditHandler={openAuditModal}
                financeHandler={openFinanceModal}
              />
            </div>
          </div>
          {/* audit modal */}
          <Modal
            title="Audit Purchasing Order"
            isOpen={auditModal}
            closeModal={closeAuditModal}>
            <div>
              <AuditPoForm
                po={po}
                closeModal={closeAuditModal}
                updatePoState={setPo}
              />
            </div>
          </Modal>
          {/* audit modal */}
          {/* finance modal */}
          <Modal
            title="Finance Approval"
            isOpen={financeModal}
            closeModal={closeFinanceModal}>
            <div>
              <FinanceApproveForm
                po={po}
                closeModal={closeFinanceModal}
                updatePoState={setPo}
              />
            </div>
          </Modal>
          {/* audit modal */}
          <div>
            <Modal
              title="Update Purchasing Order"
              isOpen={isModalOpen}
              closeModal={closeModal}>
              <div>
                <EditPoForm
                  setPo={setPo}
                  order={po}
                  items={inventoryItems}
                  closeModal={closeModal}
                />
              </div>
            </Modal>
          </div>
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
