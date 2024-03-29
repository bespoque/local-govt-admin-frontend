import React from "react";
import {IInventoryItem} from "components/inventory-item/inventory-item.interface";
import {IStockOut} from "components/stock-out/stock-out.interfaces";
import StockOutSummary from "components/stock-out/stock-out-summary";
import {IProcurement} from "components/procurement/procurement.interface";
import Table from "components/tables/custom-table";
import {groupAndAggregateItems} from "functions/utils";
import moment from "moment";
import {numberToWordsWithAnd} from "functions/numbers";

interface IProcurementPrintOut {
  po: IProcurement;
}

export const ProcurementPrintOut: React.FC<IProcurementPrintOut> = ({po}) => {
  if (!po) {
    return null;
  }
  const inventoryItems = groupAndAggregateItems(po?.inventoryItems);

  return (
    <>
      <div className="bg-gray-400 text-white p-2 font-semibold">
        <div className="w-full flex justify-between">
          <div className="" style={{color: "yellow"}}>
            <h1 className="text-lg font-bold">
              KOGI STATE INTERNAL <br /> REVENUE SERVICE
            </h1>
            <p className="text-sm mt-2">
              1 Beach/Marine Road, Lokoja - Kogi State
            </p>
          </div>

          <div>
            <img src="/logos/kgirs.png" alt="" width={35} height={30} />
          </div>

          <div className="text-white">
            <h1 className="font-bold text-lg">PURCHASE ORDER</h1>
            <h6 className="text-sm">PO#: {po?.orderId} </h6>
            <h6 className="text-sm">
              Date: {moment(po?.createdAt).format("DD/MM/YYYY")}
            </h6>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="w-1/2">
            <h2>Purchase Order to : </h2>
            <p className=""> {`${po?.vendor?.name}`}</p>
          </div>
          <div className="w-1/2">
            <h2>Ship to : </h2>
            <p className="">
              Kogi State Internal Revenue Service <br />
              I beach/Marine Road Lokoja - Kogi State <br />
              9087654321 <br />
              procurement@irs.kg.gov.ng
            </p>
          </div>
        </div>
      </div>
      <div id="print-content" className="p-4 border border-gray-400">
        <div className="mt-8">
          <div className="text-xl font-semibold">Inventory Items</div>
          <Table
            fields={[
              {name: "name", key: "name"},
              {name: "quantity", key: "quantity"},
              {name: "price per Item", key: "procuredPrice"},
              {name: "procured Price", key: "totalProcuredPrice"},
            ]}
            tableData={inventoryItems}
          />
        </div>
        <div className="mt-4">
          <h6>For KGIRS</h6>
          <h6>Name: _________________________________</h6>
          <h6>Designation: _________________________________</h6>
        </div>
      </div>
    </>
  );
};
