import SectionTitle from "components/section-title";
import {UnderlinedTabs} from "components/tabs";
import Widget from "components/social-feed/widget";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Table from "components/tables/custom-table";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import InfoBlock from "components/user-profile";
import {groupAndAggregateItems} from "functions/utils";
import {RootState, useAppSelector} from "store";
import {fetchStockOutByOrderId} from "slices/actions/stockOutActions";
import {handleApiError} from "helpers/errors";
import {IStockOut} from "components/stock-out/stock-out.interfaces";
import {stockOutOrderInfoPairs} from "components/stock-out/stockOrderInfoPairs";
import {toast} from "react-toastify";
import {ThreeDots} from "react-loader-spinner";
import {initiateStockIn} from "slices/actions/stockInActions";
import {Role} from "components/user/user.interface";

const Index: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [reqLoading, setReqLoading] = useState(false);
  const [stockOut, setStockOut] = useState<IStockOut | null>(null);
  const router = useRouter();
  const stockOutOrderId = router?.query?.stockOutOrderId;
  const userData = useAppSelector((state: RootState) => state.auth);

  const userRoles = userData.roles
    .filter((usr) => usr.active)
    .map((usr) => usr.role);

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

  const createStockIn = async () => {
    try {
      setReqLoading(true);
      const {data} = await initiateStockIn({
        stockOutOrderId,
        transferType: "STOCK_OUT",
      });

      toast.success("Stock In request Initiated");
      router.push(`/inventory/transfer/receive/${data.stockInOrderId}`);
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
      <SectionTitle title="Stock Out Details" subtitle="View Stock Out" />
      {loading ? (
        <div className="mt-5">
          <Skeleton count={6} />
        </div>
      ) : (
        <Widget>
          <div className="flex flex-row items-center justify-start p-4">
            <div className="shrink-0 hidden ml-auto space-x-2 lg:flex">
              {userRoles.some((userRole) =>
                [
                  Role.INVENTORY_RECEIVE_INITIATOR,
                  Role.SUPER_ADMIN,
                  Role.ADMIN,
                ].includes(userRole)
              ) && (
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
