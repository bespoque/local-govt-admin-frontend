import React, { useEffect, useState } from 'react';
import { fetchCollections } from 'slices/actions/collectionsActions';
import { handleApiError } from 'helpers/errors';
import { fetchLocalGvts } from 'slices/actions/userActions';
import { fetchIndIdentity } from 'slices/actions/identityActions';
import SectionTitle from 'components/section-title';

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

const CollectionTable: React.FC = () => {
    const [indvData, setIndvData] = useState<IndvTP[]>([]);
    const [localGovts, setLGAs] = useState<LGA[]>([]);
    const [selectedLGA, setSelectedLGA] = useState<string>('');

    useEffect(() => {
        fetchData();
        fetchLGAs();
    }, [selectedLGA]);

    const fetchData = async () => {
        try {
            const sortValue = selectedLGA !== '' ? selectedLGA : 'DEFAULT';
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

    const handleLGASelection = (lgaId: string) => {
        setSelectedLGA(lgaId);
    };

    return (
        <div>
            <SectionTitle title="Identity Management" subtitle="Individual Identity" />
            <div className="flex justify-end my-10">
                <select
                    className="px-2 py-1 border border-gray-300 rounded-md"
                    value={selectedLGA}
                    onChange={(e) => handleLGASelection(e.target.value)}
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
        </div>
    );
};

export default CollectionTable;
