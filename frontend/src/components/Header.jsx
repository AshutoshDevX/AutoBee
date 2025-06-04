import React from 'react'
import { Link } from 'react-router'
import AutobeeLogo from '../assets/AutobeeLogo.png'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, CarFront, Heart, Layout } from 'lucide-react';
export const Header = ({ isAdminPage = false }) => {

    const isAdmin = false;
    return (
        <header className="sticky top-0 bg-slate-900 w-full backdrop-blur-md z-100">
            <nav className="mx-auto px-4 py-2 flex items-center justify-between">
                <Link to={isAdminPage ? "/admin" : "/"} className="flex">
                    <img src={AutobeeLogo} alt="autobee logo" className="w-30" />
                    {isAdminPage && (<span className="text-xs font-extralight">admin</span>)}
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
                                <Link to={"/saved-cars"}>
                                    <Button className="bg-slate-700">
                                        <Heart size={18} />
                                        <span className="hidden md:inline">Saved Cars</span>
                                    </Button>
                                </Link>
                                {!isAdmin ? <Link to={"/reservations"}>
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
                        <SignInButton forceRedirectUrl="/">
                            <Button variant="outline">Login</Button>
                        </SignInButton>
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
