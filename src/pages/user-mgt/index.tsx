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
import { DefaultTabs } from "components/tabs";
import AddRecordButton from "components/forms/add-record-button";

type AddRecordType = 'user' | 'group' | '';

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
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleAddRecord = (type: 'user' | 'group', formData: any) => {
    // Implement logic to add record here
    console.log(`Adding ${type}`, formData);
  };




  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const tabs = [
    {
      index: 0,
      title: "Users",
      active: true,
      content: <div className="w-full py-4">
        
      </div>,
    },
    {
      index: 2,
      title: "Groups",
      content: (
        <div className="w-full py-4">
          
        </div>
      ),
    },
  ];

  return (
    <React.Fragment>

        
      
      <div className="flex justify-between">
        <h3 className="font-mono text-cyan-800 text-xl">User Management</h3>
        <Modal title="Add New User" isOpen={isModalOpen} closeModal={closeModal}>
          <AddUserForm closeModal={closeModal} />
        </Modal>
      </div>


      <div className="flex justify-end p-2">
        <AddRecordButton onAddRecord={handleAddRecord} />
        {/* <button
          // onClick={openModal}
          className="px-4 py-2 text-xs text-white rounded bg-cyan-900">
          Add New Records
        </button> */}
      </div>
      {/* <div className="flex flex-wrap">
        <div className="w-full p-4">
          <DefaultTabs tabs={tabs} />
        </div>
      </div> */}
    </React.Fragment>
  );
};

export default Index;
