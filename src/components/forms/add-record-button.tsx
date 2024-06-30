import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { createGroup, listGroups, listPermissions } from "slices/actions/rolesActions";
import { handleApiError } from "helpers/errors";
import UserModal from "components/modals/create-user-modal";
import GroupModal from "components/modals/create-group-modal";
import { usersCreate } from "slices/actions/userActions";
import { RootState, useAppSelector } from "store";
import { Role } from "components/user/user.interface";


type AddRecordType = "user" | "group";

interface Permission {
  entity: string;
}
interface Groups {
  id: string;
  role: string;
  clientid: string;
}

interface UserFormData {
  role: string;
  fullname: string;
  groupid: string;
  lga: string;
  email: string;
  phone: string;
  status: string;
}

const AddRecordButton: React.FC<{ onUserAdded: () => void }> = ({ onUserAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<AddRecordType | null>(null);
  const [formData, setFormData] = useState<UserFormData | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userGroups, setUserGroups] = useState<Groups[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const userData = useAppSelector((state: RootState) => state.auth);
  const userRoles = useMemo(() => userData.roles.map((usr) => usr.role), [userData.roles]);
  const isSuperAdmin = useMemo(() => userRoles.includes(Role.SUPERADMIN), [userRoles]);


  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const { data } = await listPermissions({
          sort: isSuperAdmin ? "ALL" : "DEFAULT"
        });
        setPermissions(data.permissions);
      } catch (error) {
        handleApiError(error, "Could not retrieve permission details");
      }
    };
    const fetchGroups = async () => {
      try {
        const { data } = await listGroups({ sort: isSuperAdmin ? "ALL" : "DEFAULT" });
        setUserGroups(data.groups);
      } catch (error) {
        handleApiError(error, "Could not retrieve group details");
      }
    };

    fetchPermissions();
    fetchGroups();
  }, [isSuperAdmin]);


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
        onUserAdded()
      } catch (error) {
        handleToggleDropdown();
        setIsOpen(false);
        handleApiError(error, "There was an error creating group");
      }
    }
    if (selectedType === "user" && formData) {
      const formDataWithStatus = { ...formData, status: "Active" };
      try {
        const response = await usersCreate(formDataWithStatus);
        handleToggleDropdown();
        setIsOpen(false);
        toast.success(response?.data?.message);
        onUserAdded()
      } catch (error) {
        handleToggleDropdown();
        setIsOpen(false);
        handleApiError(error, "There was an error creating user");
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
              onClick={() => handleSelectType("user")}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem"
            >
              Add User
            </button>
            <button
              onClick={() => handleSelectType("group")}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem"
            >
              Add Group
            </button>
          </div>
        </div>
      )}

      {selectedType === "user" && <UserModal
        handleModalInputChange={handleModalInputChange}
        handleAddRecord={handleAddRecord}
        handleToggleDropdown={handleToggleDropdown}
        usergroups={userGroups}
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
