import React, { useEffect, useMemo, useState } from 'react';
import { RootState, useAppSelector } from 'store';
import { Role } from 'components/user/user.interface';
import { localGovernments } from 'components/tax-office/tax-office.interface';
import AssessmentModal from 'components/modals/create-assessment-modal';
import { WardsList } from 'components/tax-office/wards-interface';
import { handleApiError } from 'helpers/errors';
import { fetchAssessment, listAssessment } from 'slices/actions/assessment';
import { formatNumber } from 'functions/numbers';
import UpdateAssessment from 'components/modals/update-assessment-modal';

interface LGA {
    id: string;
    name: string;
}
interface ASSESSMENT {
    id: string;
    client: string;
    taxid: string;
    taxidtype: string;
    status: string;
    totalamount: string;
    created: string;
}

const Assessment: React.FC = () => {
    const [localGovts, setLGAs] = useState<LGA[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const userData = useAppSelector((state: RootState) => state.auth);
    const userRoles = useMemo(() => userData.roles.map((usr) => usr.role), [userData.roles]);
    const isSuperAdmin = useMemo(() => userRoles.includes(Role.SUPERADMIN), [userRoles]);
    const wardsForLga = WardsList.filter((ward) => ward.lga_id === userData.taxOffice.id);
    const [assessmentData, setAssessmentData] = useState<ASSESSMENT[]>([]);
    const [singleAsssessmentData, setSingleAssessmentData] = useState<ASSESSMENT[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState<boolean>(false);

    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchLGAs();
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const sortValue = 'DEFAULT';
            const res = await listAssessment({ sort: sortValue });
            setAssessmentData(res.data.assessments);
        } catch (error) {
            handleApiError(error, "Could not fetch data");
        }
    };

    const fetchLGAs = async () => {
        setLGAs(localGovernments);
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
    const handleButtonClick = async (id: string) => {
        try {
            const response = await fetchAssessment({ record: id, sort: "DEFAULT" });
            setSingleAssessmentData(response?.data?.assessments[0]);
            setIsModalUpdateOpen(true);
        } catch (error) {
            handleApiError(error, "Could not retrieve taxpayer details");
            setIsModalUpdateOpen(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData: any) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleAssessmentCreated = () => {
        fetchData();
    };

    const PAGE_SIZE = 5;

    const totalPages = Math.ceil(assessmentData.length / PAGE_SIZE);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const paginatedData = assessmentData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE); 
    return (
        <div>
            <div className="flex justify-end items-center my-4">
                <button
                    className="px-4 py-2 mr-4 bg-cyan-900 text-white rounded-md shadow-md focus:outline-none hover:bg-cyan-700"
                    onClick={openModal}
                >
                    Add Assessment
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tax ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                TP Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData?.map((assessmt) => (
                            <tr key={assessmt.id} className="hover:bg-blue-100">
                                <td className="px-6 py-4 whitespace-nowrap">{assessmt.taxid}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{assessmt.taxidtype}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatNumber(Number(assessmt.totalamount))}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{assessmt.status}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{assessmt.created}</td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        className="cursor-pointer font-bold hover:underline text-cyan-800"
                                        onClick={() => handleButtonClick(assessmt.id)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center items-center my-4">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 mr-2 bg-cyan-900 text-white rounded-md shadow-md focus:outline-none hover:bg-cyan-700 ${currentPage === index + 1 ? 'bg-blue-500' : ''
                                }`}
                            style={{ backgroundColor: currentPage === index + 1 ? '#073763' : '#cad6e1' }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
            <AssessmentModal
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                formData={formData}
                handleInputChange={handleInputChange}
                userData={userData}
                isSuperAdmin={isSuperAdmin}
                wardsForLga={wardsForLga}
                onAssessmentCreated={handleAssessmentCreated} // Pass the callback
            />
            <UpdateAssessment
                isModalUpdateOpen={isModalUpdateOpen}
                closeUpdateModal={closeUpdateModal}
                singleAsssessmentData={singleAsssessmentData}
                userData={userData}
                isSuperAdmin={isSuperAdmin}
                wardsForLga={wardsForLga}
                onAssessmentCreated={handleAssessmentCreated}
            />
        </div>
    );
};

export default Assessment;
