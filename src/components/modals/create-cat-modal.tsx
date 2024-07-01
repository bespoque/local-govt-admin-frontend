import { handleApiError } from "helpers/errors";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createRevcat, fetchReHead } from "slices/actions/revenuechartActions";

interface GroupModalProps {
  handleToggleDropdown: () => void;
}

const AddRevCatModal: React.FC<GroupModalProps> = ({
  handleToggleDropdown
}) => {
  const [heads, setHead] = useState([]);
  const [selectedHead, setSelectedHead] = useState("");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetchReHead();
      setHead(response?.data.output);
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHead(e.target.value);
  };

  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      revenue_head_id: selectedHead,
      revenue_category: categoryName
    };

    
    try {
      const response = await createRevcat(payload);
      handleToggleDropdown()
      toast.success(response?.data?.message)
    }
    catch (error) {
      handleApiError(error, "Could not create data");
    }

  };

  return (
    <div className="fixed top-0 right-0 bottom-0 flex flex-col items-end justify-end">
      <div className="bg-white p-6 h-full rounded-md flex flex-col justify-center w-96">
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold mb-4">Add Categories</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Select Head</label>
            <select
              value={selectedHead}
              onChange={handleCategoryChange}
              className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
              required
            >
              <option value="" disabled>Select a category</option>
              {heads.map(category => (
                <option key={category.id} value={category.id}>
                  {category.head}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={handleCategoryNameChange}
              className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-evenly mt-4">
            <button type="submit" className="bg-cyan-900 text-white px-4 py-2 rounded-md">
              Add Category
            </button>
            <button type="button" onClick={handleToggleDropdown} className="ml-2 text-gray-600 hover:bg-blue-100 px-2 rounded-md">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRevCatModal;
