import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchGroup, listGroups, listPermissions, updateGroup } from "slices/actions/rolesActions";
import { handleApiError } from "helpers/errors";
import { toast } from "react-toastify";
import GroupTable from "components/tables/group-table";
import GroupModal from "components/modals/update-group-modal";
import { listUsers } from "slices/actions/userActions";
import UsersTable from "components/tables/users-table";


interface Users {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  usergroup: string;
  created: string;
}

const UserList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [UsersData, setUsersData] = useState<Users[]>([]);
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [singleGrp, setSingleGrpData] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const userPayload: { sort: string } = {
      sort: "ALL"
    };
    const fetchData = async () => {
      try {
        const res = await listUsers(userPayload);
        setUsersData(res.data.users);
      } catch (error) {
        handleApiError(error, "Could not fetch users");
      }
    };
    const fetchPermissionsData = async () => {
      try {
        const res = await listPermissions(userPayload);
        setAllPermissions(res.data.permissions.map((obj: any) => obj.entity));
      } catch (error) {
        handleApiError(error, "Could not retrieve permission details");
      }
    };

    fetchData();
    fetchPermissionsData();
  }, [dispatch]);

  const handleButtonClick = async (groupId: string) => {
    try {
      setLoading(true);
      const { data } = await fetchGroup({ groupid: groupId });
      setSingleGrpData(data?.group[0]);
      setSelectedPermissions(data?.permissions);
      setIsModalOpen(true);
    } catch (error) {
      handleApiError(error, "Could not retrieve group details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const groupname = formData.get("role") as string;
    const formD = {
      groupid: singleGrp.id,
      groupname: groupname,
      permissions: String(selectedPermissions)
    }
    try {
      setLoading(true);
      await updateGroup(formD);
      toast.success("Group updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      handleApiError(error, "There was an error updating group");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handlePermissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedPermissions((prevPermissions) => {
      if (checked) {
        return [...prevPermissions, value];
      } else {
        return prevPermissions.filter((perm) => perm !== value);
      }
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <React.Fragment>
      <UsersTable usersData={UsersData} handleButtonClick={handleButtonClick} />
      <GroupModal
        isModalOpen={isModalOpen}
        singleGrp={singleGrp}
        selectedPermissions={selectedPermissions}
        permissionsArray={allPermissions}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        handlePermissionChange={handlePermissionChange}
      />
    </React.Fragment>
  );
};

export default UserList;
