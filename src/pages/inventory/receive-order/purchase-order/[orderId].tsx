import SectionTitle from "components/section-title";
import {UnderlinedTabs} from "components/tabs";
import Widget from "components/social-feed/widget";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Table from "components/tables/custom-table";
import moment from "moment";
import {toast} from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {fetchProcurementsByOrderId} from "slices/actions/procurementActions";
import InfoBlock from "components/user-profile";
import {groupAndAggregateItems} from "functions/utils";
import {useAppSelector} from "store";
import {IProcurement} from "components/procurement/procurement.interface";
import {handleApiError} from "helpers/errors";
import {ThreeDots} from "react-loader-spinner";
import {initiateStockIn} from "slices/actions/stockInActions";
import Notification from "components/notifications";
import {FiAlertCircle} from "react-icons/fi";

const Index: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [reqLoading, setReqLoading] = useState(false);
  const [po, setPo] = useState<IProcurement | null>(null);
  const [itemsCount, setItemsCount] = useState({
    expected: 0,
    received: 0,
  });
  const userData = useAppSelector((state) => state.auth);
  const router = useRouter();
  const orderId = router?.query?.orderId;

  useEffect(() => {
    if (!orderId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchProcurementsByOrderId(orderId);
        setPo(response.data);
        const itemsWithUniqueIds = response.data?.inventoryItems?.filter(
          (inv) => inv.uniqueId !== null
        );
        setItemsCount({
          expected: response.data.inventoryItems.length,
          received: itemsWithUniqueIds?.length,
        });
      } catch (error) {
        handleApiError(error, userData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, userData]);
  // console.log(itemsCount);
  // console.log(po.inventoryItems);

  const inventoryItems = groupAndAggregateItems(po?.inventoryItems);
  let userRoles: any = useAppSelector((state) => state.auth.roles)
    .filter((usr) => usr.active)
    .map((usr) => usr.role);
  userRoles = [...new Set(userRoles.flat())];

  const notifyProps = {
    position: "fixed z-50 top-0 left-0 right-0",
    fullWidth: true,
    notificationClassNames: "bg-yellow-500 text-white",
    notificationIcon: <FiAlertCircle className="w-4 h-4 mr-2 stroke-current" />,
    notificationContent: (
      <span>{`You have pending inventory items without unique IDS. Expected : ${itemsCount.expected} Received: ${itemsCount.received}`}</span>
    ),
  };

  const orderInfoPairs = [
    {label: "Order ID", value: po?.orderId},
    {label: "Description", value: po?.description},
    {label: "Status", value: po?.status},
    {label: "Order Date", value: moment(po?.createdAt).format("MMMM Do YYYY")},
    {
      label: "Sent Out At",
      value: po?.sentOutAt
        ? moment(po?.sentOutAt).format("MMMM Do YYYY")
        : "N/A",
    },
    {
      label: "Expected Date",
      value: po?.expectedDate
        ? moment(po?.expectedDate).format("MMMM Do YYYY")
        : "N/A",
    },
    {
      label: "Verified At",
      value: po?.verifiedAt
        ? moment(po?.verifiedAt).format("MMMM Do YYYY")
        : "N/A",
    },
    {
      label: "Approved At",
      value: po?.approvedAt
        ? moment(po?.approvedAt).format("MMMM Do YYYY")
        : "N/A",
    },
    {
      label: "Delivered At",
      value: po?.deliveredAt
        ? moment(po?.deliveredAt).format("MMMM Do YYYY")
        : "N/A",
    },
    {
      label: "EC Approved At",
      value: po?.ecApprovedAt
        ? moment(po?.ecApprovedAt).format("MMMM Do YYYY")
        : "N/A",
    },
    {label: "Vendor Name", value: po?.vendor?.name},
    {label: "Vendor Phone", value: po?.vendor?.phone},
    {
      label: "Initiator Name",
      value: `${po?.initiator?.firstName} ${po?.initiator?.lastName}`,
    },
    {label: "Initiator Phone", value: po?.initiator?.phone},
    {
      label: "Verifier Name",
      value: `${po?.verifier?.firstName} ${po?.verifier?.lastName}`,
    },
    {label: "Verifier Phone", value: po?.verifier?.phone},
    {
      label: "Approver Name",
      value: `${po?.approver?.firstName} ${po?.approver?.lastName}`,
    },
    {label: "Approver Phone", value: po?.approver?.phone},
  ];

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
  ];

  const createStockIn = async () => {
    try {
      setReqLoading(true);
      const {data} = await initiateStockIn({
        orderId,
        transferType: "PROCUREMENT",
      });
      toast.success("Stock In Request Initiated");
      router.push(`/inventory/receive-order/${data.stockInOrderId}`);
    } catch (error) {
      handleApiError(
        error,
        userData,
        "There was an error initiating a stock in for this order"
      );
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <>
      <SectionTitle
        title="Purchasing Order Details"
        subtitle="View  Purchasing Order"
      />

      {!loading && itemsCount.received !== itemsCount.expected && (
        <Notification {...notifyProps} initialState />
      )}

      {loading ? (
        <div className="mt-5">
          <Skeleton count={6} />
        </div>
      ) : (
        <Widget>
          <div className="flex flex-row items-center justify-start p-4">
            <div className="shrink-0 hidden ml-auto space-x-2 lg:flex">
              {userRoles.includes("INVENTORY_RECEIVE_INITIATOR") && (
                <button
                  onClick={createStockIn}
                  type="submit"
                  className={`inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    reqLoading ? "disabled:opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={reqLoading}>
                  {reqLoading ? (
                    <ThreeDots
                      height="30"
                      width="30"
                      radius="5"
                      color="white"
                      wrapperClass="button-container-spinner"
                    />
                  ) : (
                    "Create Stock In"
                  )}
                </button>
              )}
            </div>
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
