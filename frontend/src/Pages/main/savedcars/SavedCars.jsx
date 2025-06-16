import { SavedCarsList } from "./SavedCarsList";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
export default function SavedCars() {
    // Check authentication on server
    const { userId, isLoaded } = useAuth();
    const navigate = useNavigate();
    const [savedCarsResult, setSavedCarsResult] = useState(null);

    // Fetch saved cars on the server
    useEffect(() => {
        if (!isLoaded) return;
        if (!userId) {
            navigate("/sign-in");
        }
        const getSavedCars = async () => {
            try {

                const response = await axios.get(`http://localhost:3000/api/savedcars/${userId}`);

                setSavedCarsResult(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        getSavedCars();
    }, [userId, isLoaded])


    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-5xl mb-6 bg-gradient-to-br from-slate-900 to-slate-600 font-extrabold tracking-tighter pr-2 pb-2 text-transparent  bg-clip-text">Your Saved Cars</h1>
            {savedCarsResult && <SavedCarsList initialData={savedCarsResult} />}
        </div>
    );
}