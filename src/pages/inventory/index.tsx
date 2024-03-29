import SectionTitle from "components/section-title";
import Widget from "components/social-feed/widget";
import countries from "constants/countries.json";
import {formatNumber} from "functions/numbers";
import React, {useEffect, useState} from "react";
import AddUserForm from "components/forms/add-user-form";
import {CountriesProps} from "../default-tables";
import Link from "next/link";
import Modal from "components/modals/modal-1";
import {fetchUsers} from "slices/actions/userActions";
import {updateUsers} from "slices/users";
import {useDispatch} from "react-redux";
import {useSelector} from "react-redux";
import {RootState} from "store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const fields: Record<string, string>[] = [
  {
    name: "first name",
    key: "first name",
  },
  {
    name: "middle name",
    key: "middle name",
  },
  {
    name: "last name",
    key: "last name",
  },
  {
    name: "Email",
    key: "email",
  },
  {
    name: "phone",
    key: "phone",
  },
  {
    name: "Tax Office",
    key: "Tax Office",
  },
  {
    name: "account status",
    key: "account status",
  },
];

const Index: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // Fetch data when the component mounts

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      return fetchUsers();
    };
    fetchData()
      .then((res) => {
        setLoading(false);
        dispatch(updateUsers(res.data.users));
      })
      .catch((err: any) => {
        setLoading(false);
        //log error
      });
  }, [dispatch]);

  const users = useSelector((state: RootState) => state.users);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const items: Pick<
    CountriesProps,
    "alpha3Code" | "name" | "nativeName" | "capital" | "population"
  >[] = countries
    .filter((country) => country.region === "Europe")
    .map((country) => {
      return {...country, population: formatNumber(country["population"])};
    });

  return (
    <React.Fragment>
      <SectionTitle title="Manage Users" subtitle="Users" />

      <div>
        <Modal title="Add User" isOpen={isModalOpen} closeModal={closeModal}>
          <div>
            <AddUserForm closeModal={closeModal} />
          </div>
        </Modal>
      </div>

      <div className="flex  justify-end p-2">
        <button
          onClick={openModal}
          className="px-4 py-2 text-xs font-bold text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
          Add User
        </button>
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
                {users.map((user, i) => (
                  <tr
                    key={i}
                    className="odd:bg-gray-100 dark:odd:bg-gray-800  cursor-pointer">
                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                      <Link legacyBehavior href={`users/${user.userSlug}`}>
                        <span>{user["firstName"]}</span>
                      </Link>
                    </td>
                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                      <Link legacyBehavior href={`users/${user.userSlug}`}>
                        <span>{user["middleName"]}</span>
                      </Link>
                    </td>
                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                      <Link legacyBehavior href={`users/${user.userSlug}`}>
                        <span>{user["lastName"]}</span>
                      </Link>
                    </td>
                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                      <Link legacyBehavior href={`users/${user.userSlug}`}>
                        <span>{user["email"]}</span>
                      </Link>
                    </td>
                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                      <Link legacyBehavior href={`users/${user.userSlug}`}>
                        <span>{user["phone"]}</span>
                      </Link>
                    </td>
                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                      <Link legacyBehavior href={`users/${user.userSlug}`}>
                        <span>{user?.taxOffice?.value}</span>
                      </Link>
                    </td>
                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                      <Link legacyBehavior href={`users/${user.userSlug}`}>
                        <span>{user["account_status"]}</span>
                      </Link>
                    </td>
                  </tr>
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
