import SectionTitle from "components/section-title";
import Widget from "components/social-feed/widget";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useDispatch} from "react-redux";
import {useSelector} from "react-redux";
import {RootState} from "store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {DatePicker} from "antd";
import moment from "moment";
import {fetchStockIns} from "slices/actions/stockInActions";

const fields: Record<string, string>[] = [
  {
    name: "Create Date",
    key: "Create Date",
  },

  {
    name: "PO ID",
    key: "PO ID",
  },
  {
    name: "SI ID",
    key: "SI ID",
  },
  {
    name: "Status",
    key: "Status",
  },
  {
    name: "Remarks",
    key: "remarks",
  },
];

const Index: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockIn, setStockIn] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // Fetch data when the component mounts

  useEffect(() => {
    setLoading(true);
    fetchStockIns()
      .then((res) => {
        setLoading(false);
        setStockIn(res.data);
      })
      .catch((err: any) => {
        setLoading(false);
        //log error
      });
  }, [dispatch]);

  const userRole = useSelector((state: RootState) => state.auth.roles)
    .filter((role) => role.active)
    .map((rol) => rol.role);

  return (
    <React.Fragment>
      <SectionTitle title="Stock In" subtitle="Manage Stock In from PO" />
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
                {stockIn.map((so, i) => (
                  <Link
                    legacyBehavior
                    key={so.id}
                    href={`receive-order/${so?.stockInOrderId}`}>
                    <tr className="odd:bg-gray-100 dark:odd:bg-gray-800  cursor-pointer">
                      <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                        <span>
                          {moment(so?.createdAt).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                        <span>{so?.procurement?.orderId}</span>
                      </td>

                      <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                        <span>{so?.stockInOrderId}</span>
                      </td>
                      <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                        <span>{so?.status}</span>
                      </td>
                      <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                        <span>{so?.remarks}</span>
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
