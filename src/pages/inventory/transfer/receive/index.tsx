import SectionTitle from "components/section-title";
import Widget from "components/social-feed/widget";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {DatePicker} from "antd";
import {stockInTableColumns} from "components/stock-in/stock-in.constants";
import {useMyStockIns} from "hooks/useMyStockIns";
import {StockInList} from "components/stock-in/stock-in-list";

const Index: React.FC = () => {
  const {stockIns, loading} = useMyStockIns();

  return (
    <React.Fragment>
      <SectionTitle
        title="Stock In"
        subtitle="Manage Stock In from Transfers"
      />
      <div className="flex  justify-end p-2"></div>
      <div className="flex justify-between mb-5">
        <InputWrapper outerClassName="sm:col-span-6">
          <Label id="phone">Date</Label>
          <DatePicker
            style={{width: "300px"}}
            onChange={() => console.warn("hi")}
          />
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
                  {stockInTableColumns.map((field, i) => (
                    <th
                      key={i}
                      className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
                      {field.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <StockInList stockIns={stockIns} />
              </tbody>
            </table>
          </div>
        </Widget>
      )}
    </React.Fragment>
  );
};

export default Index;
