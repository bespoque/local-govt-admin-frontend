
import React from "react";

interface AllGroupsData {
  id: string;
  role: string;
  clientid: string;
}

interface Props {
  isModalOpen: boolean;
  singleUsr: any;
  allGroups: AllGroupsData[];
  closeModal: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;

}

const UpdateUserModal: React.FC<Props> = ({
  isModalOpen,
  singleUsr,
  allGroups,
  closeModal,
  handleSubmit,

}) => {
  if (!isModalOpen) return null;

  const filteredUserGroups = allGroups.filter(group => group.role !== '');
  console.log("allGroups inner", filteredUserGroups);
  console.log("singleUsr", singleUsr);

  return (
    <div className="fixed top-0 right-0 bottom-0 flex flex-col items-end justify-start h-screen w-2/6">
      <div className="bg-white p-6 rounded-lg h-full flex flex-col justify-center">
        <form onSubmit={handleSubmit}>
          <div>
            <h2 className="text-lg font-semibold mb-4">Update User</h2>
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full"
              defaultValue={singleUsr?.name || ""}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full"
              defaultValue={singleUsr?.email || ""}
            />
            <select
              name="groupid"
              id="groupid"
              className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full"
              defaultValue={singleUsr?.usergroup || ""}
            >
              
              {filteredUserGroups.map(group => (
                <option key={group.id} value={group.id}>{group.role}</option>
              ))}
            </select>
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full"
              defaultValue={singleUsr?.phone || ""}
            />

            <select
              name="status"
              id="status"
              className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full"
              defaultValue={singleUsr?.status || ""}
            >
              <option value="Inactive">Inactive</option>
              <option value="Active">Active</option>
            </select>
          </div>

          <div className="flex justify-evenly mt-4">
            <button
              type="submit"
              className="bg-cyan-900 text-white px-4 py-2 rounded-md">
              Update User
            </button>
            <button onClick={closeModal} className="ml-2 text-gray-600 hover:bg-blue-100 px-2 rounded-md">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    // <div className="fixed top-0 right-0 bottom-0 flex flex-col items-end justify-end">
    //   <div className="bg-white p-6 h-full rounded-md flex flex-col justify-center w-96">
    //     <h2 className="text-lg font-semibold mb-4">Update Group</h2>
    //     <form onSubmit={handleSubmit}>
    //       <input
    //         type="text"
    //         name="role"
    //         placeholder="Group Name"
    //         className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full"
    //         defaultValue={singleUsr?.role || ""}
    //       />

    //       <div className="mb-4 rounded border p-2">
    //         <legend className="block text-sm font-bold my-4 bg-gray-100 rounded py-3 text-center">Permissions</legend>
    //         <div className="mt-1 h-60 overflow-y-auto p-3">
    //           {allGroups.map((group, index) => (
    //             <div key={index} className="flex items-center hover:bg-blue-100 rounded-md p-1">
    //               <input
    //                 id={`permission-${index}`}
    //                 name={`permission-${index}`}
    //                 type="checkbox"
    //                 className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
    //                 value={group}
    //                 checked={selectedPermissions.includes(group)}
    //                 onChange={handlePermissionChange}
    //               />
    //               <label htmlFor={`permission-${index}`} className="ml-2 block text-sm text-gray-900">
    //                 {group}
    //               </label>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //       <div className="flex justify-evenly mt-4">
    //         <button
    //           type="submit"
    //           className="bg-cyan-900 text-white px-4 py-2 rounded-md"
    //         >
    //           Update Group
    //         </button>
    //         <button onClick={closeModal} className="ml-2 text-gray-600 hover:bg-blue-100 px-2 rounded-md">
    //           Cancel
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>
  );
};

export default UpdateUserModal;
