import SectionTitle from "components/section-title";
import Widget from "components/social-feed/widget";
import React from "react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {useRouter} from "next/router";
import {useFetchData} from "hooks/useFetcher";
import moment from "moment";
import {IVehicleChangeOfOwnershipRequest} from "components/vehicle-license/interface";

const fields: Record<string, string>[] = [
  {
    name: "Name",
    key: "name",
  },
  {
    name: "Tax Id",
    key: "Tax Id",
  },
  {
    name: "Request Date",
    key: "Request Date",
  },
  {
    name: "Status",
    key: "Status",
  },
];

const Index: React.FC = () => {
  const {data, isLoading, error} =
    useFetchData<IVehicleChangeOfOwnershipRequest[]>("/change-ownerships");

  const router = useRouter();
  return (
    <React.Fragment>
      <SectionTitle
        title="Manage New Change of Ownership Request"
        subtitle="Change of Ownership Request"
      />

      <div className="flex justify-end p-2">
        <button
          onClick={() =>
            router.push("/vehicle-licence/ownership-change/create")
          }
          className="px-4 py-2 text-xs font-bold text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
          Create New Change of Ownership Request
        </button>
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
                {data?.map((vlr, i) => (
                  <Link
                    key={i}
                    legacyBehavior
                    href={`/vehicle-licence/ownership-change/${vlr.coRequestSlug}`}>
                    <tr className="odd:bg-gray-100 dark:odd:bg-gray-800  cursor-pointer">
                      <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                        <span>{`${
                          vlr?.taxPayerType === "INDIVIDUAL"
                            ? `${vlr?.ownerData?.first_name} ${vlr?.ownerData?.first_name}`
                            : vlr?.ownerData?.coy_name
                        }`}</span>
                      </td>
                      <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                        <span>{vlr.newOwnerTin}</span>
                      </td>
                      <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                        <span>
                          {moment(vlr.createdAt).format("MMMM Do YYYY")}
                        </span>
                      </td>
                      <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                        <span>{vlr.status}</span>
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
