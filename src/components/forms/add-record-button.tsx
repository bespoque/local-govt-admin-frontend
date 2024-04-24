import { handleApiError } from "helpers/errors";
import React, { useState } from "react";
import { createGroup } from "slices/actions/userActions";
import { toast } from "react-toastify";

type AddRecordType = "user" | "group";

interface AddRecordButtonProps {
  onAddRecord: (type: AddRecordType, formData: any) => void;
}

const AddRecordButton: React.FC<AddRecordButtonProps> = ({ onAddRecord }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<AddRecordType | null>(null);
  const [formData, setFormData] = useState<any>(null);
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
      try {
        await createGroup(formData);
        setIsOpen(false);
        setFormData(null);
        toast.success("Password updated successfully");;
      } catch (error) {
        setIsOpen(false);
        setFormData(null);
        handleApiError(error, "There was an error Updating password");
      } finally {
        setReqLoading(false);
      }
    }
  };

  const handleModalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const UserModal = (
    <div className="fixed top-0 right-0 bottom-0 flex flex-col items-end justify-start" style={{ height: '100vh', width: '30vw' }}>
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



  // const UserModal = (
  //   <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
  //     <div className="bg-white p-6 rounded-lg">
  //       <h2 className="text-lg font-semibold mb-4">Add User</h2>
  //       <input
  //         type="text"
  //         name="username"
  //         placeholder="Username"
  //         className="border rounded-md px-2 py-1 mb-2 w-full"
  //         onChange={handleModalInputChange}
  //       />
  //       <input
  //         type="email"
  //         name="email"
  //         placeholder="Email"
  //         className="border rounded-md px-2 py-1 mb-2 w-full"
  //         onChange={handleModalInputChange}
  //       />
  //       <button
  //         onClick={handleAddRecord}
  //         className="bg-blue-500 text-white px-4 py-2 rounded-md">
  //         Add User
  //       </button>
  //       <button onClick={handleToggleDropdown} className="ml-2 text-gray-600">
  //         Cancel
  //       </button>
  //     </div>
  //   </div>
  // );

  const GroupModal = (
    <div className="fixed top-0 right-0 bottom-0 flex flex-col items-end  justify-end" style={{ height: '100vh', width: '30vw' }}>
      <div className="bg-white p-6 h-full rounded-md flex flex-col justify-center">
        <div>
          <h2 className="text-lg font-semibold mb-4">Add Group</h2>
          <input
            type="text"
            name="role"
            placeholder="Role"
            className="border rounded-md px-2 py-1 mb-2 w-full"
            onChange={handleModalInputChange}
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            className="border rounded-md px-2 py-1 mb-2 w-full"
            onChange={handleModalInputChange}
          />
        </div>
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
  // const GroupModal = (
  //   <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
  //     <div className="bg-white p-6 rounded-lg">
  //       <h2 className="text-lg font-semibold mb-4">Add Group</h2>
  //       <input
  //         type="text"
  //         name="groupName"
  //         placeholder="Group Name"
  //         className="border rounded-md px-2 py-1 mb-2 w-full"
  //         onChange={handleModalInputChange}
  //       />
  //       <button
  //         onClick={handleAddRecord}
  //         className="bg-blue-500 text-white px-4 py-2 rounded-md">
  //         Add Group
  //       </button>
  //       <button onClick={handleToggleDropdown} className="ml-2 text-gray-600">
  //         Cancel
  //       </button>
  //     </div>
  //   </div>
  // );

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
              onClick={() => handleSelectType("user")}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem">
              Add User
            </button>
            <button
              onClick={() => handleSelectType("group")}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem">
              Add Group
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
