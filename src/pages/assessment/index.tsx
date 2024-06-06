import React, { useEffect, useMemo, useState } from 'react';
import { RootState, useAppSelector } from 'store';
import { Role } from 'components/user/user.interface';
import { localGovernments } from 'components/tax-office/tax-office.interface';
import AssessmentModal from 'components/modals/create-assessment-modal';
import { WardsList } from 'components/tax-office/wards-interface';


interface LGA {
    id: string;
    name: string;
}


const Agents: React.FC = () => {
    const [localGovts, setLGAs] = useState<LGA[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const userData = useAppSelector((state: RootState) => state.auth);
    const userRoles = useMemo(() => userData.roles.map((usr) => usr.role), [userData.roles]);
    const isSuperAdmin = useMemo(() => userRoles.includes(Role.SUPERADMIN), [userRoles]);
    const wardsForLga = WardsList.filter((ward) => ward.lga_id === userData.taxOffice.id);
    
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        bank: "",
        account_no: "",
        bvn: "",
        phone: "",
        lga: "",
        ward: "",
    });

    useEffect(() => {
        fetchLGAs();
    }, []);


    const fetchLGAs = async () => {
        setLGAs(localGovernments);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (['phone', 'account_no', 'bvn'].includes(name)) {
            const isValid = /^\d*$/.test(value);
            if (!isValid) {
                // toast.error("Only digits are allowed for Phone, Account No, and BVN fields.");
                return;
            }
        }
        setFormData((prevFormData: any) => ({
            ...prevFormData,
            [name]: value
        }));
    };



    


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
                                Assess.ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tax ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                TP Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                LGA
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

                    </tbody>
                </table>
            </div>




            <AssessmentModal
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                formData={formData}
                handleInputChange={handleInputChange}
                userData={userData}
                isSuperAdmin={isSuperAdmin}
                wardsForLga={wardsForLga}
            />
        </div>
    );
};

export default Agents;
