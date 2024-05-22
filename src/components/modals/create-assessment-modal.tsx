import { localGovernments } from 'components/tax-office/tax-office.interface';
import { WardsList } from 'components/tax-office/wards-interface';
import { handleApiError } from 'helpers/errors';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createAgentIdentity, fetchSingleIndTpById } from 'slices/actions/identityActions';
import axios from 'axios';

interface ModalProps {
    isModalOpen: boolean;
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    closeModal: () => void;
    userData: any;
    isSuperAdmin: boolean;

}

const AssessmentModal: React.FC<ModalProps> = ({ isModalOpen, formData, closeModal, isSuperAdmin }) => {
    const [localGov, setLocalGov] = useState<{ id: string; name: string }[]>([]);
    const [filteredWards, setFilteredWards] = useState<{ id: string; name: string }[]>([]);
    const [selectedLGA, setSelectedLGA] = useState<{ id: string; name: string }>({ id: '', name: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [taxId, setTaxId] = useState('');
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaxId(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setUserData(null);

        try {
            const response = await fetchSingleIndTpById({
                sort: "ALL",
                record: taxId,
                param: "taxid"
            });

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

    useEffect(() => {
        const filteredLGA = localGovernments.filter((lga) => lga.id === userData?.taxOffice?.id);
        const wardsForSelectLga = WardsList.filter((ward) => ward.lga_id === selectedLGA.id);
        setFilteredWards(wardsForSelectLga);
        setLocalGov(filteredLGA);
    }, [userData?.taxOffice?.id, isSuperAdmin, selectedLGA.id]);



    const handleLGASelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lgaId = e.target.value;
        const lgaName = localGov.find((lga) => lga.id === lgaId)?.name || '';
        setSelectedLGA({ id: lgaId, name: lgaName });
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

                        <div className="">
                            <form onSubmit={handleSubmit} className="mb-4">
                                <label htmlFor="taxid" className="block text-sm font-medium text-gray-700">
                                    Tax ID
                                </label>
                                <input
                                    type="text"
                                    id="taxid"
                                    value={taxId}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 block border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <button
                                    type="submit"
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
                                >
                                    Lookup
                                </button>
                            </form>

                            <div className="my-2">
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
                            </div>
                        </div>

                        <form>
                            <div className="grid grid-cols-3 gap-4">

                                <div>
                                    <label htmlFor="lga" className="block text-sm font-medium text-gray-700">Revenue Head:</label>
                                    <select
                                        id="lga"
                                        name="lga"
                                        value={formData.lga}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    >
                                        <option value="">Select Head</option>
                                        <option>
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="lga" className="block text-sm font-medium text-gray-700">Categories:</label>
                                    <select
                                        id="lga"
                                        name="lga"
                                        value={formData.lga}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    >
                                        <option value="">Select Category</option>
                                        <option>
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="lga" className="block text-sm font-medium text-gray-700">Items:</label>
                                    <select
                                        id="lga"
                                        name="lga"
                                        value={formData.lga}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    >
                                        <option value="">Select Item</option>
                                        <option>
                                        </option>
                                    </select>
                                </div>

                            </div>
                            <div className="flex justify-end mt-4">
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-cyan-800 text-white rounded-md shadow-md focus:outline-none hover:bg-cyan-700">
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                                <button onClick={closeModal} className="ml-2 px-4 py-2 border border-cyan-800 rounded-md shadow-md focus:outline-none hover:bg-gray-100">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AssessmentModal;
