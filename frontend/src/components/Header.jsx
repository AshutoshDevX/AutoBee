import React, { useState } from 'react'
import { Link } from 'react-router'
import AutobeeLogo from '../assets/AutoBeeLogo.png'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, CarFront, Heart, Layout } from 'lucide-react';
import SyncUser from './SyncUser';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AdminContext } from './AdminContext.jsx';

export const Header = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    const user = SyncUser();
    const { isSignedIn } = useUser();
    const [isAdminPage] = useContext(AdminContext);
    useEffect(() => {
        if (isSignedIn && user) {
            setIsAdmin(user.data.user.role)
        }
    }, [user]);


    return (
        <header className="sticky top-0 bg-gray-900 w-full backdrop-blur-md z-100">
            <nav className="mx-auto px-4 py-2 flex items-center justify-between">
                <Link to={"/"} className="flex">
                    <img src={AutobeeLogo} alt="autobee logo" className="w-30" />
                    {isAdminPage && (<span className="text-sm text-white bg-red font-extralight">admin</span>)}
                </Link>
                <div className="flex items-center space-x-4">
                    {
                        isAdminPage ? (
                            <Link to={"/"}>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <ArrowLeft size={18} />
                                    <span className="hidden md:inline">Back to App</span>
                                </Button>
                            </Link>) : (
                            <SignedIn>
                                <Link to={"/savedcars"}>
                                    <Button className="bg-slate-700">
                                        <Heart size={18} />
                                        <span className="hidden md:inline">Saved Cars</span>
                                    </Button>
                                </Link>
                                {isAdmin === "USER" ? <Link to={"/reservations"}>
                                    <Button variant="outline">
                                        <CarFront size={18} />
                                        <span className="hidden md:inline">My Reservations</span>
                                    </Button>
                                </Link> :
                                    <Link to={"/admin"}>
                                        <Button variant="outline">
                                            <Layout size={18} />
                                            <span className="hidden md:inline">Admin Portal</span>
                                        </Button>
                                    </Link>}
                            </SignedIn>
                        )
                    }
                    <SignedOut>
                        {!isAdminPage && (
                            <SignInButton forceRedirectUrl="/">
                                <Button variant="outline">Login</Button>
                            </SignInButton>
                        )}
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10",
                                },
                            }} />
                    </SignedIn>
                </div>
            </nav>
        </header>
    )
}
