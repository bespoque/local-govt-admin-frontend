import SectionTitle from "components/section-title";
import Widget from "components/social-feed/widget";
import React, {useState} from "react";
import AddPoForm from "components/forms/add-po-form";
import Link from "next/link";
import Modal from "components/modals/modal-1";
import {useSelector} from "react-redux";
import {RootState} from "store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {Select} from "antd";
import {DatePicker} from "antd";

import moment from "moment";
import {Role} from "components/user/user.interface";
import {useProcurements} from "hooks/useProcurements";

const fields: Record<string, string>[] = [
  {
    name: "Create Date",
    key: "Create Date",
  },
  {
    name: "Vendor",
    key: "Vendor",
  },
  {
    name: "Po ID",
    key: "Po ID",
  },
  {
    name: "Status",
    key: "Status",
  },
  {
    name: "Exp Delivery",
    key: "Exp Delivery",
  },
];

const Index: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {procurements: purchasingOrder, loading} = useProcurements();

  const userRole = useSelector((state: RootState) => state.auth.roles)
    .filter((role) => role.active)
    .map((rol) => rol.role);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <React.Fragment>
      <SectionTitle
        title="Manage Purchasing Orders"
        subtitle="Purchasing Orders"
      />

      <div>
        <Modal
          title="Create Purchasing Order"
          isOpen={isModalOpen}
          closeModal={closeModal}>
          <div>
            <AddPoForm closeModal={closeModal} />
          </div>
        </Modal>
      </div>

      <div className="flex  justify-end p-2">
        {userRole.includes(Role.INVENTORY_PROCUREMENT_INITIATOR) && (
          <button
            onClick={openModal}
            className="px-4 py-2 text-xs font-bold text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
            Create PO
          </button>
        )}
      </div>
      <div className="flex justify-between mb-5">
        <InputWrapper outerClassName="sm:col-span-6">
          <Label id="phone">Date</Label>
          <DatePicker
            style={{width: "300px"}}
            onChange={() => console.warn("hi")}
          />
        </InputWrapper>
        <InputWrapper outerClassName="sm:col-span-6">
          <Label id="phone">Vendor</Label>
          <Select
            onChange={() => console.warn("hi")}
            defaultValue={""}
            style={{width: "350px"}}>
            {/* <Option></Option> */}
          </Select>
        </InputWrapper>

        <InputWrapper outerClassName="sm:col-span-6">
          <Label id="phone">Location</Label>
          <Select
            onChange={() => console.warn("hi")}
            defaultValue={""}
            style={{width: "350px"}}>
            {/* <Option></Option> */}
          </Select>
        </InputWrapper>
      </div>

      {loading ? (
        <div className="mt-5">
          <Skeleton count={10} />
        </div>
      ) : (
        <Widget
          title="Striped tables"
          description={
            <span> Use the following examples for striped tables </span>
          }>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left table-auto no-border striped">
              <thead>
                <tr>
                  {fields.map((field, i) => (
                    <th
                      key={i}
                      className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
                      {field.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {purchasingOrder.map((po, i) => (
                  <Link legacyBehavior href={`purchase-order/${po.orderId}`}>
                    <tr
                      key={po.id}
                      className="odd:bg-gray-100 dark:odd:bg-gray-800  cursor-pointer">
                      <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                        <span>
                          {moment(po.createdAt).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                        <span>{po.vendor.name}</span>
                      </td>
                      <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                        <span>{po.orderId}</span>
                      </td>
                      <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                        <span>{po.status}</span>
                      </td>
                      <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                        <span>
                          {moment(po.expectedDate).format("MMMM Do YYYY")}
                        </span>
                      </td>
                    </tr>
                  </Link>
                ))}
              </tbody>
            </table>
          </div>
        </Widget>
      )}
    </React.Fragment>
  );
};

export default Index;
