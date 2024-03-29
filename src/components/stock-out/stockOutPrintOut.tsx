import React from "react";
import {IInventoryItem} from "components/inventory-item/inventory-item.interface";
import {IStockOut} from "components/stock-out/stock-out.interfaces";
import StockOutSummary from "components/stock-out/stock-out-summary";
import Table from "components/tables/custom-table";
import {groupAndAggregateItems} from "functions/utils";

interface IStockOutPrintOut {
  stockOut: IStockOut;
  stockList: IInventoryItem[];
}

const StockOutPrintOut: React.FC<IStockOutPrintOut> = ({
  stockOut,
  stockList,
}) => {
  if (!stockOut) {
    return null;
  }

  const inventoryItems = groupAndAggregateItems(stockOut?.inventoryItems);

  return (
    <div id="print-content" className="p-4 border border-gray-400">
      <div className="text-xl font-semibold">Stock Out Details</div>
      <div className="mt-4">
        <div className="mb-4">
          <strong>Stock Out ID:</strong> {stockOut.stockOutOrderId}
        </div>
        <div className="mb-4">
          <strong>Source Location:</strong> {stockOut.fromLocation.name}
        </div>
        <div className="mb-4">
          <strong>Destination Location:</strong> {stockOut.toLocation.name}
        </div>
        <div className="mb-4">
          <strong>Status:</strong> {stockOut.status}
        </div>
      </div>
      <div className="mt-8">
        <div className="text-xl font-semibold">Inventory Items</div>
        <Table
          fields={[
            {name: "name", key: "name"},
            {name: "description", key: "description"},
            {name: "quantity", key: "quantity"},
          ]}
          tableData={inventoryItems}
          showTotal={false}
        />
      </div>
    </div>
  );
};

export default StockOutPrintOut;
