import { handleApiError } from "helpers/errors";
import React, { useEffect, useState } from "react";
import { createGroup } from "slices/actions/userActions";
import { toast } from "react-toastify";
import { listPermissions } from "slices/actions/rolesActions";

type AddRecordType = "user" | "group";
interface Permission {
  entity: string;
}

const AddRecordButton: React.FC<any> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<AddRecordType | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [reqLoading, setReqLoading] = useState<boolean>(false);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    setSelectedType(null);
    setFormData(null);
  };

  const handleSelectType = (type: AddRecordType) => {
    setSelectedType(type);
    setIsOpen(false);
    setFormData(null);
  };

  const handleAddRecord = async () => {
    if (selectedType === "group" && formData) {
      const groupData = {
        groupname: formData.role,
        permissions: String(selectedPermissions)
      }
      try {
        const response = await createGroup(groupData);
        handleToggleDropdown()
        setIsOpen(false)
        toast.success(response?.data?.message);;
      } catch (error) {
        handleToggleDropdown()
        setIsOpen(false)
        handleApiError(error, "There was an error Updating password");
      } finally {
        setReqLoading(false);
      }
    }
  };

  const handleModalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const { data } = await listPermissions({ sort: "ALL" });
        setPermissions(data.permissions);
      } catch (error) {
        handleApiError(error, "Could not retrieve permission details");
      }
    };

    fetchPermissions();
  }, []);

  console.log("permissions", permissions);
  console.log("selectedPermissions", selectedPermissions);


  const handlePermissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedPermissions((prevPermissions) => [...prevPermissions, value]);
    } else {
      setSelectedPermissions((prevPermissions) => prevPermissions.filter((perm) => perm !== value));
    }
  };

  const UserModal = (
    <div className="fixed top-0 right-0 bottom-0 flex flex-col items-end justify-start h-screen w-2/6">
      <div className="bg-white p-6 rounded-lg h-full flex flex-col justify-center">
        <div>
          <h2 className="text-lg font-semibold mb-4">Add User</h2>
          <input
            type="text"
            name="Name"
            placeholder="Name"
            className="border rounded-md px-2 py-1 mb-2 w-full"
            onChange={handleModalInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border rounded-md px-2 py-1 mb-2 w-full"
            onChange={handleModalInputChange}
          />
          <input
            type="text"
            name="email"
            placeholder="User group"
            className="border rounded-md px-2 py-1 mb-2 w-full"
            onChange={handleModalInputChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="border rounded-md px-2 py-1 mb-2 w-full"
            onChange={handleModalInputChange}
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            className="border rounded-md px-2 py-1 mb-2 w-full"
            onChange={handleModalInputChange}
          />
        </div>
        <div className="flex justify-evenly mt-4">
          <button onClick={handleAddRecord} className="bg-cyan-900 text-white px-4 py-2 rounded-md">
            Add User
          </button>
          <button onClick={handleToggleDropdown} className="text-gray-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );


  const GroupModal = (
    <div className="fixed top-0 right-0 bottom-0 flex flex-col items-end justify-end" >
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

            <div>
              <div className="mt-1 h-60 overflow-y-auto p-3">
                {permissions.map((permission: Permission, index: number) => (
                  <div key={index} className="flex items-center hover:bg-blue-100 rounded-md p-1">
                    <input
                      id={`permission-${index}`}
                      name={`permission-${index}`}
                      type="checkbox"
                      value={permission.entity}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={selectedPermissions.includes(permission.entity)} // Check if the permission is selected
                      onChange={handlePermissionChange}
                    />
                    <label htmlFor={`permission-${index}`} className="ml-2 block text-sm text-gray-900">
                      {permission.entity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </form>
        <div className="flex justify-evenly mt-4">
          <button
            onClick={handleAddRecord}
            className="bg-cyan-900 text-white px-4 py-2 rounded-md">
            Add Group
          </button>
          <button onClick={handleToggleDropdown} className="ml-2 text-gray-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={handleToggleDropdown}
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-xs text-white rounded bg-cyan-900 focus:outline-none"
          id="options-menu"
          aria-expanded={isOpen}
          aria-haspopup="true">
          Add Record
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu">
          <div className="py-1" role="none">
            <button
              onClick={() => handleSelectType("group")}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem">
              Add Group
            </button>
            <button
              onClick={() => handleSelectType("user")}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem">
              Add User
            </button>
          </div>
        </div>
      )}

      {selectedType === "user" && UserModal}
      {selectedType === "group" && GroupModal}
    </div>
  );
};

export default AddRecordButton;
