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
import ApproveStockOutRequest from "components/forms/approve-sor-form";
import {
  approveStockOut,
  fetchStockOutByOrderId,
  rejectStockOutRequest,
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
import {useFetchData} from "hooks/useFetcher";
import {transferRequestsInfoPairs} from "components/stock-out-request/stock-out-request-order-infor-pairs";
import {IStockOutRequest} from "components/stock-out-request/stock-out-request.interface";
import {mutate} from "swr";
import RoundSpinner from "components/spinners/roundSpinner";

const Index: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [reqLoading, setReqLoading] = useState<boolean>(false);
  const [warnModal, setWarnModal] = useState<boolean>(false);
  const router = useRouter();

  const requestId = router?.query?.incomingRequestId;
  const userData = useAppSelector((state: RootState) => state.auth);

  const {data, isLoading} = useFetchData<IStockOutRequest>(
    `stock-out-requests/${requestId}`
  );

  const inventoryItems = data?.requestItems.map((item) => ({
    name: item.itemTypeId.itemType,
    description: item.itemTypeId.description,
    ...item,
  }));

  const requestInfoPairs = transferRequestsInfoPairs(data);

  const tabs = [
    {
      index: 0,
      title: "Transfer Request Info",
      active: true,
      content: <InfoBlock infoPairs={requestInfoPairs} />,
    },

    {
      index: 1,
      title: "Requested Inventory Items",
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

  const setOpenWarnModal = () => {
    setWarnModal(true);
  };

  const rejectTransferRequest = async () => {
    try {
      setReqLoading(true);
      await rejectStockOutRequest(data.stockOutRequestOrderId);
      mutate(`stock-out-requests/${data.stockOutRequestOrderId}`);
      toast.success("Transfer request rejected successfully");
    } catch (error) {
      handleApiError(
        error,
        userData,
        "There was an error rejecting this transfer request"
      );
    } finally {
      setReqLoading(false);
      setWarnModal(false);
    }
  };

  return (
    <>
      <SectionTitle
        title="Outgoing transfer request details"
        subtitle="View transfer"
      />
      <div className="flex  justify-end p-2">
        {data?.status === "INITIATED" && (
          <button
            onClick={openModal}
            className="px-4 py-2 text-xs font-bold text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
            Approve Transfer Request
          </button>
        )}
        {data?.status === "INITIATED" && (
          <button
            onClick={setOpenWarnModal}
            className="px-4 py-2 text-xs font-bold text-white uppercase bg-red-500 rounded-lg hover:bg-red-600 ml-5">
            Reject
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="mt-5">
          <Skeleton count={6} />
        </div>
      ) : (
        <Widget>
          <div>
            <WarnModal open={warnModal} setOpen={setOpenWarnModal}>
              <div>
                <p className="text-center">
                  Are you sure you want to reject this transfer request?
                </p>
                <div className="mt-4 flex justify-center items-center">
                  <div>
                    <button
                      onClick={() => setWarnModal(false)}
                      className="px-4 py-2 text-xs font-bold border border-blue-500 text-blue-500 uppercase rounded-lg mr-5">
                      Cancel
                    </button>
                  </div>
                  <div>
                    {reqLoading ? (
                      <RoundSpinner />
                    ) : (
                      <button
                        onClick={rejectTransferRequest}
                        className="px-4 py-2 text-xs font-bold border border-red-500 text-red-500 uppercase rounded-lg mr-5">
                        Reject
                      </button>
                    )}
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
          <div>
            <Modal
              title="Approve Transfer Request"
              isOpen={isModalOpen}
              closeModal={closeModal}>
              <div>
                <ApproveStockOutRequest sor={data} closeModal={closeModal} />
              </div>
            </Modal>
          </div>
        </Widget>
      )}
    </>
  );
};

export default Index;
