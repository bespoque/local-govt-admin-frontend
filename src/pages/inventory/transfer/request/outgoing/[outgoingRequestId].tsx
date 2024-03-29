import SectionTitle from "components/section-title";
import {UnderlinedTabs} from "components/tabs";
import EditSoForm from "components/forms/edit-so-form";
import Widget from "components/social-feed/widget";
import {useRouter} from "next/router";
import Modal from "components/modals/modal-1";
import {useState} from "react";
import Table from "components/tables/custom-table";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import InfoBlock from "components/user-profile";
import {IStockOut} from "components/stock-out/stock-out.interfaces";
import AuditSOForm from "components/forms/audit-stock-out-form";
import {useFetchData} from "hooks/useFetcher";
import {transferRequestsInfoPairs} from "components/stock-out-request/stock-out-request-order-infor-pairs";
import {IStockOutRequest} from "components/stock-out-request/stock-out-request.interface";
import EditTransferRequestForm from "components/forms/update-transfer-request-form";

const Index: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [auditModal, setAuditModal] = useState(false);
  const [stockOut, setStockOut] = useState<IStockOut | null>(null);
  const router = useRouter();
  const requestId = router?.query?.outgoingRequestId;
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

  const openAuditModal = () => {
    setAuditModal(true);
  };
  const closeAuditModal = () => {
    setAuditModal(false);
  };

  return (
    <>
      <SectionTitle
        title="Outgoing transfer request details"
        subtitle="View transfer"
      />
      {isLoading ? (
        <div className="mt-5">
          <Skeleton count={6} />
        </div>
      ) : (
        <Widget>
          <div className="flex flex-row items-center justify-start p-4">
            <div className="shrink-0 hidden ml-auto space-x-2 lg:flex"></div>
          </div>
          <div className="flex  justify-end p-2">
            {data.status === "INITIATED" && (
              <button
                onClick={openModal}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
                Update Transfer Request
              </button>
            )}
          </div>
          <div className="flex flex-wrap">
            <div className="w-full p-4">
              <UnderlinedTabs tabs={tabs} />
            </div>
          </div>
          {/* update transfer request modal */}
          <div>
            <Modal
              title="Update Transfer Request"
              isOpen={isModalOpen}
              closeModal={closeModal}>
              <div>
                <EditTransferRequestForm sor={data} closeModal={closeModal} />
              </div>
            </Modal>
          </div>
        </Widget>
      )}
    </>
  );
};

export default Index;
