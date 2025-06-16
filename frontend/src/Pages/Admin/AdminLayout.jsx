import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useContext } from 'react';
import { AdminContext } from '../../components/AdminContext';
import { SideBar } from '../../components/SideBar';
import { Outlet } from 'react-router';


export const AdminLayout = () => {

    const { userId, isSignedIn, isLoaded } = useAuth();
    const [authorized, setAuthorized] = useState(true);
    const navigate = useNavigate();
    const [isAdminPage, setIsAdminPage] = useContext(AdminContext);
    useEffect(() => {
        if (isLoaded && isSignedIn && userId) {
            const admin = async () => {
                try {
                    const response = await axios.get(`https://autobee-backend.onrender.com/api/admin/${userId}`);
                    setAuthorized(response.data.authorized);
                    setIsAdminPage(true);
                } catch (err) {
                    setAuthorized(false);
                    console.error('Failed:', err);
                    setIsAdminPage(false);
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


    if (isSignedIn === undefined && isAdminPage == false) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    return (
        <div>
            <div className="h-full">
                <div className="flex h-full w-56 flex-col fixed top-17 inset-y-0 z-50">
                    <SideBar />
                </div>

                <main className="md:pl-56  h-full">
                    <Outlet />
                </main>
                <div className="flex h-[10vh] w-56 flex-col inset-y-0 z-50">
                </div>
            </div>
        </div>

    )
}
