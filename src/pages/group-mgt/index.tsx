
import Widget from "components/social-feed/widget";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchGroup, listGroups, updateGroup } from "slices/actions/rolesActions";
import { handleApiError } from "helpers/errors";
import { toast } from "react-toastify";


const fields: Record<string, string>[] = [
  {
    name: "group name",
    key: "group name",
  },

];

const GroupList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [groupData, setGroupData] = useState<any>([]);
  const [singleGrp, setSingleGrpData] = useState<any>(null);
  const [groupPerm, setGroupPermissions] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const groupPayload: { sort: string } = {
      sort: "ALL"
    };
    const fetchData = async () => {
      return listGroups(groupPayload);
    };
    fetchData()
      .then((res) => {
        setGroupData(res.data.groups);
      })
      .catch((err: any) => {
        //log error
      });
  }, [dispatch]);


  const handleButtonClick = (groupId: string) => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await fetchGroup({ groupid: groupId });
        setSingleGrpData(data?.group[0]);
        setGroupPermissions(data?.permissions);
        setSelectedPermissions(data?.permissions);
        setIsModalOpen(true);

      } catch (error) {
        handleApiError(error, "Could not retrieve group details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      handleApiError(error, "There was an error Updating group");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handlePermissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedPermissions((prevPermissions) => [...prevPermissions, value]);
    } else {
      setSelectedPermissions((prevPermissions) => prevPermissions.filter((perm) => perm !== value));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <React.Fragment>

      <Widget>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left table-auto no-border striped">
            <thead>
              <tr>
                {fields.map((field, i) => (
                  <th
                    key={i}
                    className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
                    {field.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groupData.map((group, i) => (
                <tr
                  key={i}
                  className="odd:bg-gray-100 dark:odd:bg-gray-800 cursor-pointer"
                >
                  <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                    <span>{group["role"]}</span>
                  </td>
                  <td>
                    <button
                      className="cursor-pointer font-bold hover:underline text-cyan-800"
                      onClick={() => handleButtonClick(group["id"])}
                    >View</button>
                  </td>
                </tr>

              ))}
            </tbody>
          </table>
        </div>
      </Widget>
      
      {isModalOpen && (
        <div className="fixed top-0 right-0 bottom-0 flex flex-col items-end justify-end " >
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
                  {groupPerm &&
                    groupPerm.map((permission: string, index: number) => (
                      <div key={index} className="flex items-center hover:bg-blue-100 rounded-md p-1">
                        <input
                          id={`permission-${index}`}
                          name={`permission-${index}`}
                          type="checkbox"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          value={permission}
                          checked={selectedPermissions.includes(permission)} // Check if the permission is selected
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
                  className="bg-cyan-900 text-white px-4 py-2 rounded-md">
                  Update Group
                </button>
                <button onClick={closeModal} className="ml-2 text-gray-600 hover:bg-blue-100 px-2 rounded-md">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </React.Fragment>
  );
};

export default GroupList;
