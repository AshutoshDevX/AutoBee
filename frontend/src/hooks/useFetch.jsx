import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export const useFetch = () => {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const fn = async ({ userId, carData, images }) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:3000/api/car/addcar', {
                userId,
                carData,
                images
            });

            console.log(response)
            setData(response);
            setError(null);
        } catch (error) {
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fn, setData };
};