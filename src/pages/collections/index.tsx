import React, { useEffect, useMemo, useState } from 'react';
import { fetchCollections } from 'slices/actions/collectionsActions';
import { handleApiError } from 'helpers/errors';
import { fetchLocalGvts } from 'slices/actions/userActions';
import SectionTitle from 'components/section-title';
import { localGovernments } from 'components/tax-office/tax-office.interface';
import { RootState, useAppSelector } from 'store';
import { Role } from 'components/user/user.interface';

interface Collection {
    id: string;
    clientid: string;
    paymentref: string;
    taxpayerid: string;
    taxpayername: string;
    category: string;
    amount: string;
    paymentmethod: string;
    status: string;
    agent: string;
    created: string;
}

interface LGA {
    id: string;
    name: string;
}

const CollectionTable: React.FC = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [localGovts, setLGAs] = useState<LGA[]>([]);
    const [selectedLGA, setSelectedLGA] = useState<string>('');
    const userData = useAppSelector((state: RootState) => state.auth);
    const userRoles = useMemo(() => userData.roles.map((usr) => usr.role), [userData.roles]);
    const isSuperAdmin = useMemo(() => userRoles.includes(Role.SUPERADMIN), [userRoles]);

    useEffect(() => {
        fetchData();
        fetchLGAs();
    }, [selectedLGA]);

    const fetchData = async () => {
        try {
            const sortValue = selectedLGA !== '' ? selectedLGA : 'DEFAULT';
            const res = await fetchCollections({ sort: sortValue });
            setCollections(res.data.collections);
        } catch (error) {
            handleApiError(error, "Could not group details");
        }
    };

    const fetchLGAs = async () => {
        setLGAs(localGovernments);
        // try {
        //     const response = await fetchLocalGvts({ sort: "ALL" });
        // } catch (error) {
        //     handleApiError('Error fetching LGAs:', error);
        // }
    };

    const handleLGASelection = (lgaId: string) => {
        setSelectedLGA(lgaId);
    };

    return (
        <div>
            <SectionTitle title="Collections" subtitle="Collections" />
            {isSuperAdmin && (
                <div className="flex justify-end my-10">
                    <select
                        className="px-4 py-2 border border-cyan-900 rounded-md shadow-md focus:outline-none focus:border-blue-500"
                        value={selectedLGA}
                        onChange={(e) => handleLGASelection(e.target.value)}
                    >
                        <option value="">Select LGA</option>
                        <option value="ALL">ALL</option>
                        {localGovts?.map((lga) => (
                            <option key={lga.id} value={lga.id}>
                                {lga.name}
                            </option>
                        ))}
                    </select>
                </div>

            )}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Payment Ref
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Taxpayer ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Taxpayer Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Payment Method
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Agent
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {collections?.map((collection) => (
                            <tr key={collection.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{collection.paymentref}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{collection.taxpayerid}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{collection.taxpayername}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{collection.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{collection.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{collection.paymentmethod}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{collection.agent}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{collection.created}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CollectionTable;
