import SectionTitle from "components/section-title";
import {UnderlinedTabs} from "components/tabs";
import EditSoForm from "components/forms/edit-so-form";
import Widget from "components/social-feed/widget";
import {useRouter} from "next/router";
import Modal from "components/modals/modal-1";
import {useEffect, useMemo, useState} from "react";
import Table from "components/tables/custom-table";
import WarnModal from "components/modals/warn-modal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import InfoBlock from "components/user-profile";
import {groupAndAggregateItems} from "functions/utils";
import {RootState, useAppSelector} from "store";
import {
  approveStockOut,
  fetchStockOutByOrderId,
  sendOutStockOut,
  verifyStockOut,
} from "slices/actions/stockOutActions";
import {handleApiError} from "helpers/errors";
import {IStockOut} from "components/stock-out/stock-out.interfaces";
import {stockOutOrderInfoPairs} from "components/stock-out/stockOrderInfoPairs";
import {StockOutActionButtons} from "components/stock-out/StockOutActionButtons";
import {toast} from "react-toastify";
import StockOutPrintOut from "components/stock-out/stockOutPrintOut";
import {useMyStock} from "hooks/useMyStock";
import AuditSOForm from "components/forms/audit-stock-out-form";

const Index: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [openResetModal, setOpenResetModal] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingApiRequest, setLoadingApiRequest] = useState<boolean>(false);
  const [auditModal, setAuditModal] = useState(false);
  const [stockOut, setStockOut] = useState<IStockOut | null>(null);
  const router = useRouter();
  const stockOutOrderId = router?.query?.stockOutOrderId;
  const userData = useAppSelector((state: RootState) => state.auth);
  const {stockList, loading: stockLoading} = useMyStock();
  const fullAvailableStock = useMemo(
    () =>
      stockOut?.inventoryItems && [...stockOut.inventoryItems, ...stockList],
    [stockList, stockOut?.inventoryItems]
  );

  const userRoles = userData.roles
    .filter((usr) => usr.active)
    .map((usr) => usr.role);

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

  useEffect(() => {
    if (!stockOutOrderId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchStockOutByOrderId(stockOutOrderId);
        setStockOut(response.data);
      } catch (error) {
        handleApiError(error, userData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stockOutOrderId, userData]);

  const inventoryItems = groupAndAggregateItems(stockOut?.inventoryItems);

  const orderInfoPairs = stockOutOrderInfoPairs(stockOut);

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
          ]}
          tableData={inventoryItems}
          showTotal={false}
        />
      ),
    },
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const verifyStockOutHandler = useMemo(() => {
    return async () => {
      try {
        setLoadingApiRequest(true);
        const {data} = await verifyStockOut(stockOutOrderId);
        setStockOut(data);
        toast.success("Stock Out Verified successfully!");
      } catch (error) {
        handleApiError(
          error,
          userData,
          "There was an error Verifying the Stock Out"
        );
      } finally {
        setLoadingApiRequest(false);
      }
    };
  }, [stockOutOrderId, userData]);

  const approveStockOutHandler = useMemo(() => {
    return async () => {
      try {
        setLoadingApiRequest(true);
        const {data} = await approveStockOut(stockOutOrderId);
        setStockOut(data);
        toast.success("Stock Out Approved successfully!");
      } catch (error) {
        handleApiError(
          error,
          userData,
          "There was an error Approving the Stock Out"
        );
      } finally {
        setLoadingApiRequest(false);
      }
    };
  }, [stockOutOrderId, setLoadingApiRequest, userData]);

  const sendOutStockOutHandler = useMemo(() => {
    const handler = async () => {
      try {
        if (!stockOutOrderId) return;
        setLoadingApiRequest(true);
        const {data} = await sendOutStockOut(stockOutOrderId);
        setStockOut(data);
        handlePrint();
      } catch (error) {
        handleApiError(
          error,
          userData,
          "There was an error printing the Stock Out"
        );
      } finally {
        setLoadingApiRequest(false);
      }
    };

    return handler;
  }, [stockOutOrderId, setLoadingApiRequest, userData]);

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

  const openAuditModal = () => {
    setAuditModal(true);
  };
  const closeAuditModal = () => {
    setAuditModal(false);
  };

  const handleAfterPrint = () => {
    setIsPrinting(false);
  };

  if (isPrinting) {
    return (
      <StockOutPrintOut stockOut={stockOut} stockList={fullAvailableStock} />
    );
  }

  return (
    <>
      <SectionTitle title="Stock Out Details" subtitle="View Stock Out" />
      {loading || stockLoading ? (
        <div className="mt-5">
          <Skeleton count={6} />
        </div>
      ) : (
        <Widget>
          <StockOutActionButtons
            stockOut={stockOut}
            openModal={openModal}
            userRoles={userRoles}
            userPermissions={userPermissions}
            verifyStockOutHandler={verifyStockOutHandler}
            approveStockOutHandler={approveStockOutHandler}
            sendOutStockOutHandler={sendOutStockOutHandler}
            loadingApiRequest={loadingApiRequest}
            auditModal={openAuditModal}
          />
          <div>
            <WarnModal open={openResetModal} setOpen={setOpenResetModal}>
              <div>
                <p className="text-center">
                  Are you sure you want to reset this user's password?
                </p>
                <div className="mt-4 flex justify-center items-center">
                  <div>
                    <button
                      onClick={() => setOpenResetModal(false)}
                      className="px-4 py-2 text-xs font-bold border border-blue-500 text-blue-500 uppercase rounded-lg mr-5">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </WarnModal>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full p-4">
              <UnderlinedTabs tabs={tabs} />
            </div>
          </div>
          {/* audit modal */}
          <Modal
            title="Audit Stock Out"
            isOpen={auditModal}
            closeModal={closeAuditModal}>
            <div>
              <AuditSOForm
                so={stockOut}
                closeModal={closeAuditModal}
                updateSoState={setStockOut}
              />
            </div>
          </Modal>
          {/* audit modal */}
          <div>
            <Modal
              title="Update StockOut"
              isOpen={isModalOpen}
              closeModal={closeModal}>
              <div>
                <EditSoForm
                  updateStockOutState={setStockOut}
                  stockOut={stockOut}
                  closeModal={closeModal}
                />
              </div>
            </Modal>
          </div>
        </Widget>
      )}
    </>
  );
};

export default Index;
