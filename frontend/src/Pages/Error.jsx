import React from 'react';
import { Link } from 'react-router';
import { AlertTriangle } from 'lucide-react';

export const Error = () => {
    return (
        <div className="min-h-screen bg-white-900 text-black flex flex-col items-center justify-center px-4">
            <AlertTriangle size={60} className="text-red-500 mb-4" />
            <h1 className="text-5xl font-bold mb-2">404</h1>
            <p className="text-lg text-black-300 mb-6">Oops! The page you're looking for doesn't exist.</p>
            <Link to="/">
                <button className="bg-black text-white font-semibold px-6 py-2 rounded hover:bg-gray-600 transition">
                    Go Home
                </button>
            </Link>
        </div>
    );
};


