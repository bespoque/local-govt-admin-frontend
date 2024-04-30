import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createGroup, listPermissions } from "slices/actions/rolesActions";
import { handleApiError } from "helpers/errors";
import UserModal from "components/modals/create-user-modal";
import GroupModal from "components/modals/create-group-modal";


type AddRecordType = "user" | "group";

interface Permission {
  entity: string;
}

interface FormData {
  role: string;
  email: string;
  phone: string;
  status: string;
}

const AddRecordButton: React.FC<any> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<AddRecordType | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [reqLoading, setReqLoading] = useState<boolean>(false);

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

  const handleModalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedPermissions(prevPermissions => [...prevPermissions, value]);
    } else {
      setSelectedPermissions(prevPermissions => prevPermissions.filter(perm => perm !== value));
    }
  };

  const handleAddRecord = async () => {
    if (selectedType === "group" && formData) {
      const groupData = {
        groupname: formData.role,
        permissions: selectedPermissions.join(",")
      };
      try {
        const response = await createGroup(groupData);
        handleToggleDropdown();
        setIsOpen(false);
        toast.success(response?.data?.message);
      } catch (error) {
        handleToggleDropdown();
        setIsOpen(false);
        handleApiError(error, "There was an error updating password");
      } finally {
        setReqLoading(false);
      }
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={handleToggleDropdown}
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-xs text-white rounded bg-cyan-900 focus:outline-none"
          id="options-menu"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          Add Record
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            <button
              onClick={() => handleSelectType("group")}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem"
            >
              Add Group
            </button>
            <button
              onClick={() => handleSelectType("user")}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem"
            >
              Add User
            </button>
          </div>
        </div>
      )}

      {selectedType === "user" && <UserModal
        handleModalInputChange={handleModalInputChange}
        handleAddRecord={handleAddRecord}
        handleToggleDropdown={handleToggleDropdown}
      />}
      {selectedType === "group" && <GroupModal
        permissions={permissions}
        selectedPermissions={selectedPermissions}
        handleModalInputChange={handleModalInputChange}
        handleAddRecord={handleAddRecord}
        handleToggleDropdown={handleToggleDropdown}
        handlePermissionChange={handlePermissionChange}
      />}
    </div>
  );
};

export default AddRecordButton;
