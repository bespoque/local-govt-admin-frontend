import React from "react";
import {IStockInList} from "./stock-in.interfaces";
import Link from "next/link";
import moment from "moment";

export const StockInList: React.FC<IStockInList> = ({stockIns}) => {
  if (!stockIns?.length) return;
  return (
    <>
      {stockIns.map((stockIn, i) => (
        <Link legacyBehavior href={`receive/${stockIn.stockInOrderId}`} key={i}>
          <tr
            key={stockIn.id}
            className="odd:bg-gray-100 dark:odd:bg-gray-800  cursor-pointer">
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>
                {moment(stockIn.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
              </span>
            </td>
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{stockIn.stockOut?.stockOutOrderId}</span>
            </td>
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{stockIn.stockInOrderId}</span>
            </td>
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{stockIn.fromLocation?.name}</span>
            </td>
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{stockIn.toLocation?.name}</span>
            </td>
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{stockIn.status}</span>
            </td>
          </tr>
        </Link>
      ))}
    </>
  );
};
