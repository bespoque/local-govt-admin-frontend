
import React, { useEffect, useState } from "react";

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
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      setPhone(singleUsr?.phone || "");
    }
  }, [isModalOpen, singleUsr]);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/\D/g, '');
    inputValue = inputValue.slice(0, 12);
    setPhone(inputValue);
    const warningText = document.getElementById("phoneWarning");
    if (inputValue.length > 11) {
      if (warningText) {
        warningText.style.display = "block";
      }
    } else {
      if (warningText) {
        warningText.style.display = "none";
      }
    }
  };


  if (!isModalOpen) return null;
  const filteredUserGroups = allGroups.filter(group => group.role !== '');
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
              value={phone}
              onChange={handlePhoneChange}
            />
            <small id="phoneWarning" style={{ display: "none", color: "red" }}>
              Phone number should not exceed 11 characters.
            </small>
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
  );
};

export default UpdateUserModal;
