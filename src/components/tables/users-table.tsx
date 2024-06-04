import React, { useState } from "react";

interface Users {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  usergroupName: string;
  created: string;
  client: string;
}

interface Props {
  usersData: Users[];
  handleButtonClick: (profileid: string, client: string) => void;
}

const UsersTable: React.FC<Props> = ({ usersData, handleButtonClick }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 5;

  const totalPages = Math.ceil(usersData.length / PAGE_SIZE);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = usersData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
              Name
            </th>
            <th className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
              Email
            </th>
            <th className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
              Phone
            </th>
            <th className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
              User Group
            </th>
            <th className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
              Status
            </th>
            <th className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.map((usr) => (
            <tr key={usr.id} className="hover:bg-blue-100">
              <td className="px-6 py-4 whitespace-nowrap">{usr.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{usr.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{usr.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap">{usr.usergroupName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{usr.status}</td>
              <td className="px-6 py-4 whitespace-nowrap">{usr.created}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  className="cursor-pointer text-cyan-800 font-bold"
                  onClick={() => handleButtonClick(usr.id, usr.client)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center my-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mr-2 bg-cyan-900 text-white rounded-md shadow-md focus:outline-none hover:bg-cyan-700 ${currentPage === index + 1 ? 'bg-blue-500' : ''
              }`}
            style={{ backgroundColor: currentPage === index + 1 ? '#073763' : '#cad6e1' }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UsersTable;
