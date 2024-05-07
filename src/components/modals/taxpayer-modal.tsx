import { handleApiError } from 'helpers/errors';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createIndvIdentity } from 'slices/actions/identityActions';
import { userUpdate } from 'slices/actions/userActions';

interface ModalProps {
    isModalOpen: boolean;
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    closeModal: () => void;
    lgas: { id: string; name: string }[];
    wards: { id: string; name: string, lga_id: string }[];
    // refreshTableData: () => void;
}

const AddTaxpayerModal: React.FC<ModalProps> = ({ isModalOpen, formData, handleInputChange, closeModal, lgas, wards }) => {
    const [selectedLGA, setSelectedLGA] = useState<{ id: string; name: string }>({ id: '', name: '' });
    const [filteredWards, setFilteredWards] = useState<{ id: string; name: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);    

    useEffect(() => {
        // Filter wards based on selected LGA
        if (selectedLGA.id) {
            const filtered = wards.filter((ward) => ward.lga_id === selectedLGA.id);
            setFilteredWards(filtered);
        }
        if (selectedLGA.id === "") {
            setFilteredWards([])
        }
    }, [selectedLGA.id, wards]);


    const handleLGASelection = (e: React.ChangeEvent<HTMLSelectElement>) => {

        const lgaId = e.target.value;
        const lgaName = lgas.find((lga) => lga.id === lgaId)?.name || '';
        setSelectedLGA({ id: lgaId, name: lgaName });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        formData.client = selectedLGA.id
        try {
            await createIndvIdentity(formData);
            toast.success("Created Taxpayer successfully");
            // refreshTableData();
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
                <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-8 max-w-3xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Add Taxpayer</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-3 gap-4 overflow-y-auto h-96 p-2" style={{ scrollbarWidth: 'thin' }}>
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
                                    <select
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm  border-cyan-800 border  rounded-md px-3 py-2 outline-none"
                                    >
                                        <option value="">Please select</option>
                                        <option value="mrs">Mrs</option>
                                        <option value="mr">Mr</option>
                                        <option value="mss">Miss</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Firstname:</label>
                                    <input
                                        id="firstname"
                                        type="text"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm  border-cyan-800 border  rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="middlename" className="block text-sm font-medium text-gray-700">Middlename:</label>
                                    <input
                                        id="middlename"
                                        type="text"
                                        name="middlename"
                                        value={formData.middlename}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Surname:</label>
                                    <input
                                        id="surname"
                                        type="text"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block border w-full shadow-sm sm:text-sm  border-cyan-800 border rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth:</label>
                                    <input
                                        id="dob"
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender:</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="maritalstatus" className="block text-sm font-medium text-gray-700">Marital status:</label>
                                    <select
                                        id="maritalstatus"
                                        name="maritalstatus"
                                        value={formData.maritalstatus}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 "
                                    >
                                        <option value="">Select</option>
                                        <option value="married">Married</option>
                                        <option value="single">Single</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">Moble Number:</label>
                                    <input
                                        id="phonenumber"
                                        type="text"
                                        name="phonenumber"
                                        value={formData.phonenumber}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phonenumber2" className="block text-sm font-medium text-gray-700">Home Number:</label>
                                    <input
                                        id="phonenumber2"
                                        type="text"
                                        name="phonenumber2"
                                        value={formData.phonenumber2}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="bvn" className="block text-sm font-medium text-gray-700">BVN:</label>
                                    <input
                                        id="bvn"
                                        type="text"
                                        name="bvn"
                                        value={formData.bvn}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="mothersname" className="block text-sm font-medium text-gray-700">Mother's Surname:</label>
                                    <input
                                        id="mothersname"
                                        type="text"
                                        name="mothersname"
                                        value={formData.mothersname}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
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
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 "
                                    >
                                        <option value="">Select</option>
                                        {lgas.map((lga) => (
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
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
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
                                    <label htmlFor="stateofresidence" className="block text-sm font-medium text-gray-700">State of Residence:</label>
                                    <input
                                        id="stateofresidence"
                                        type="text"
                                        name="stateofresidence"
                                        defaultValue={"KOGI"}
                                        value={formData.stateofresidence}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="stateoforigin" className="block text-sm font-medium text-gray-700">State of Origin:</label>
                                    <input
                                        id="stateoforigin"
                                        type="text"
                                        name="stateoforigin"
                                        defaultValue={"KOGI"}
                                        value={formData.stateoforigin}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="birthplace" className="block text-sm font-medium text-gray-700">Birth Place:</label>
                                    <input
                                        id="birthplace"
                                        type="text"
                                        name="birthplace"
                                        defaultValue={"KOGI"}
                                        value={formData.birthplace}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Occupation:</label>
                                    <input
                                        id="occupation"
                                        type="text"
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">city:</label>
                                    <input
                                        id="city"
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="housestreet" className="block text-sm font-medium text-gray-700">housestreet:</label>
                                    <input
                                        id="housestreet"
                                        type="text"
                                        name="housestreet"
                                        value={formData.housestreet}
                                        onChange={handleInputChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
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
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
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

export default AddTaxpayerModal;
