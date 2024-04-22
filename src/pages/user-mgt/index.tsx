import SectionTitle from "components/section-title";
import Widget from "components/social-feed/widget";
import countries from "constants/countries.json";
import { formatNumber } from "functions/numbers";
import React, { useEffect, useState } from "react";
import AddUserForm from "components/forms/add-user-form";
import { CountriesProps } from "../default-tables";
import Link from "next/link";
import Modal from "components/modals/modal-1";
import { fetchUsers } from "slices/actions/userActions";
import { updateUsers } from "slices/users";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "store";
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


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <React.Fragment>

      <div className="flex justify-between">
        <h3 className="font-mono text-cyan-800 text-xl">User Management</h3>
        <Modal title="Add New User" isOpen={isModalOpen} closeModal={closeModal}>
          <AddUserForm closeModal={closeModal} />
        </Modal>
      </div>

      <div className="flex justify-end p-2">
        <button
          // onClick={openModal}
          className="px-4 py-2 text-xs  text-white rounded bg-cyan-900 ">
          Add New Records
        </button>
      </div>
      
    </React.Fragment>
  );
};

export default Index;