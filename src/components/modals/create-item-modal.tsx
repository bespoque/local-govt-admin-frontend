import { handleApiError } from "helpers/errors";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createRevItem, fetchReCat, fetchReHead } from "slices/actions/revenuechartActions";

interface GroupModalProps {
  handleToggleDropdown: () => void;
}

interface Head {
  id: number;
  head: string;
}

interface Category {
  id: number;
  revenue_head_id: number;
  revenue_category: string;
}

const AddItemModal: React.FC<GroupModalProps> = ({ handleToggleDropdown }) => {
  const [heads, setHeads] = useState<Head[]>([]);
  const [selectedHead, setSelectedHead] = useState<string>("");
  const [selectedCat, setSelectedCat] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [itemName, setItemName] = useState<string>("");
  const [catA, setCatA] = useState<string>("");
  const [catB, setCatB] = useState<string>("");
  const [catC, setCatC] = useState<string>("");

  useEffect(() => {
    const fetchHeads = async () => {
      try {
        const response = await fetchReHead();
        setHeads(response?.data.output || []);
      } catch (error) {
        handleApiError(error, "Failed to fetch heads");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetchReCat();
        setCategories(response?.data.output || []);
      } catch (error) {
        handleApiError(error, "Failed to fetch categories");
      }
    };

    fetchHeads();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedHead) {
      const filtered = categories.filter(
        (cat) => cat.revenue_head_id === Number(selectedHead)
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  }, [selectedHead, categories]);

  const handleHeadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHead(e.target.value);
  };

  const handleCatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCat(e.target.value);
  };

  const handleItemNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemName(e.target.value);
  };

  const formatNumber = (value: string) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseNumber = (value: string) => {
    return value.replace(/,/g, "");
  };

  const handleCatAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCatA(formatNumber(e.target.value));
  };

  const handleCatBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCatB(formatNumber(e.target.value));
  };

  const handleCatCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCatC(formatNumber(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      revenue_head_id: (selectedHead),
      revenue_category_id: (selectedCat),
      items: [
        {
          revenue_item: itemName,
          category_a: parseNumber(catA),
          category_b: parseNumber(catB),
          category_c: parseNumber(catC)
        }
      ]
    };
    
    try {
      const response = await createRevItem(payload);
      handleToggleDropdown();
      toast.success(response?.data?.message || "Item added successfully");
    } catch (error) {
      handleApiError(error, "Could not add");
    }
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 flex flex-col items-end justify-end">
      <div className="bg-white p-6 h-full rounded-md flex flex-col justify-center w-96">
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold mb-4">Add Item</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Select Head</label>
            <select
              value={selectedHead}
              onChange={handleHeadChange}
              className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
              required
            >
              <option value="" disabled>Select a revenue head</option>
              {heads.map((head) => (
                <option key={head.id} value={head.id}>
                  {head.head}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Select Category</label>
            <select
              value={selectedCat}
              onChange={handleCatChange}
              className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
              required
            >
              <option value="" disabled>Select category</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.revenue_category}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 border-2 rounded p-4">
            <label className="block text-gray-700">Item Name</label>
            <input
              type="text"
              placeholder="Enter item name"
              value={itemName}
              onChange={handleItemNameChange}
              className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
              required
            />
            <label className="block text-gray-700 my-3">Sub-Urban</label>
            <section className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="₦ CAT A"
                value={`₦ ${catA}`}
                onChange={handleCatAChange}
                className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="₦ CAT B"
                value={`₦ ${catB}`}
                onChange={handleCatBChange}
                className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="₦ CAT C"
                value={`₦ ${catC}`}
                onChange={handleCatCChange}
                className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                required
              />
            </section>
          </div>
          <div className="flex justify-evenly mt-4">
            <button type="submit" className="bg-cyan-900 text-white px-4 py-2 rounded-md">
              Add Item
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

export default AddItemModal;
