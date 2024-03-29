import SectionTitle from "components/section-title";
import Widget from "components/social-feed/widget";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {Select} from "antd";
import {DatePicker} from "antd";
import {fetchProcurementsByStatus} from "slices/actions/procurementActions";
import moment from "moment";
import {handleApiError} from "helpers/errors";
import {RootState, useAppSelector} from "store";

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
  const [setOutOrders, setSetOutOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const userData = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!userData) return;
    const fetchSentOutPos = async () => {
      try {
        setLoading(true);
        const {data} = await fetchProcurementsByStatus("SENTOUT");
        setSetOutOrders(data);
        setLoading(false);
      } catch (error) {
        handleApiError(error, userData);
      }
    };
    fetchSentOutPos();
  }, [userData]);

  return (
    <React.Fragment>
      <SectionTitle
        title="Manage Sent Out Purchasing Orders"
        subtitle="Sent Out Purchasing Orders"
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
                {setOutOrders.map((po, i) => (
                  <Link
                    legacyBehavior
                    href={`purchase-order/${po.orderId}`}
                    key={po.id}>
                    <tr className="odd:bg-gray-100 dark:odd:bg-gray-800  cursor-pointer">
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
                        <Link legacyBehavior href={`${po.orderId}`}>
                          <span>
                            {moment(po.expectedDate).format("MMMM Do YYYY")}
                          </span>
                        </Link>
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
