import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

function SyncUser() {
    const { isSignedIn, user } = useUser();
    const [syncStatus, setSyncStatus] = useState({
        loading: false,
        error: null,
        data: null
    });

    useEffect(() => {
        if (isSignedIn && user) {
            const syncUser = async () => {
                setSyncStatus({ loading: true, error: null, data: null });
                
                try {
                    const backendUrl = import.meta.env.VITE_BACKEND_URL;
                    
                    if (!backendUrl) {
                        throw new Error('VITE_BACKEND_URL is not defined');
                    }

                    const response = await axios.post(`${backendUrl}/api/user/sync`, {
                        clerkUserId: user.id,
                        email: user.emailAddresses[0]?.emailAddress,
                        name: `${user.firstName} ${user.lastName}`.trim(),
                        imageUrl: user.imageUrl,
                    });

                    setSyncStatus({ 
                        loading: false, 
                        error: null, 
                        data: response.data 
                    });
                    
                    console.log('User synced successfully:', response.data);
                } catch (err) {
                    console.error('Failed to sync user:', err);
                    setSyncStatus({ 
                        loading: false, 
                        error: err.message, 
                        data: null 
                    });
                }
            };

            syncUser();
        }
    }, [isSignedIn, user]);

    return syncStatus;
}

export default SyncUser;