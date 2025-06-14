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


    const fetchDealershipInfo = async (userId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://localhost:3000/api/settings/${userId}`);

            setData(response.data);
            setError(null);
        } catch (error) {
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchUsers = async (userId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://localhost:3000/api/settings/users/${userId}`);

            setData(response.data);
            setError(null);
        } catch (error) {
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const saveHours = async (userId, workingHours) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`http://localhost:3000/api/settings/workinghours`, {
                userId,
                workingHours
            });

            setData(response.data);
            setError(null);
        } catch (error) {
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const updateRole = async (clerkUserId, userId, role) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.put(`http://localhost:3000/api/settings/updaterole`, {
                clerkUserId,
                userId,
                role
            });

            setData(response.data);
            setError(null);
        } catch (error) {
            setError(error);
            console.log(error)
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const processImageFn = async (imageFile) => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            const response = await axios.post("http://localhost:3000/api", formData);

            setData(response.data);
            setError(null);
        } catch (error) {
            setError(error);
            console.log(error)
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return {
        data, loading, error, fn, fnAi, fetchCars, updateCarStatusFn, deleteCarFn, fetchDealershipInfo, fetchUsers, saveHours,
        updateRole, processImageFn
    };
};