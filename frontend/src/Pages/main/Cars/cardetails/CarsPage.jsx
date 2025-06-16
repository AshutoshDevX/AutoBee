
import { CarDetails } from "./components/CarDetails";
import { useParams } from "react-router";
import { Error } from "../../../Error";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";


export function CarDetailsPage() {
    // Fetch car details
    const { id } = useParams();
    const { userId, isLoaded } = useAuth();
    const navigate = useNavigate();
    const [result, setResult] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getCarById = async () => {
            if (!isLoaded) return;
            if (!userId) navigate('/signin');
            try {
                const response = await axios.get("https://autobee-backend.onrender.com/api/cars", {
                    params: {
                        carId: id,
                        userId: userId
                    }
                })

                setResult(response.data)
            } catch (error) {
                setResult({ success: false });
            } finally {
                setLoading(false);
            }

        }

        getCarById();
    }, [id, userId, isLoaded])


    if (loading || !isLoaded) {
        return (
            <div className="container mx-auto px-4 py-12 animate-pulse h-[80vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image skeleton */}
                    <div className="bg-gray-300 h-64 rounded-2xl" />

                    {/* Details skeleton */}
                    <div className="space-y-4">
                        <div className="h-6 bg-gray-300 rounded w-1/2" />
                        <div className="h-4 bg-gray-300 rounded w-1/3" />
                        <div className="h-4 bg-gray-300 rounded w-2/3" />
                        <div className="h-4 bg-gray-300 rounded w-full" />
                        <div className="h-4 bg-gray-300 rounded w-5/6" />
                        <div className="h-12 bg-gray-300 rounded-xl w-40 mt-4" />
                    </div>
                </div>
            </div>
        );
    }
    // If car not found, show 404
    if (!result.success) {
        return <Error />
    }

    return (
        <div className="container mx-auto px-4 py-12">
            {result && < CarDetails car={result.data} testDriveInfo={result.data.testDriveInfo} />}
        </div>
    );
}