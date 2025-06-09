import React from 'react'
import { CarsList } from './components/CarsList'
import { Outlet } from 'react-router'


export const Cars = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Cars Management</h1>
            <CarsList>
                <Outlet />
            </CarsList>
        </div>
    )
}
