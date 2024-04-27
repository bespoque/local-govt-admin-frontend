import { handleApiError } from 'helpers/errors';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { fetchGroup } from 'slices/actions/rolesActions';


const Index: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [groupData, setGroupData] = useState(null);
    const router = useRouter();
    const userSlug = router?.query?.id;
    useEffect(() => {
        if (!userSlug) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data } = await fetchGroup({ groupid: userSlug });
                setGroupData(data);
            } catch (error) {
                handleApiError(error, "Could not retrieve group details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userSlug]);



    return (
        <React.Fragment>
            <p>single group</p>
        </React.Fragment>
    );
};

export default Index;
