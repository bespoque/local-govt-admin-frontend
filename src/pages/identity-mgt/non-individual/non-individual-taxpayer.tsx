import React, { useEffect, useState } from 'react';
import { handleApiError } from 'helpers/errors';
import { fetchLocalGvts, fetchWards } from 'slices/actions/userActions';
import { fetchCorporateIndIdentity, fetchSingleCorpTp, updateSingleIndTp } from 'slices/actions/identityActions';
import UpdateIndividual from 'components/modals/update-individual-modal';
import { toast } from 'react-toastify';
import AddCorporateTaxpayerModal from 'components/modals/create-corporate-taxpayer-modal';
import { RootState, useAppSelector } from 'store';
import { Role } from 'components/user/user.interface';

interface CorporateTP {
    id: string;
    companyname: string;
    businesstype: string;
    regno: string;
    email: string;
    rc: string;
    phone: string;
    sector: string;
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

const NonIndividualTaxpayers: React.FC = () => {
    const [corporateData, setCorporateData] = useState<CorporateTP[]>([]);
    const [localGovts, setLGAs] = useState<LGA[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedLGA, setSelectedLGA] = useState<{ id: string; name: string }>({ id: '', name: '' });
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [singleTpayer, setSingleTpayerDataData] = useState<any>(null);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState<boolean>(false);
    const userData = useAppSelector((state: RootState) => state.auth);
    const userRoles = userData.roles
        .map((usr) => usr.role);
    const isSuperAdmin = userRoles.some((userRole) =>
        [
            Role.ADMIN,
        ].includes(userRole)
    )
    const [formData, setFormData] = useState({
        companyname: "",
        registeredname: "",
        businesstype: "Corporate",
        rc: "",
        regno: "",
        lineofbusiness: "",
        datecommenced: "",
        dateincorporated: "",
        sector: "",
        phone: "",
        alternatephone: "",
        email: "",
        houseno: "",
        lga: "",
        street: "",
        city: "",
        state: "",
        companytin: "",
        ward: ""
    });

    useEffect(() => {
        fetchData();
        fetchLGAs();
        fetchWardsData();
    }, [selectedLGA]);

    const fetchData = async () => {
        try {
            const sortValue = selectedLGA.id !== '' ? selectedLGA.id : 'DEFAULT';
            const res = await fetchCorporateIndIdentity({ sort: sortValue });
            setCorporateData(res.data.identity_corporate);
        } catch (error) {
            handleApiError(error, "Could not fetch data");
        }
    };

    const fetchLGAs = async () => {
        try {
            if (isSuperAdmin) {
                const response = await fetchLocalGvts({ sort: "ALL" });
                setLGAs(response.data.lgas);

            }else{
                const response = await fetchLocalGvts({ sort: "ALL" });
                setLGAs(response.data.lgas);
            }
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



    const handleButtonClick = async (id: string) => {
        try {
            const response = await fetchSingleCorpTp({ record: id, sort: "Default" });
            setSingleTpayerDataData(response?.data?.identity_corporate[0]);
            setIsModalUpdateOpen(true);
        } catch (error) {
            handleApiError(error, "Could not retrieve taxpayer details");
            setIsModalUpdateOpen(false);
        }
    };
    const handleUpdateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const updateTaxpayer = {
            record: singleTpayer.id,
            idformat: singleTpayer.idformat,
            title: formData.get("title") as string,
            surname: formData.get("surname") as string,
            firstname: formData.get("firstname") as string,
            middlename: formData.get("middlename") as string,
            dob: formData.get("dob") as string,
            phonenumber: formData.get("phonenumber") as string,
            gender: formData.get("gender") as string,
            maritalstatus: formData.get("maritalstatus") as string,
            stateofresidence: formData.get("stateofresidence") as string,
            lga: formData.get("lga") as string,
            bvn: formData.get("bvn") as string,
            email: formData.get("email") as string,
            phonenumber2: formData.get("phonenumber2") as string,
            stateoforigin: formData.get("stateoforigin") as string,
            birthplace: formData.get("birthplace") as string,
            occupation: formData.get("occupation") as string,
            mothersname: formData.get("mothersname") as string,
            houseno: formData.get("houseno") as string,
            housestreet: formData.get("housestreet") as string,
            ward: formData.get("ward") as string,
            city: formData.get("city") as string,
            nationality: formData.get("nationality") as string,
        }

        try {
            await updateSingleIndTp(updateTaxpayer);
            toast.success("Taxpayer updated successfully");
            setIsModalUpdateOpen(false);
        } catch (error) {
            handleApiError(error, "There was an error updating Taxpayer");
        } finally {
            setIsModalUpdateOpen(false);
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

    const closeUpdateModal = () => {
        setIsModalUpdateOpen(false);
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
                    Add Corporate Taxpayer
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
                                company name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                business type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                reg no
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                rc no
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                phone
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                sector
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
                        {corporateData?.map((taxp) => (
                            <tr key={taxp.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{taxp.companyname}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{taxp.businesstype}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{taxp.regno}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{taxp.rc}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{taxp.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{taxp.sector}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{taxp.lga}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{taxp.created}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        className="cursor-pointer font-bold hover:underline text-cyan-800"
                                        onClick={() => handleButtonClick(taxp.id)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <AddCorporateTaxpayerModal
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                formData={formData}
                handleInputChange={handleInputChange}
                lgas={localGovts}
                wards={wards}
            />
            <UpdateIndividual
                isModalUpdateOpen={isModalUpdateOpen}
                closeUpdateModal={closeUpdateModal}
                singleTpayer={singleTpayer}
                handleUpdateSubmit={handleUpdateSubmit}

            />
        </div>
    );
};

export default NonIndividualTaxpayers;
