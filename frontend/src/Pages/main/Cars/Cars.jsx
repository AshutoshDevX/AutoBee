import React from 'react'
import { CarFilters } from './components/CarFilters';
import { CarListings } from './components/CarListings';
import axios from 'axios';
import { useEffect, useState } from 'react';

export const CarsPage = () => {
    const [filtersData, setFiltersData] = useState(null);
    useEffect(() => {
        try {
            const getFiltersData = async () => {
                const filtersData = await axios.get("https://autobee-backend.onrender.com/api/carfilters");
                setFiltersData(filtersData.data)
            }
            getFiltersData();
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: "Internal server error"
            })
        }

    }, [])


    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-6xl mb-4 bg-gradient-to-br from-slate-900 to-slate-600 font-extrabold tracking-tighter pr-2 pb-2 text-transparent  bg-clip-text">Browse Cars</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Section */}
                <div className="w-full lg:w-80 flex-shrink-0">
                    {filtersData && <CarFilters filters={filtersData.data} />}
                </div>

                {/* Car Listings */}
                <div className="flex-1">
                    <CarListings />
                </div>
            </div>
        </div>
    );
}
