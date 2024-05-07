import React, { useEffect, useState } from 'react';
import { handleApiError } from 'helpers/errors';
import { fetchLocalGvts, fetchWards } from 'slices/actions/userActions';
import { fetchIndIdentity } from 'slices/actions/identityActions';
import AddTaxpayerModal from 'components/modals/taxpayer-modal';

interface IndvTP {
    id: string;
    firstname: string;
    surname: string;
    email: string;
    gender: string;
    lga: string;
    created: string;
}

interface LGA {
    id: string;
    name: string;
}

interface Ward {
    id: string;
    name: string;
    lga_id: string;
    category: string;
}

const IndividualTaxpayers: React.FC = () => {
    const [indvData, setIndvData] = useState<IndvTP[]>([]);
    const [localGovts, setLGAs] = useState<LGA[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedLGA, setSelectedLGA] = useState<{ id: string; name: string }>({ id: '', name: '' });
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        idformat: "IND",
        title: "",
        surname: "",
        firstname: "",
        middlename: "",
        dob: "",
        phonenumber: "",
        gender: "",
        maritalstatus: "",
        stateofresidence: "",
        lga: "",
        bvn: "",
        email: "",
        phonenumber2: "",
        stateoforigin: "",
        birthplace: "",
        occupation: "",
        mothersname: "",
        houseno: "",
        housestreet: "",
        ward: "",
        city: "",
        nationality: "NIGERIAN"
    });

    useEffect(() => {
        fetchData();
        fetchLGAs();
        fetchWardsData();
    }, [selectedLGA]);

    const fetchData = async () => {
        try {
            const sortValue = selectedLGA.id !== '' ? selectedLGA.id : 'DEFAULT';
            const res = await fetchIndIdentity({ sort: sortValue });
            setIndvData(res.data.identity_individuals);
        } catch (error) {
            handleApiError(error, "Could not group details");
        }
    };

    const fetchLGAs = async () => {
        try {
            const response = await fetchLocalGvts({ sort: "ALL" });
            setLGAs(response.data.lgas);
        } catch (error) {
            handleApiError('Error fetching LGAs:', error);
        }
    };
    const fetchWardsData = async () => {
        try {
            const response = await fetchWards({ sort: "ALL" });
            setWards(response.data.lgas);
        } catch (error) {
            handleApiError('Error fetching Wards:', error);
        }
    };

    

    const handleLGASelectionAdmin = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lgaId = e.target.value;
        const lgaName = localGovts.find((lga) => lga.id === lgaId)?.name || '';
        setSelectedLGA({ id: lgaId, name: lgaName });
    };




    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div>
            <div className="flex justify-end items-center my-4">
                <button
                    className="px-4 py-2 mr-4 bg-cyan-900 text-white rounded-md shadow-md focus:outline-none hover:bg-cyan-700"
                    onClick={openModal}
                >
                    Add Taxpayer
                </button>
                <div className="flex">
                    <select
                        className="px-4 py-2 border border-cyan-900 rounded-md shadow-md focus:outline-none focus:border-blue-500"
                        value={selectedLGA.id}
                        onChange={handleLGASelectionAdmin}
                    >
                        <option value="">Select LGA</option>
                        <option value="ALL">ALL</option>
                        {localGovts.map((lga) => (
                            <option key={lga.id} value={lga.id}>
                                {lga.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                firstname
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                surname
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                gender
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                lga
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {indvData?.map((taxp) => (
                            <tr key={taxp.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{taxp.firstname}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{taxp.surname}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{taxp.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{taxp.gender}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{taxp.lga}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{taxp.created}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <AddTaxpayerModal
                isModalOpen={isModalOpen}
                formData={formData}
                handleInputChange={handleInputChange}
                closeModal={closeModal}
                lgas={localGovts}
                wards={wards}
                // refreshTableData={fetchData} 
            />
        </div>
    );
};

export default IndividualTaxpayers;
