import React from 'react'
import { LayoutDashboard, Car, Calendar, Cog, LogOut } from "lucide-react";
import { Link } from 'react-router';
export const SideBar = () => {
    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin",
        },
        {
            label: "Cars",
            icon: Car,
            href: "/admin/cars",
        },
        {
            label: "Test Drives",
            icon: Calendar,
            href: "/admin/test-drives",
        },
        {
            label: "Settings",
            icon: Cog,
            href: "/admin/settings",
        },
    ];
    return (
        <div className="hidden md:flex h-full flex-col overflow-y-auto bg-white shadow-sm border-r">
            {routes.map((route) => {
                return (
                    <Link key={route.href} to={route.href}>
                        <route.icon className="h-5 w-5" />
                        {route.label}
                    </Link>
                )
            })}

        </div>
    )
}
