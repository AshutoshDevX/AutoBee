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


            setData(response);
            setError(null);
        } catch (error) {
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    const fnAi = async (uploadedAiImage) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:3000/api/car/processcar', {
                uploadedAiImage
            });
            setData(response);
            setError(null);
        } catch (error) {
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    const fetchCars = async (userId, search) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post("http://localhost:3000/api/car", {
                userId,
                search
            });

            setData(response.data);
            setError(null);
        } catch (error) {
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateCarStatusFn = async (id, { featured, status }, userId) => {


        setLoading(true);
        setError(null);
        try {
            const response = await axios.put("http://localhost:3000/api/car/updatecar", {
                userId,
                featured,
                status,
                id
            });

            setData(response.data);
            setError(null);
        } catch (error) {
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };


    const deleteCarFn = async (id, userId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.delete("http://localhost:3000/api/car/deletecar", {
                data: {
                    userId,
                    id,
                },
            });

            setData(response.data);
            setError(null);
        } catch (error) {
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    return { data, loading, error, fn, fnAi, fetchCars, updateCarStatusFn, deleteCarFn };
};