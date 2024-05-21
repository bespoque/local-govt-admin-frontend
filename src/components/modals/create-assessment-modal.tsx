import { localGovernments } from 'components/tax-office/tax-office.interface';
import { WardsList } from 'components/tax-office/wards-interface';
import { handleApiError } from 'helpers/errors';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createAgentIdentity } from 'slices/actions/identityActions';


interface ModalProps {
    isModalOpen: boolean;
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    closeModal: () => void;
    userData: any;
    isSuperAdmin: boolean;
    
}

const AssessmentModal: React.FC<ModalProps> = ({ isModalOpen, formData, handleInputChange, closeModal, userData, isSuperAdmin }) => {
    const [localGov, setLocalGov] = useState<{ id: string; name: string }[]>([]);
    const [filteredWards, setFilteredWards] = useState<{ id: string; name: string }[]>([]);
    const [selectedLGA, setSelectedLGA] = useState<{ id: string; name: string }>({ id: '', name: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const filteredLGA = localGovernments.filter((lga) => lga.id === userData?.taxOffice?.id);
        const wardsForSelectLga = WardsList.filter((ward) => ward.lga_id === selectedLGA.id);
        setFilteredWards(wardsForSelectLga);
        setLocalGov(filteredLGA);
        // if (isSuperAdmin) {
        //     setLocalGov(localGovernments);
        //     setFilteredWards(wardsForSelectLga);
        // }
    }, [userData?.taxOffice?.id, isSuperAdmin, selectedLGA.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createAgentIdentity(formData);
            toast.success("Created Agent Successfully");
        } catch (error) {
            handleApiError(error, "There was an error creating Taxpayer");
        } finally {
            closeModal()
            setIsSubmitting(false);
        }
        setIsSubmitting(false);
    };

    const handleLGASelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lgaId = e.target.value;
        const lgaName = localGov.find((lga) => lga.id === lgaId)?.name || '';
        setSelectedLGA({ id: lgaId, name: lgaName });
    };
    return (
        <>
            {isModalOpen && (
                <div className="fixed z-50 top-0 right-0 bottom-0 flex flex-col items-end justify-start h-screen w-4/6">
                    <div className="bg-white p-6 rounded-lg h-full flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Add Agent</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4 overflow-y-auto h-96 p-2" style={{ scrollbarWidth: 'thin' }}>
                                <div>
                                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">first name:</label>
                                    <input
                                        type="text"
                                        id="firstname"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm  border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">last name:</label>
                                    <input
                                        id="lastname"
                                        type="text"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm  border-cyan-800 border bg-gray-100  rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">email:</label>
                                    <input
                                        id="email"
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="bank" className="block text-sm font-medium text-gray-700">bank:</label>
                                    <input
                                        id="bank"
                                        type="text"
                                        name="bank"
                                        value={formData.bank}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block border w-full shadow-sm sm:text-sm  border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="account_no" className="block text-sm font-medium text-gray-700">account no:</label>
                                    <input
                                        id="account_no"
                                        type="text"
                                        name="account_no"
                                        value={formData.account_no}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="bvn" className="block text-sm font-medium text-gray-700">bvn:</label>
                                    <input
                                        id="bvn"
                                        type="text"
                                        name="bvn"
                                        value={formData.bvn}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">phone:</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lga" className="block text-sm font-medium text-gray-700">LGA:</label>
                                    <select
                                        id="lga"
                                        name="lga"
                                        value={formData.lga}
                                        onChange={(e) => {
                                            handleLGASelection(e);
                                            handleInputChange(e);
                                        }}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    >
                                        <option value="">Select LGA</option>
                                        {localGov.map((lga) => (
                                            <option key={lga.id} value={lga.id}>
                                                {lga.name}
                                            </option>

                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Ward:</label>
                                    <select
                                        id="ward"
                                        name="ward"
                                        value={formData.ward}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    >
                                        <option value="">Select Ward</option>
                                        {filteredWards.map((ward) => (
                                            <option key={ward.id} value={ward.name}>
                                                {ward.name}
                                            </option>
                                        ))}
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
