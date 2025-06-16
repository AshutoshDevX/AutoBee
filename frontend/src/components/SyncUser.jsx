import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

function SyncUser() {
    const { isSignedIn, user } = useUser();
    const [newUser, setNewUser] = useState("")
    useEffect(() => {
        if (isSignedIn && user) {
            const syncUser = async () => {
                try {
                    const response = await axios.post('https://autobee-backend.onrender.com/api/user/sync', {
                        clerkUserId: user.id,
                        email: user.emailAddresses[0]?.emailAddress,
                        name: `${user.firstName} ${user.lastName}`,
                        imageUrl: user.imageUrl,
                    });

                    setNewUser(response)
                } catch (err) {
                    console.error('Failed to sync user:', err);
                }
            };

            syncUser();
        }
    }, [isSignedIn, user]);

    return newUser;
}

export default SyncUser;
