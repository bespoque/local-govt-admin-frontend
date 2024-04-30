import React from "react";

interface Permission {
  entity: string;
}

interface GroupModalProps {
  permissions: Permission[];
  selectedPermissions: string[];
  handleModalInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddRecord: () => void;
  handleToggleDropdown: () => void;
  handlePermissionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const GroupModal: React.FC<GroupModalProps> = ({
  permissions,
  selectedPermissions,
  handleModalInputChange,
  handleAddRecord,
  handleToggleDropdown,
  handlePermissionChange
}) => (
  <div className="fixed top-0 right-0 bottom-0 flex flex-col items-end justify-end">
    <div className="bg-white p-6 h-full rounded-md flex flex-col justify-center w-96">
      <form>
        <h2 className="text-lg font-semibold mb-4">Add Group</h2>
        <input
          type="text"
          name="role"
          placeholder="Group Name"
          className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full"
          onChange={handleModalInputChange}
        />
        <div className="mb-4 rounded border p-2">
          <legend className="block text-sm font-bold my-4 bg-gray-100 rounded py-3 text-center">Set Permissions</legend>

          <div className="mt-1 h-60 overflow-y-auto p-3">
            {permissions.map((permission, index) => (
              <div key={index} className="flex items-center hover:bg-blue-100 rounded-md p-1">
                <input
                  id={`permission-${index}`}
                  name={`permission-${index}`}
                  type="checkbox"
                  value={permission.entity}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  checked={selectedPermissions.includes(permission.entity)}
                  onChange={handlePermissionChange}
                />
                <label htmlFor={`permission-${index}`} className="ml-2 block text-sm text-gray-900">
                  {permission.entity}
                </label>
              </div>
            ))}
          </div>
        </div>
      </form>
      <div className="flex justify-evenly mt-4">
        <button onClick={handleAddRecord} className="bg-cyan-900 text-white px-4 py-2 rounded-md">
          Add Group
        </button>
        <button onClick={handleToggleDropdown} className="ml-2 text-gray-600 hover:bg-blue-100 px-2 rounded-md">
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default GroupModal;
