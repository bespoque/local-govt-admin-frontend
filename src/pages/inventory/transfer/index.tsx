import SectionTitle from "components/section-title";
import Widget from "components/social-feed/widget";
import React, {useState} from "react";
import AddSoForm from "components/forms/add-so-form";
import Modal from "components/modals/modal-1";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {Select} from "antd";
import {DatePicker} from "antd";
import {stockOutTableColumns} from "components/stock-out/stock-out.constants";
import {useMyStockOuts} from "hooks/useMyStockOuts";
import {StockOutList} from "components/stock-out/stock-out-list";

const Index: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {stockOuts, loading} = useMyStockOuts();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <React.Fragment>
      <SectionTitle title="Manage Stock Outs" subtitle="Stock Outs" />

      <div>
        <Modal
          title="Create Stock Out"
          isOpen={isModalOpen}
          closeModal={closeModal}>
          <div>
            <AddSoForm closeModal={closeModal} />
          </div>
        </Modal>
      </div>

      <div className="flex justify-end p-2">
        <button
          onClick={openModal}
          className="px-4 py-2 text-xs font-bold text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
          Create SO
        </button>
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
          <Label id="phone">Destination</Label>
          <Select
            onChange={() => console.warn("hi")}
            defaultValue={""}
            style={{width: "350px"}}>
            {/* <Option></Option> */}
          </Select>
        </InputWrapper>

        <InputWrapper outerClassName="sm:col-span-6">
          <Label id="phone">Status</Label>
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
                  {stockOutTableColumns.map((field, i) => (
                    <th
                      key={i}
                      className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
                      {field.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <StockOutList
                  stockOuts={stockOuts}
                  link="/inventory/transfer"
                />
              </tbody>
            </table>
          </div>
        </Widget>
      )}
    </React.Fragment>
  );
};

export default Index;
