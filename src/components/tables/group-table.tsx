import React, { useState } from "react";

interface Group {
  id: string;
  role: string;
}

interface Props {
  groupData: Group[];
  handleButtonClick: (groupId: string) => void;
}

const GroupTable: React.FC<Props> = ({ groupData, handleButtonClick }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const filteredData = groupData.filter(entry => entry.role.trim() !== "");
  const PAGE_SIZE = 5;

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
              Group Name
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.map((group) => (
            <tr key={group.id} className="hover:bg-blue-100">
              <td className="px-6 py-4 whitespace-nowrap">
                <span>{group.role}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  className="cursor-pointer font-bold "
                  onClick={() => handleButtonClick(group.id)}
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

export default GroupTable;
