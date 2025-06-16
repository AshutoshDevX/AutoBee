
import { DashBoard } from "../../components/DashBoard";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";
export default function AdminPage() {
    // Fetch dashboard data
    const { userId } = useAuth();
    const [dashboardData, setdashBoardData] = useState(null);

    useEffect(() => {
        const getDashBoardData = async () => {
            const response = await axios.get(`http://localhost:3000/api/admin/dashboarddata/${userId}`)
            setdashBoardData(response.data);
        }

        getDashBoardData();
    }, [])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            {dashboardData && <DashBoard initialData={dashboardData} />}
        </div>
    );
}
