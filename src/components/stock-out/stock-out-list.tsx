import React from "react";
import {IStockOutList} from "./stock-out.interfaces";
import Link from "next/link";
import moment from "moment";

export const StockOutList: React.FC<IStockOutList> = ({stockOuts, link}) => {
  return (
    <>
      {stockOuts.map((stockOut, i) => (
        <Link
          legacyBehavior
          href={`${link}/${stockOut.stockOutOrderId}`}
          key={i}>
          <tr
            key={stockOut.id}
            className="odd:bg-gray-100 dark:odd:bg-gray-800  cursor-pointer">
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>
                {moment(stockOut.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
              </span>
            </td>
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{stockOut.fromLocation.name}</span>
            </td>
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{stockOut.toLocation.name}</span>
            </td>
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{stockOut.stockOutOrderId}</span>
            </td>
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{stockOut.status}</span>
            </td>
          </tr>
        </Link>
      ))}
    </>
  );
};
