import React, { useEffect, useState } from 'react';
import { handleApiError } from 'helpers/errors';
import { fetchSingleCorpTpById, fetchSingleIndTpById } from 'slices/actions/identityActions';
import { creatAssessment, fetchCategories, fetchItems, fetchRevHeads } from 'slices/actions/assessment';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { formatNumber } from 'functions/numbers';
import { toast } from 'react-toastify';

interface ModalProps {
    isModalOpen: boolean;
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    closeModal: () => void;
    userData: any;
    isSuperAdmin: boolean;
    wardsForLga: any;
    onAssessmentCreated: () => void;
}

interface RevenueHead {
    id: string;
    head: string;
}

interface Category {
    id: string;
    revenue_head_id: string;
    revenue_category_name: string;
}

interface Item {
    revenue_category_id: string;
    revenue_head_id: string;
    revenue_item: string;
    category_a: string;
    category_a_wards: string[];
    category_b: string;
    category_b_wards: string[];
    category_c: string;
    category_c_wards: string[];
}

const cleanItems = (items) => {
    return items.map(item => ({
        ...item,
        amount: parseFloat(item.amount.replace(/,/g, '').trim())
    }));
};



const AssessmentModal: React.FC<ModalProps> = ({ isModalOpen, closeModal, isSuperAdmin, wardsForLga, onAssessmentCreated }) => {
    const [revenueHead, setRevenueHead] = useState('');
    const [category, setCategory] = useState('');
    const [item, setItem] = useState('');
    const [revenueHeads, setRevenueHeads] = useState<RevenueHead[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [selectedWard, setSelectedWard] = useState<any>(null);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [taxId, setTaxId] = useState('');
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [taxpayerType, setTaxpayerType] = useState('');
    const [addedItems, setAddedItems] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    

    const cleanedItems = cleanItems(addedItems);

    const totalAmount = cleanedItems.reduce((total, item) => total + item.amount, 0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchRevHeads({ sort: isSuperAdmin ? "ALL" : "DEFAULT" });
                setRevenueHeads(response?.data.revenue_heads);
            } catch (error) {
                handleApiError(error, "Could not fetch data");
            }
        };
        fetchData();
    }, [isSuperAdmin]);

    useEffect(() => {
        if (revenueHead) {
            const fetchCategoriesData = async () => {
                try {
                    const response = await fetchCategories({ sort: revenueHead });
                    setCategories(response?.data.revenue_head_categories);
                    setCategory('');
                    setItems([]);
                } catch (error) {
                    handleApiError(error, "Could not fetch data");
                }
            };
            fetchCategoriesData();
        } else {
            setCategories([]);
            setItems([]);
        }
    }, [revenueHead]);

    useEffect(() => {
        if (category) {
            const fetchItemsData = async () => {
                try {
                    const response = await fetchItems({ sort: category });
                    setItems(response?.data.revenue_head_category_items);
                } catch (error) {
                    handleApiError(error, "Could not fetch data");
                }
            };
            fetchItemsData();
        } else {
            setItems([]);
        }
    }, [category]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, setState: React.Dispatch<React.SetStateAction<string>>, options: any[]) => {
        const selectedValue = e.target.value;
        setState(selectedValue);
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedWard = wardsForLga.find((ward: any) => ward.id === e.target.value);
        setSelectedWard(selectedWard);
    };

    const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedItem = items.find((itm) => itm.revenue_item === e.target.value);
        setSelectedItem(selectedItem);
        setItem(e.target.value);
    };

    const handleAddClick = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedCategory = categories.find(cat => cat.id === category);
        if (selectedItem && selectedCategory && selectedWard) {
            const newItem = {
                category: selectedCategory.revenue_category_name,
                categoryid: selectedItem.revenue_category_id,
                wardid: selectedWard.id,
                item: selectedItem.revenue_item,
                amount: selectedWard.category === 'A' ? selectedItem.category_a
                    : selectedWard.category === 'B' ? selectedItem.category_b
                        : selectedItem.category_c,
                ward: selectedWard.name
            };
            setAddedItems([...addedItems, newItem]);
            // Reset form fields
            setRevenueHead('');
            setCategory('');
            setItem('');
            // setSelectedWard(null);
            setSelectedItem(null);
        }
    }

    const handleRemoveItem = (index: number) => {
        setAddedItems(addedItems.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setUserData(null);
        try {
            const fetchFunction = taxpayerType === 'corporate' ? fetchSingleCorpTpById : fetchSingleIndTpById;
            const response = await fetchFunction({ sort: "DEFAULT", record: taxId, param: "taxid" });
            setUserData(taxpayerType === 'corporate' ? response.data.identity_corporate[0] : response.data.identity_individuals[0]);
        } catch (error) {
            handleApiError(error, "Could not retrieve taxpayer details");
        } finally {
            setLoading(false);
        }
    };
    const resetForm = () => {
        setRevenueHead('');
        setCategory('');
        setItem('');
        setTaxId('');
        setTaxpayerType('');
        setAddedItems([]);
        setSelectedWard(null);
        setSelectedItem(null);
        setUserData(null);
        setError('');
    };

    const handleCreateAssessment = async () => {
        setIsSubmitting(true)
        const assessmentData = {
            taxid: taxId,
            taxid_type: taxpayerType === 'corporate' ? 'Corporate' : 'Individual',
            status: 'PENDING',
            items: addedItems.map(item => ({
                categoryid: item.categoryid,
                wardid: item.wardid,
                amount: item.amount
            })),
            totalamount: totalAmount.toString()
        };

        try {
            await creatAssessment(assessmentData);
            toast.success("Assessment Created successfully");
            onAssessmentCreated();
            resetForm()
            setIsSubmitting(false)
        } catch (error) {
            handleApiError(error, "There was an error creating Assessment");
            setIsSubmitting(false)
        } finally {
            closeModal()
        }
    };

    return (
        <>
            {isModalOpen && (
                <div className="fixed z-50 top-0 right-0 bottom-0 flex flex-col items-end justify-start h-screen w-5/6">
                    <div className="bg-white p-6 rounded-lg h-full flex flex-col overflow-y-auto h-96 p-2" style={{ scrollbarWidth: 'thin' }}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Add Assessment</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div className="flex h-screen">
                            <div className="w-1/2 border-r-2 border-gray-300 p-4">
                                <form onSubmit={handleSubmit} className="mb-4">
                                    <div className="flex gap-2">
                                        <div>
                                            <label htmlFor="tptype" className="block text-sm font-medium text-gray-700">Taxpayer Type</label>
                                            <select
                                                name="tptype"
                                                id="tptype"
                                                required
                                                value={taxpayerType}
                                                onChange={(e) => handleInputChange(e, setTaxpayerType, revenueHeads)}
                                                className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">select</option>
                                                <option value="individual">Individual</option>
                                                <option value="corporate">Corporate</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="taxid" className="block text-sm font-medium text-gray-700">Tax ID</label>
                                            <input
                                                type="text"
                                                id="taxid"
                                                required
                                                value={taxId}
                                                onChange={(e) => handleInputChange(e, setTaxId, revenueHeads)}
                                                className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="mt-2 px-4 py-2 bg-cyan-700 text-white rounded-md shadow hover:bg-cyan-900">
                                        Search
                                    </button>
                                </form>

                                {loading && <p>Loading...</p>}
                                {error && <p className="text-red-500">{error}</p>}
                                {userData && (
                                    <>
                                        {taxpayerType === "individual" ? (
                                            <div className="mt-4 p-4 border border-gray-300 rounded-md my-4 bg-cyan-900 text-white flex grid grid-cols-2 max-w-md">
                                                <p className="truncate"><strong>Name:</strong> {userData.firstname}</p>
                                                <p><strong>Last Name:</strong> {userData.surname}</p>
                                                <p><strong>Gender:</strong> {userData.gender}</p>
                                                <p><strong>Email:</strong> {userData.email}</p>
                                                <p><strong>Phone:</strong> {userData.phonenumber}</p>
                                            </div>
                                        ) : (
                                            <div className="mt-4 p-4 border border-gray-300 rounded-md my-4 bg-cyan-900 text-white flex grid grid-cols-2 max-w-md ">
                                                <p><strong>Name:</strong> {userData.companyname}</p>
                                                <p className="truncate"><strong>Email:</strong> {userData.email}</p>
                                                <p><strong>Phone:</strong> {userData.phone}</p>
                                                <p><strong>Tax Id:</strong> {userData.taxid}</p>
                                            </div>
                                        )}

                                        <form onSubmit={handleAddClick}>
                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                <div>
                                                    <label htmlFor="revenueHead" className="block text-sm font-medium text-gray-700">Revenue Head</label>
                                                    <select
                                                        id="revenueHead"
                                                        required
                                                        value={revenueHead}
                                                        onChange={(e) => handleInputChange(e, setRevenueHead, revenueHeads)}
                                                        className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option value="">Select Revenue Head</option>
                                                        {revenueHeads.map((head) => (
                                                            <option key={head.id} value={head.id}>{head.head}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                                    <select
                                                        id="category"
                                                        required
                                                        value={category}
                                                        onChange={(e) => handleInputChange(e, setCategory, categories)}
                                                        className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categories.map((cat) => (
                                                            <option key={cat.id} value={cat.id}>{cat.revenue_category_name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Ward</label>
                                                    <select
                                                        id="ward"
                                                        required
                                                        onChange={handleWardChange}
                                                        className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option value="">Select Ward</option>
                                                        {wardsForLga.map((itm) => (
                                                            <option key={itm.id} value={itm.id}>{itm.name}</option>
                                                        ))}
                                                    </select>
                                                </div>


                                                <div>
                                                    <label htmlFor="item" className="block text-sm font-medium text-gray-700">Item</label>
                                                    <select
                                                        id="item"
                                                        required
                                                        value={item}
                                                        onChange={handleItemChange}
                                                        className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option value="">Select Item</option>
                                                        {items.map((itm) => (
                                                            <option key={itm.revenue_category_id} value={itm.revenue_item}>{itm.revenue_item}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                            </div>
                                            <button type="submit" className="ml-2 px-4 py-2 bg-cyan-700 text-white rounded-md shadow hover:bg-cyan-900">
                                                <FaPlus />
                                            </button>
                                        </form>

                                    </>
                                )}
                            </div>
                            <div className="w-1/2 p-4">
                                {/* {addedItems.length > 0 && ( */}
                                <div className="mt-4">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-300 p-2">Category</th>
                                                <th className="border border-gray-300 p-2">Ward</th>
                                                <th className="border border-gray-300 p-2">Item</th>
                                                <th className="border border-gray-300 p-2">Amount</th>
                                                <th className="border border-gray-300 p-2">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {addedItems.map((item, index) => (
                                                <tr key={index} className="bg-white">
                                                    <td className="border border-gray-300 p-2">{item.category}</td>
                                                    <td className="border border-gray-300 p-2">{item.ward}</td>
                                                    <td className="border border-gray-300 p-2">{item.item}</td>
                                                    <td className="border border-gray-300 p-2">{item.amount}</td>
                                                    <td className="border border-gray-300 p-2">
                                                        <button
                                                            onClick={() => handleRemoveItem(index)}
                                                            className="p-2 text-white rounded-full shadow  focus:outline-none"
                                                        >
                                                            {/* <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                                </svg> */}
                                                            <FaTrash color='red' />
                                                        </button>
                                                    </td>
                                                </tr>

                                            ))}
                                        </tbody>


                                    </table>
                                    {addedItems.length > 0 && (
                                        <div className="flex justify-end mt-4">
                                            <p className="font-semibold">Total Amount: {formatNumber(totalAmount)}</p>
                                        </div>
                                    )}
                                    {addedItems.length > 0 && (
                                        <button
                                            onClick={handleCreateAssessment}
                                            type="submit" disabled={isSubmitting}
                                            className="px-4 py-2 bg-cyan-800 text-white rounded-md shadow-md focus:outline-none hover:bg-cyan-700">
                                            {isSubmitting ? 'Submitting...' : 'Create Assesment'}
                                        </button>
                                    )}
                                </div>
                                {/* )} */}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AssessmentModal;
