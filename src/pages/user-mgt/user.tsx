import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { listGroups, updateGroup } from "slices/actions/rolesActions";
import { handleApiError } from "helpers/errors";
import { toast } from "react-toastify";
import { fetchSingleUser, listUsers } from "slices/actions/userActions";
import UsersTable from "components/tables/users-table";
import UpdateUserModal from "components/modals/update-user-modal";

interface Users {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  usergroupName: string;
  created: string;
}

interface AllGroupsData {
  id: string;
  role: string;
  clientid: string;
}

const UserList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [UsersData, setUsersData] = useState<Users[]>([]);
  const [allGroups, setAllGroups] = useState<AllGroupsData[]>([]);
  const [singleUsr, setSingleUsrData] = useState<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const Payload: { sort: string } = {
      sort: "ALL"
    };
    const fetchData = async () => {
      try {
        const res = await listUsers(Payload);
        setUsersData(res.data.users);
      } catch (error) {
        handleApiError(error, "Could not fetch users");
      }
    };
    const fetchUserGroupsData = async () => {
      try {
        const res = await listGroups(Payload);
        setAllGroups(res.data.groups);
      } catch (error) {
        handleApiError(error, "Could not retrieve permission details");
      }
    };

    fetchData();
    fetchUserGroupsData();
  }, [dispatch]);

  const handleButtonClick = async (profileid: string) => {
    try {
      const { data } = await fetchSingleUser({ profileid: profileid });
      setSingleUsrData(data?.user[0]);
      setIsModalOpen(true);
    } catch (error) {
      handleApiError(error, "Could not retrieve user details");
    } 
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const groupname = formData.get("fullname") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const status = formData.get("status") as string;
    const groupid = formData.get("groupid") as string;
    const profileid = singleUsr?.id;
    const updateUser = {
      groupname,
      phone,
      email,
      status,
      profileid,
      groupid
    }    
    console.log("updateUser", updateUser);
    
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <React.Fragment>
      <UsersTable usersData={UsersData} handleButtonClick={handleButtonClick} />
      <UpdateUserModal
        isModalOpen={isModalOpen}
        singleUsr={singleUsr}
        allGroups={allGroups}
        closeModal={closeModal}
        handleSubmit={handleSubmit}

      />
    </React.Fragment>
  );
};

export default UserList;
