import { handleApiError } from "helpers/errors";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { createRevHead } from "slices/actions/revenuechartActions";


interface RevHeadModalProps {
  handleToggleDropdown: () => void;
}

const RevHeadModal: React.FC<RevHeadModalProps> = ({ handleToggleDropdown }) => {
  const [revenueHead, setRevenueHead] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { head: revenueHead };

    try {
      const response = await createRevHead(payload);
      handleToggleDropdown()
      toast.success(response?.data?.message)
    } catch (error) {
      handleApiError(error, "Could not create data");
    }

  };



  return (
    <div className="fixed top-0 right-0 bottom-0 flex flex-col items-end justify-end">
      <div className="bg-white p-6 h-full rounded-md flex flex-col justify-center w-96">
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold mb-4">Add Revenue Head</h2>
          <div className="mb-4">
            <label htmlFor="revenueHead" className="block text-sm font-medium text-gray-700">
              Revenue Head
            </label>
            <input
              type="text"
              id="revenueHead"
              value={revenueHead}
              onChange={(e) => setRevenueHead(e.target.value)}
              className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
              placeholder="Enter new revenue head"
              required
            />
          </div>
          <div className="flex justify-evenly mt-4">
            <button
              type="submit"
              className="bg-cyan-900 text-white px-4 py-2 rounded-md"
            >
              Add Revenue Head
            </button>
            <button
              type="button"
              onClick={handleToggleDropdown}
              className="ml-2 text-gray-600 hover:bg-blue-100 px-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RevHeadModal;
