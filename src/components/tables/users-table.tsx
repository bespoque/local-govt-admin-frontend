import React from "react";

interface Users {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  usergroupName: string;
  created: string;
}

interface Props {
  usersData: Users[];
  handleButtonClick: (groupId: string) => void;
}

const UsersTable: React.FC<Props> = ({ usersData, handleButtonClick }) => {
  return (
    <table className="w-full text-left table-auto no-border striped">
      <thead>
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
          {/* <th className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
            Actions
          </th> */}
        </tr>
      </thead>
      <tbody>
        {usersData.map((group) => (
          <tr key={group.id} className="odd:bg-gray-100 dark:odd:bg-gray-100">
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{group.name}</span>
            </td>
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{group.email}</span>
            </td>
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{group.phone}</span>
            </td>
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{group.usergroupName}</span>
            </td>
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{group.status}</span>
            </td>
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{group.created}</span>
            </td>
            {/* <td>
              <button
                className="cursor-pointer font-bold hover:underline text-cyan-800"
                onClick={() => handleButtonClick(group.id)}
              >
                View
              </button>
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
