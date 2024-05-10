import React from "react";

interface Group {
  id: string;
  role: string;
}

interface Props {
  groupData: Group[];
  handleButtonClick: (groupId: string) => void;
}

const GroupTable: React.FC<Props> = ({ groupData, handleButtonClick }) => {
  const filteredData = groupData.filter(entry => entry.role.trim() !== "");  
  return (
    <table className="w-full text-left table-auto no-border striped">
      <thead>
        <tr>
          <th className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
            Group Name
          </th>
          <th className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {groupData.map((group) => (
          <tr key={group.id} className="odd:bg-gray-100 dark:odd:bg-gray-100">
            <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
              <span>{group.role}</span>
            </td>
            <td>
              <button
                className="cursor-pointer font-bold hover:underline text-cyan-800"
                onClick={() => handleButtonClick(group.id)}
              >
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GroupTable;
