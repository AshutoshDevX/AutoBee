import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router';


export const AdminLayout = () => {

    const { userId, isSignedIn, isLoaded } = useAuth();
    const [authorized, setAuthorized] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        if (isLoaded && isSignedIn && userId) {
            const admin = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/api/admin/${userId}`);
                    setAuthorized(response.data.authorized);
                } catch (err) {
                    setAuthorized(false);
                    console.error('Failed:', err);
                }
            };

            admin();
        }
    }, [isSignedIn, userId]);
    useEffect(() => {
        if (isLoaded && (!isSignedIn || !authorized)) {
            navigate('/');
        }
    }, [isLoaded, isSignedIn, authorized, navigate]);


    if (isSignedIn === undefined) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    return (
        <>
            {authorized && isSignedIn && <div>a;lsdkfja;sdfkjaf;dlkj</div>}
        </>
    )
}
