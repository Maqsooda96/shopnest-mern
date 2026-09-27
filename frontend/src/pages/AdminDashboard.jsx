import {useEffect, useState} from "react";
import axios from "axios";

function AdminDashboard()
{
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalSellers: 0,
        totalRevenue: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect (() => {
        const fetchStats = async () => {
            try{
                setLoading(true);

                const token = localStorage.getItem("token");

                const res = await axios.get("http://localhost:5000/api/admin/stats", {
                    headers : {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setStats(res.data);
                setLoading(false);
            }
            catch(error)
            {
                setLoading(false);
                console.log(error);
            }
        };

        fetchStats();
    }, []);

    return (
        
        <div className="container py-5">
            <h2 className="fw-bold mb-4">Admin Dashboard</h2>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3 text-muted">Loading dashboard...</p>
                </div>
            ) : (
            <div className="row g-4">
                
                <div className="col-md-3">
                    <div className="card shadow border-0 rounded-4 p-4 text-center">
                        <h6>Total Products</h6>
                        <h2 className="fw-bold">{stats.totalProducts}</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow border-0 rounded-4 p-4 text-center">
                        <h6>Total Orders</h6>
                        <h2 className="fw-bold">{stats.totalOrders}</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow border-0 rounded-4 p-4 text-center">
                        <h6>Total Customers</h6>
                        <h2 className="fw-bold">{stats.totalCustomers}</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow border-0 rounded-4 p-4 text-center">
                        <h6>Total Sellers</h6>
                        <h2 className="fw-bold">{stats.totalSellers}</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow border-0 rounded-4 p-4 text-center">
                        <h6>Total Revenue</h6>
                        <h2 className="fw-bold">  ₹{stats.totalRevenue.toLocaleString("en-IN")}</h2>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}

export default AdminDashboard;