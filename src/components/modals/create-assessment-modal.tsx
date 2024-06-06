import React, { useEffect, useState } from 'react';
import { handleApiError } from 'helpers/errors';
import { fetchSingleCorpTpById, fetchSingleIndTpById } from 'slices/actions/identityActions';
import { fetchCategories, fetchItems, fetchRevHeads } from 'slices/actions/assessment';

interface ModalProps {
    isModalOpen: boolean;
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    closeModal: () => void;
    userData: any;
    isSuperAdmin: boolean;
    wardsForLga: any;
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

const AssessmentModal: React.FC<ModalProps> = ({ isModalOpen, closeModal, isSuperAdmin, wardsForLga }) => {
    const [revenueHead, setRevenueHead] = useState('');
    const [selectedRevenueHead, setSelectedRevenueHead] = useState<RevenueHead | null>(null);
    const [category, setCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, setState: React.Dispatch<React.SetStateAction<string>>, setSelectedObject: React.Dispatch<React.SetStateAction<any>>, options: any[]) => {
        const selectedValue = e.target.value;
        setState(selectedValue);
        const selectedObject = options.find(option => option.id === selectedValue);
        setSelectedObject(selectedObject);
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

    return (
        <>
            {isModalOpen && (
                <div className="fixed z-50 top-0 right-0 bottom-0 flex flex-col items-end justify-start h-screen w-4/6">
                    <div className="bg-white p-6 rounded-lg h-full flex flex-col overflow-y-auto h-96 p-2" style={{ scrollbarWidth: 'thin' }}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Add Assessment</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mb-4">
                            <div className="flex gap-6">
                                <div>
                                    <label htmlFor="tptype" className="block text-sm font-medium text-gray-700">Taxpayer type</label>
                                    <select
                                        name="tptype"
                                        id="tptype"
                                        required
                                        value={taxpayerType}
                                        onChange={(e) => handleInputChange(e, setTaxpayerType, setSelectedRevenueHead, revenueHeads)}
                                        className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Taxpayer type</option>
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
                                        onChange={(e) => handleInputChange(e, setTaxId, setSelectedRevenueHead, revenueHeads)}
                                        className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="mt-2 px-4 py-2 bg-cyan-900 text-white rounded-md shadow hover:bg-cyan-800">
                                Lookup
                            </button>
                        </form>

                        {loading && <p>Loading...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {userData && (
                            <>
                                {taxpayerType === "individual" ? (
                                    <div className="mt-4 p-4 border border-gray-300 rounded-md my-4 bg-cyan-900 text-white flex grid grid-cols-2 max-w-md">
                                        <p><strong>First Name:</strong> {userData.firstname}</p>
                                        <p><strong>Last Name:</strong> {userData.surname}</p>
                                        <p><strong>Tax ID:</strong> {userData.taxid}</p>
                                        <p><strong>ID Format:</strong> {userData.idformat}</p>
                                    </div>
                                ) : (
                                    <div className="mt-4 p-4 border border-gray-300 rounded-md my-4 bg-cyan-900 text-white flex grid grid-cols-2 max-w-md">
                                        <p><strong>Company Name:</strong> {userData.companyname}</p>
                                        <p><strong>Tax ID:</strong> {userData.taxid}</p>
                                    </div>
                                )}
                            </>
                        )}

                        <form>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="revenueHead" className="block text-sm font-medium text-gray-700">Revenue Head</label>
                                    <select
                                        id="revenueHead"
                                        required
                                        value={revenueHead}
                                        onChange={(e) => handleInputChange(e, setRevenueHead, setSelectedRevenueHead, revenueHeads)}
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
                                        value={category}
                                        onChange={(e) => handleInputChange(e, setCategory, setSelectedCategory, categories)}
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
                        </form>

                        {selectedRevenueHead && (
                            <div className="p-2 border border-gray-300 flex justify-evenly rounded-md my-4 bg-gray-100">
                                <div className="br-2">
                                    <p className="font-semibold">Revenue Head</p>
                                    <p>{selectedRevenueHead?.head}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Category</p>
                                    <p>{selectedCategory?.revenue_category_name}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Ward</p>
                                    <p>{selectedWard?.name}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Item</p>
                                    <p>{selectedItem?.revenue_item}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Amount</p>
                                    {selectedWard && (
                                        <>
                                            {selectedWard.category === 'A' && (
                                                <p><strong> {selectedItem?.category_a}</strong></p>
                                            )}
                                            {selectedWard.category === 'B' && (
                                                <p><strong>{selectedItem?.category_b}</strong></p>
                                            )}
                                            {selectedWard.category === 'C' && (
                                                <p><strong>{selectedItem?.category_c}</strong> </p>
                                            )}
                                        </>
                                    )}
                                </div>

                            </div>
                        )}

                        {/* {selectedRevenueHead && (
                            <div className="mt-4 p-4 border border-gray-300 rounded-md my-4 bg-gray-100">
                                <h3 className="text-lg font-semibold">Selected Revenue Head</h3>
                                <p><strong>ID:</strong> {selectedRevenueHead.id}</p>
                                <p><strong>Head:</strong> {selectedRevenueHead.head}</p>
                            </div>
                        )} */}

                        {/* {selectedCategory && (
                            <div className="mt-4 p-4 border border-gray-300 rounded-md my-4 bg-gray-100">
                                <h3 className="text-lg font-semibold">Selected Category</h3>
                                <p><strong>ID:</strong> {selectedCategory.id}</p>
                                <p><strong>Revenue Head ID:</strong> {selectedCategory.revenue_head_id}</p>
                                <p><strong>Name:</strong> {selectedCategory.revenue_category_name}</p>
                            </div>
                        )} */}

                        {/* {selectedWard && (
                            <div className="mt-4 p-4 border border-gray-300 rounded-md my-4 bg-gray-100">
                                <h3 className="text-lg font-semibold">Selected Ward</h3>
                                <p><strong>ID:</strong> {selectedWard.id}</p>
                                <p><strong>Name:</strong> {selectedWard.name}</p>
                                <p><strong>LGA ID:</strong> {selectedWard.lga_id}</p>
                            </div>
                        )} */}

                        {/* {selectedItem && (
                            <div className="mt-4 p-4 border border-gray-300 rounded-md my-4 bg-gray-100">
                                <h3 className="text-lg font-semibold">Selected Item</h3>
                                <p><strong>Revenue Item:</strong> {selectedItem.revenue_item}</p>
                                <p><strong>Revenue Head ID:</strong> {selectedItem.revenue_head_id}</p>
                                <p><strong>Revenue Category ID:</strong> {selectedItem.revenue_category_id}</p>
                                {selectedWard && (
                                    <>
                                        {selectedWard.category === 'A' && (
                                            <p><strong>Category A Amount:</strong> {selectedItem.category_a}</p>
                                        )}
                                        {selectedWard.category === 'B' && (
                                            <p><strong>Category B Amount:</strong> {selectedItem.category_b}</p>
                                        )}
                                        {selectedWard.category === 'C' && (
                                            <p><strong>Category C Amount:</strong> {selectedItem.category_c}</p>
                                        )}
                                    </>
                                )}
                            </div>
                        )} */}
                    </div>
                </div>
            )}
        </>
    );
};

export default AssessmentModal;
