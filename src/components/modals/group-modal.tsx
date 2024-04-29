
import React from "react";

interface Props {
  isModalOpen: boolean;
  singleGrp: any;
  selectedPermissions: string[];
  permissionsArray: string[];
  closeModal: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handlePermissionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const GroupModal: React.FC<Props> = ({
  isModalOpen,
  singleGrp,
  selectedPermissions,
  permissionsArray,
  closeModal,
  handleSubmit,
  handlePermissionChange,
}) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed top-0 right-0 bottom-0 flex flex-col items-end justify-end">
      <div className="bg-white p-6 h-full rounded-md flex flex-col justify-center w-96">
        <h2 className="text-lg font-semibold mb-4">Update Group</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="role"
            placeholder="Group Name"
            className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full"
            defaultValue={singleGrp?.role || ""}
          />

          <div className="mb-4 rounded border p-2">
            <legend className="block text-sm font-bold my-4 bg-gray-100 rounded py-3 text-center">Permissions</legend>
            <div className="mt-1 h-60 overflow-y-auto p-3">
              {permissionsArray.map((permission, index) => (
                <div key={index} className="flex items-center hover:bg-blue-100 rounded-md p-1">
                  <input
                    id={`permission-${index}`}
                    name={`permission-${index}`}
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    value={permission}
                    checked={selectedPermissions.includes(permission)}
                    onChange={handlePermissionChange}
                  />
                  <label htmlFor={`permission-${index}`} className="ml-2 block text-sm text-gray-900">
                    {permission}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-evenly mt-4">
            <button
              type="submit"
              className="bg-cyan-900 text-white px-4 py-2 rounded-md"
            >
              Update Group
            </button>
            <button onClick={closeModal} className="ml-2 text-gray-600 hover:bg-blue-100 px-2 rounded-md">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;
