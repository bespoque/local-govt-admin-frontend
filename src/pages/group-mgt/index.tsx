// GroupList.tsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchGroup, listGroups, listPermissions, updateGroup } from "slices/actions/rolesActions";
import { handleApiError } from "helpers/errors";
import { toast } from "react-toastify";
import GroupTable from "components/tables/group-table";
import GroupModal from "components/modals/update-group-modal";


interface Group {
  id: string;
  role: string;
}

const GroupList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [groupData, setGroupData] = useState<Group[]>([]);
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [singleGrp, setSingleGrpData] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const groupPayload: { sort: string } = {
      sort: "ALL"
    };
    const fetchData = async () => {
      try {
        const res = await listGroups(groupPayload);
        setGroupData(res.data.groups);
      } catch (error) {
        handleApiError(error, "Could not group details");
      }
    };
    const fetchPermissionsData = async () => {
      try {
        const res = await listPermissions(groupPayload);
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
      <GroupTable groupData={groupData} handleButtonClick={handleButtonClick} />
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

export default GroupList;
