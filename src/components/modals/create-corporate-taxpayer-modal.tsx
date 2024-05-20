import { handleApiError } from 'helpers/errors';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createCorpIdentity } from 'slices/actions/identityActions';


interface ModalProps {
    isModalOpen: boolean;
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    closeModal: () => void;
    lgas: { id: string; name: string }[];
    wards: { id: string; name: string, lga_id: string }[];
    userData: any
}

const AddCorporateTaxpayerModal: React.FC<ModalProps> = ({ isModalOpen, formData, handleInputChange, closeModal, lgas, wards, userData }) => {
    const [selectedLGA, setSelectedLGA] = useState<{ id: string; name: string }>({ id: '', name: '' });
    const [filteredWards, setFilteredWards] = useState<{ id: string; name: string }[]>([]);
    const [localGov, setLocalGov] = useState<{ id: string; name: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const filteredLGA = lgas.filter((lga) => lga.id === userData?.taxOffice?.id);
        const wardsForSelectLga = wards.filter((ward) => ward.lga_id === selectedLGA.id);
        setFilteredWards(wardsForSelectLga);
        setLocalGov(filteredLGA);
    }, [userData?.taxOffice?.id, selectedLGA.id, lgas, wards]);


    const handleLGASelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lgaId = e.target.value;
        const lgaName = lgas.find((lga) => lga.id === lgaId)?.name || '';
        setSelectedLGA({ id: lgaId, name: lgaName });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // formData.lga = selectedLGA.name        
        try {
            await createCorpIdentity(formData);
            toast.success("Created Taxpayer successfully");
        } catch (error) {
            handleApiError(error, "There was an error creating Taxpayer");
        } finally {
            closeModal()
            setIsSubmitting(false);
        }
        setIsSubmitting(false);
    };
    return (
        <>
            {isModalOpen && (
                <div className="fixed z-50 top-0 right-0 bottom-0 flex flex-col items-end justify-start h-screen w-4/6">
                    <div className="bg-white p-6 rounded-lg h-full flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Add Corporate Taxpayer</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-3 gap-4 overflow-y-auto h-96 p-2" style={{ scrollbarWidth: 'thin' }}>
                                <div>
                                    <label htmlFor="companyname" className="block text-sm font-medium text-gray-700">company name:</label>
                                    <input
                                        type="text"
                                        id="companyname"
                                        name="companyname"
                                        value={formData.companyname}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm  border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="registeredname" className="block text-sm font-medium text-gray-700">registered name:</label>
                                    <input
                                        id="registeredname"
                                        type="text"
                                        name="registeredname"
                                        value={formData.registeredname}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm  border-cyan-800 border bg-gray-100  rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="businesstype" className="block text-sm font-medium text-gray-700">business type:</label>
                                    <input
                                        id="businesstype"
                                        type="text"
                                        name="businesstype"
                                        value={formData.businesstype}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="rc" className="block text-sm font-medium text-gray-700">rc:</label>
                                    <input
                                        id="rc"
                                        type="text"
                                        name="rc"
                                        value={formData.rc}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block border w-full shadow-sm sm:text-sm  border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="regno" className="block text-sm font-medium text-gray-700">Reg no:</label>
                                    <input
                                        id="regno"
                                        type="text"
                                        name="regno"
                                        value={formData.regno}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="companytin" className="block text-sm font-medium text-gray-700">company Tin:</label>
                                    <input
                                        id="companytin"
                                        type="text"
                                        name="companytin"
                                        value={formData.companytin}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="datecommenced" className="block text-sm font-medium text-gray-700">date commenced:</label>
                                    <input
                                        type="date"
                                        id="datecommenced"
                                        name="datecommenced"
                                        value={formData.datecommenced}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="dateincorporated" className="block text-sm font-medium text-gray-700">date incorporated:</label>
                                    <input
                                        type="date"
                                        id="dateincorporated"
                                        name="dateincorporated"
                                        value={formData.dateincorporated}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="sector" className="block text-sm font-medium text-gray-700">sector:</label>
                                    <select
                                        id="sector"
                                        name="sector"
                                        value={formData.sector}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 "
                                    >
                                        <option value="">Select</option>
                                        <option value="Agric">Agric</option>
                                        <option value="Education">Education</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Moble Number:</label>
                                    <input
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="alternatephone" className="block text-sm font-medium text-gray-700">Alternate phone:</label>
                                    <input
                                        id="alternatephone"
                                        type="text"
                                        name="alternatephone"
                                        value={formData.alternatephone}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
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
                                    <label htmlFor="houseno" className="block text-sm font-medium text-gray-700">houseno:</label>
                                    <input
                                        id="houseno"
                                        type="text"
                                        name="houseno"
                                        value={formData.houseno}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City:</label>
                                    <input
                                        id="city"
                                        type="text"
                                        name="city"
                                        value={formData.city}
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
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 "
                                    >
                                        <option value="">Select</option>
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
                      
                                <div>
                                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street:</label>
                                    <input
                                        id="street"
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                                    />
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

export default AddCorporateTaxpayerModal;
