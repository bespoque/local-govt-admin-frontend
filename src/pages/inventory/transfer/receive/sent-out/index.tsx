import SectionTitle from "components/section-title";
import Widget from "components/social-feed/widget";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {useMyStockOuts} from "hooks/useMyStockOuts";
import {stockOutTableColumns} from "components/stock-out/stock-out.constants";
import {StockOutList} from "components/stock-out/stock-out-list";
import {RootState, useAppSelector} from "store";
import {StockOutStatus} from "components/stock-out/stock-out.interfaces";

const Index: React.FC = () => {
  const userData = useAppSelector((store: RootState) => store.auth);
  const {stockOuts, loading: stockOutsLoading} = useMyStockOuts({
    toLocation: userData.taxOffice?.name,
    status: StockOutStatus.SENTOUT,
  });

  return (
    <React.Fragment>
      <SectionTitle
        title="View Sent Out Transfers"
        subtitle="Sent Out Transfers"
      />
      <div className="flex justify-end p-2"></div>

      {stockOutsLoading ? (
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
                  link={"/inventory/transfer/receive/sent-out"}
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
