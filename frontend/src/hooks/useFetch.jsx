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

    const getCars = async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post("http://localhost:3000/api/cars", args[0]);
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

    const toggleSavedCarFn = async (carId, userId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:3000/api/togglesavedcar", {
                params: {
                    carId,
                    userId
                }
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

    const bookTestDriveFn = async (args) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post("http://localhost:3000/api/testdrive", args);

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

    const cancelBookingFn = async (bookingId, userId) => {

        setLoading(true);
        setError(null);
        try {
            const response = await axios.delete("http://localhost:3000/api/canceltestdrive", {
                params: {
                    bookingId,
                    userId
                }
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

    const fetchTestDrives = async (args) => {

        setLoading(true);
        setError(null);
        try {
            const response = await axios.post("http://localhost:3000/api/admin/admintestdrives", args);

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
    const updateStatusFn = async (args) => {


        setLoading(true);
        setError(null);
        try {
            const response = await axios.put("http://localhost:3000/api/admin/updatestatus", args);

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

    const cancelTestDriveFn = async (bookingId, userId) => {


        setLoading(true);
        setError(null);
        try {
            const response = await axios.delete("http://localhost:3000/api/admin/canceltestdrive", {
                params: {
                    bookingId,
                    userId
                }
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
    return {
        data, loading, error, fn, fnAi, fetchCars, updateCarStatusFn, deleteCarFn, fetchDealershipInfo, fetchUsers, saveHours,
        updateRole, processImageFn, getCars, toggleSavedCarFn, bookTestDriveFn, cancelBookingFn, fetchTestDrives, updateStatusFn, cancelTestDriveFn
    };
};