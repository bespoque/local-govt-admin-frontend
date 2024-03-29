import SectionTitle from "components/section-title";
import {UnderlinedTabs} from "components/tabs";
import Widget from "components/social-feed/widget";
import {useRouter} from "next/router";
import {useEffect, useMemo, useState} from "react";
import Table from "components/tables/custom-table";
import {toast} from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import InfoBlock from "components/user-profile";
import {groupAndAggregateItems} from "functions/utils";
import {useAppSelector} from "store";
import {handleApiError} from "helpers/errors";
import AuditStockInForm from "components/stock-in/audit-stock-in-form";
import {
  approveStockIn,
  fetchStockIn,
  verifyStockIn,
} from "slices/actions/stockInActions";
import Modal from "components/modals/modal-1";
import UpdateInventoryItemsForm from "components/stock-in/update-inventory-items-form";
import {stockInOrderInfoPairs} from "components/stock-in/stock-in.constants";
import {StockInActionButtons} from "components/stock-in/StockInActionButtons";

const Index: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [auditModal, setAuditModal] = useState(false);
  const [inventoryItemsModal, setInventoryItemsModal] = useState(false);
  const [loadingApiRequest, setLoadingApiRequest] = useState(false);
  const [stockIn, setStockIn] = useState(null);
  const userData = useAppSelector((state) => state.auth);
  const router = useRouter();
  const StockInOrderId = router?.query?.stockInId;

  useEffect(() => {
    if (!StockInOrderId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchStockIn(StockInOrderId);
        setStockIn(response.data);
      } catch (error) {
        handleApiError(error, userData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [StockInOrderId, userData]);

  const inventoryItems = groupAndAggregateItems(stockIn?.itemsReceived);

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

  const tabs = [
    {
      index: 0,
      title: "Order Info",
      active: true,
      content: <InfoBlock infoPairs={stockInOrderInfoPairs(stockIn)} />,
    },

    {
      index: 1,
      title: "Items Received",
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
  ];

  const verifyStockOutHandler = async () => {
    try {
      setLoadingApiRequest(true);
      const {data} = await verifyStockIn(StockInOrderId);
      toast.success("Stock In verified successfully!");
      setStockIn(data);
    } catch (error) {
      handleApiError(error, userData);
    } finally {
      setLoadingApiRequest(false);
    }
  };

  const approveStockOutHandler = async () => {
    try {
      setLoadingApiRequest(true);
      const {data} = await approveStockIn(StockInOrderId);
      toast.success("Stock In Approved successfully!");
      setStockIn(data);
    } catch (error) {
      handleApiError(error, userData);
    } finally {
      setLoadingApiRequest(false);
    }
  };

  const openAuditModal = () => {
    setAuditModal(true);
  };
  const closeAuditModal = () => {
    setAuditModal(false);
  };

  const openInventoryItemsModal = () => {
    setInventoryItemsModal(true);
  };
  const closeInventoryItemsModal = () => {
    setInventoryItemsModal(false);
  };

  const updateStockIn = (value) => {
    setStockIn(value);
  };

  return (
    <>
      <SectionTitle title="Stock In Details" subtitle="View Stock In Details" />
      {loading ? (
        <div className="mt-5">
          <Skeleton count={6} />
        </div>
      ) : (
        <Widget>
          <div className="flex flex-row items-center justify-start p-4">
            <div className="shrink-0 hidden ml-auto space-x-2 lg:flex"></div>
          </div>
          <StockInActionButtons
            stockIn={stockIn}
            openInventoryModal={openInventoryItemsModal}
            openAuditModal={openAuditModal}
            userRoles={userRoles}
            userPermissions={userPermissions}
            verifyStockOutHandler={verifyStockOutHandler}
            approveStockOutHandler={approveStockOutHandler}
            loadingApiRequest={loadingApiRequest}
          />

          {/* audit modal */}
          <Modal
            title="Audit Stock In"
            isOpen={auditModal}
            closeModal={closeAuditModal}>
            <div>
              <AuditStockInForm
                stockIn={stockIn}
                closeModal={closeAuditModal}
                updateStockInState={updateStockIn}
              />
            </div>
          </Modal>
          {/* audit modal */}

          {/* update inventory items modal */}
          <Modal
            title="Update Inventory Items"
            isOpen={inventoryItemsModal}
            closeModal={closeInventoryItemsModal}>
            <div>
              <UpdateInventoryItemsForm
                closeModal={closeInventoryItemsModal}
                stockIn={stockIn}
                updateStockInState={updateStockIn}
              />
            </div>
          </Modal>
          {/* update inventory itmes modal */}

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
