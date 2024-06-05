import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { localGovernments } from 'components/tax-office/tax-office.interface';
import { WardsList } from 'components/tax-office/wards-interface';
import { handleApiError } from 'helpers/errors';
import { fetchSingleCorpTpById, fetchSingleIndTpById } from 'slices/actions/identityActions';
import { listUsers } from 'slices/actions/userActions';
import { fetchCategories, fetchItems, fetchRevHeads } from 'slices/actions/assessment';

interface ModalProps {
    isModalOpen: boolean;
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    closeModal: () => void;
    userData: any;
    isSuperAdmin: boolean;
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

const AssessmentModal: React.FC<ModalProps> = ({ isModalOpen, closeModal, isSuperAdmin }) => {
    const [localGov, setLocalGov] = useState<{ id: string; name: string }[]>([]);
    const [filteredWards, setFilteredWards] = useState<{ id: string; name: string }[]>([]);
    const [selectedLGA, setSelectedLGA] = useState<{ id: string; name: string }>({ id: '', name: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [revenueHead, setRevenueHead] = useState('');
    const [category, setCategory] = useState('');
    const [item, setItem] = useState('');
    const [revenueHeads, setRevenueHeads] = useState<RevenueHead[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<Item[]>([]);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, setState: React.Dispatch<React.SetStateAction<string>>) => {
        setState(e.target.value);
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
                <div className="fixed z-50 top-0 right-0 bottom-0 flex flex-col items-end justify-start h-screen w-3/6">
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
                                        onChange={(e) => handleInputChange(e, setTaxpayerType)}
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
                                        onChange={(e) => handleInputChange(e, setTaxId)}
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
                                        onChange={(e) => handleInputChange(e, setRevenueHead)}
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
                                        onChange={(e) => handleInputChange(e, setCategory)}
                                        className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.revenue_category_name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="item" className="block text-sm font-medium text-gray-700">Item</label>
                                    <select
                                        id="item"
                                        value={item}
                                        onChange={(e) => handleInputChange(e, setItem)}
                                        className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Select Item</option>
                                        {items.map((itm) => (
                                            <option key={itm.revenue_category_id} value={itm.revenue_item}>{itm.revenue_item}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* <div>
                                    <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Ward</label>
                                    <select
                                        id="ward"
                                        className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">select ward</option>
                                        {WardsList.map((itm) => (
                                            <option key={itm.id} value={itm.lga_id}>{itm.name}</option>
                                        ))}
                                    </select>
                                </div> */}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AssessmentModal;
