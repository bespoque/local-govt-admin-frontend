import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { localGovernments } from 'components/tax-office/tax-office.interface';
import { WardsList } from 'components/tax-office/wards-interface';
import { handleApiError } from 'helpers/errors';
import { createAgentIdentity, fetchSingleIndTpById } from 'slices/actions/identityActions';

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

const revHeadData: RevenueHead[] = [
    {
        "id": "1",
        "head": "Shops and Kiosks"
    },
    {
        "id": "2",
        "head": "Tenement Rate (Private and Commercial Property)"
    },
    {
        "id": "3",
        "head": "Slaughter Slab Fees"
    },
    {
        "id": "4",
        "head": "Merriment and Road Closure Levies"
    },
    {
        "id": "5",
        "head": "Food License Permit (For restaurants, bakeries and other places where food is sold)"
    },
    {
        "id": "6",
        "head": "Liquor License Fees"
    },
    {
        "id": "7",
        "head": "Radio and Television License Fees (other than radio and television transmitter)"
    },
    {
        "id": "8",
        "head": "Naming of Street Registration Fee (Outside State Capital)"
    },
    {
        "id": "9",
        "head": "Right of Occupancy fees on lands in the Rural Areas, excluding those collectible by the Federal and State Governments excluding State Capital)"
    },
    {
        "id": "10",
        "head": "Markets and Levies Excluding Markets where State Finance is Involved"
    },
    {
        "id": "11",
        "head": "Motor Park Levies"
    },
    {
        "id": "12",
        "head": "Bicycle, Truck, Canoe, Wheelbarrow and Cart Fees other than Mechanically Propelled Truck "
    },
    {
        "id": "13",
        "head": "Cattle Tax Payable by Catle Farmer only"
    },
    {
        "id": "14",
        "head": "Religious Places Establishment Fees"
    },
    {
        "id": "15",
        "head": "Signboard and Advertisement Permit Fee "
    },
    {
        "id": "16",
        "head": "Public Convinience, Sewage and Refuse Fees"
    },
    {
        "id": "17",
        "head": "Wrong Parking Charges"
    },
    {
        "id": "18",
        "head": "Other Levies and Fees"
    },
    {
        "id": "19",
        "head": "Marriage, Birth, Death Registration Fees"
    }
];

const categoriesData: Category[] = [
    {
        "id": "1",
        "revenue_head_id": "1",
        "revenue_category_name": "Shop Permits"
    },
    {
        "id": "2",
        "revenue_head_id": "1",
        "revenue_category_name": "Kiosk Permit"
    },
    {
        "id": "3",
        "revenue_head_id": "1",
        "revenue_category_name": "Container/Temporary Shop"
    },
    {
        "id": "4",
        "revenue_head_id": "1",
        "revenue_category_name": "Workshop Permits by Artisans (Carpenters, Mechanics and Vulcanizers) etc"
    }
];

const itemsData: Item[] = [
    {
        "revenue_category_id": "1",
        "revenue_head_id": "1",
        "revenue_item": "Small ",
        "category_a": " 3,000.00 ",
        "category_a_wards": [],
        "category_b": " 2,400.00 ",
        "category_b_wards": [
            "3",
            "5",
            "7",
            "8"
        ],
        "category_c": " 1,200.00 ",
        "category_c_wards": [
            "1",
            "2",
            "4",
            "6",
            "9",
            "10"
        ]
    },
    {
        "revenue_category_id": "2",
        "revenue_head_id": "1",
        "revenue_item": "Medium ",
        "category_a": " 5,000.00 ",
        "category_a_wards": [],
        "category_b": "",
        "category_b_wards": [
            "3",
            "5",
            "7",
            "8"
        ],
        "category_c": "",
        "category_c_wards": [
            "1",
            "2",
            "4",
            "6",
            "9",
            "10"
        ]
    },
    {
        "revenue_category_id": "3",
        "revenue_head_id": "1",
        "revenue_item": "Large",
        "category_a": " 10,000.00 ",
        "category_a_wards": [],
        "category_b": " 8,000.00 ",
        "category_b_wards": [
            "3",
            "5",
            "7",
            "8"
        ],
        "category_c": " 5,000.00 ",
        "category_c_wards": [
            "1",
            "2",
            "4",
            "6",
            "9",
            "10"
        ]
    },
    {
        "revenue_category_id": "4",
        "revenue_head_id": "1",
        "revenue_item": "Ex-Large (Big Departmental Stores)",
        "category_a": " 200,000.00 ",
        "category_a_wards": [],
        "category_b": "",
        "category_b_wards": [
            "3",
            "5",
            "7",
            "8"
        ],
        "category_c": "",
        "category_c_wards": [
            "1",
            "2",
            "4",
            "6",
            "9",
            "10"
        ]
    }
];

const AssessmentModal: React.FC<ModalProps> = ({ isModalOpen, formData, closeModal, isSuperAdmin }) => {
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

    useEffect(() => {
        setRevenueHeads(revHeadData);
    }, []);

    
    useEffect(() => {
        if (revenueHead) {
            setCategories(categoriesData.filter(cat => cat.revenue_head_id === revenueHead));
        } else {
            setCategories([]);
        }
    }, [revenueHead]);

    useEffect(() => {
        if (category) {
            setItems(itemsData.filter(itm => itm.revenue_category_id === category));
        } else {
            setItems([]);
        }
    }, [category]);

    useEffect(() => {
        if (userData?.taxOffice?.id) {
            setLocalGov(localGovernments.filter(lga => lga.id === userData.taxOffice.id));
        }
        setFilteredWards(WardsList.filter(ward => ward.lga_id === selectedLGA.id));
    }, [userData?.taxOffice?.id, isSuperAdmin, selectedLGA.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, setState: React.Dispatch<React.SetStateAction<string>>) => {
        setState(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setUserData(null);

        try {
            const response = await fetchSingleIndTpById({ sort: "ALL", record: taxId, param: "taxid" });
            if (response.data.status === "200") {
                setUserData(response.data.identity_individuals[0]);
            } else {
                setError(response.data.message || 'Failed to fetch data');
            }
        } catch (err) {
            setError('An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            {isModalOpen && (
                <div className="fixed z-50 top-0 right-0 bottom-0 flex flex-col items-end justify-start h-screen w-4/6">
                    <div className="bg-white p-6 rounded-lg h-full flex flex-col justify-center overflow-y-auto h-96 p-2" style={{ scrollbarWidth: 'thin' }}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Add Assessment</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mb-4">
                            <label htmlFor="taxid" className="block text-sm font-medium text-gray-700">
                                Tax ID
                            </label>
                            <input
                                type="text"
                                id="taxid"
                                value={taxId}
                                onChange={(e) => handleInputChange(e, setTaxId)}
                                className="mt-1 p-2 block border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600">
                                Lookup
                            </button>
                        </form>

                        {loading && <p>Loading...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {userData && (
                            <div className="mt-4 p-4 border border-gray-300 rounded-md">
                                <p><strong>First Name:</strong> {userData.firstname}</p>
                                <p><strong>Last Name:</strong> {userData.surname}</p>
                                <p><strong>Email:</strong> {userData.email}</p>
                                <p><strong>Phone Number:</strong> {userData.phonenumber}</p>
                                <p><strong>ID Format:</strong> {userData.idformat}</p>
                            </div>
                        )}

                        <form>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="revenueHead" className="block text-sm font-medium text-gray-700">Revenue Head</label>
                                    <select
                                        id="revenueHead"
                                        value={revenueHead}
                                        onChange={(e) => handleInputChange(e, setRevenueHead)}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Select Item</option>
                                        {items.map((itm) => (
                                            <option key={itm.revenue_category_id} value={itm.revenue_item}>{itm.revenue_item}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                        
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AssessmentModal;
