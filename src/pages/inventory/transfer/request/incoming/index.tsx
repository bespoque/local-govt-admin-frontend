import SectionTitle from "components/section-title";
import Widget from "components/social-feed/widget";
import React, {useState} from "react";
import AddPoForm from "components/forms/add-po-form";
import Link from "next/link";
import Modal from "components/modals/modal-1";
import {useSelector} from "react-redux";
import {RootState, useAppSelector} from "store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {Select} from "antd";
import {DatePicker} from "antd";

import moment from "moment";
import {Role} from "components/user/user.interface";
import {useFetchData} from "hooks/useFetcher";
import {IStockOutRequest} from "components/stock-out-request/stock-out-request.interface";

const fields: Record<string, string>[] = [
  {
    name: "Request Id",
    key: "Request Id",
  },
  {
    name: "Date of Request",
    key: "Date of Request",
  },
  {
    name: "Request From",
    key: "Request From",
  },
  {
    name: "Request By",
    key: "Request By",
  },
  {
    name: "Status",
    key: "Status",
  },
];

const Index: React.FC = () => {
  const userData = useAppSelector((state) => state.auth);
  const params = {
    requestFrom: userData.taxOffice.name,
  };

  const {data, isLoading} = useFetchData<IStockOutRequest[]>(
    `stock-out-requests`,
    params
  );

  return (
    <React.Fragment>
      <SectionTitle
        title="Manage Incoming Transfer Requests"
        subtitle="Incoming Transfer Requests"
      />

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

      {isLoading ? (
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
                {data &&
                  data.map((sor, i) => (
                    <Link
                      legacyBehavior
                      href={`/inventory/transfer/request/incoming/${sor.stockOutRequestOrderId}`}>
                      <tr
                        key={sor.id}
                        className="odd:bg-gray-100 dark:odd:bg-gray-800  cursor-pointer">
                        <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                          <span>{sor.stockOutRequestOrderId}</span>
                        </td>
                        <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                          <span>
                            {moment(sor.createdAt).format(
                              "MMMM Do YYYY, h:mm:ss a"
                            )}
                          </span>
                        </td>
                        <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                          <span>{sor.requestFrom.value}</span>
                        </td>
                        <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                          <span>{sor.requestBy.value}</span>
                        </td>
                        <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                          <span>{sor.status}</span>
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
