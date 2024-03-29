import SectionTitle from "components/section-title";
import Widget from "components/social-feed/widget";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "store";
import {useRouter} from "next/router";

const fields: Record<string, string>[] = [
  {
    name: "Iventory Item",
    key: "Iventory Item",
  },
  {
    name: "Quantity",
    key: "count",
  },
];

const Index: React.FC = () => {
  const router = useRouter();

  const storeName = router?.query?.location;
  const stockByLocation = useSelector((state: RootState) => state.stock).find(
    (stk) => stk.storeName === storeName
  );
  return (
    <React.Fragment>
      <SectionTitle title={stockByLocation?.storeName} subtitle="STOCKS" />

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
              {stockByLocation?.items.map((stock, i) => (
                <tr
                  key={i}
                  className="odd:bg-gray-100 dark:odd:bg-gray-800  cursor-pointer">
                  <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                    <span>{stock["itemType"]}</span>
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                    <span>{stock["count"]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Widget>
    </React.Fragment>
  );
};

export default Index;
