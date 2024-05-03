import React, { useEffect, useState } from 'react';
import { fetchCollections } from 'slices/actions/collectionsActions';
import { handleApiError } from 'helpers/errors';

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

const CollectionTable: React.FC = () => {
    const [collections, setCollections] = useState<Collection[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchCollections({ sort: "2" });
                setCollections(res.data.collections);
            } catch (error) {
                handleApiError(error, "Could not group details");
            }
        };

        fetchData();
    }, []);

    return (
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
                    {collections.map(collection => (
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
    );
};

export default CollectionTable;
