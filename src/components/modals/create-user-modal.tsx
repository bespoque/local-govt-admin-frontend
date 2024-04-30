import React from "react";

interface UserModalProps {
  handleModalInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddRecord: () => void;
  handleToggleDropdown: () => void;
}

const UserModal: React.FC<UserModalProps> = ({
  handleModalInputChange,
  handleAddRecord,
  handleToggleDropdown
}) => (
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

export default UserModal;
