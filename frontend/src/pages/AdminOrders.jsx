import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AdminOrders()
{
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try{
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await axios.get("http://localhost:5000/api/orders", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setOrders(res.data);

            setLoading(false);
        }
        catch(error)
        {
            setLoading(false);

            console.log(error);
        }
    };

    useEffect(() => {
        fetchOrders();    
    }, []);

    const updateStatus = async (orderId, status) => {
        try{
            const token = localStorage.getItem("token");

            await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {status}, {
                headers: {
                    Authorization:  `Bearer ${token}`,
                },
            });
            fetchOrders();
            toast.success(`Order status updated to ${status}`);
        }
        catch(error)
        {
            console.log(error);
            toast.error("Failed to update order status");
        }
    };

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Admin Orders</h2>

                <span className="badge bg-dark fs-6">
                    Total Orders: {orders.length}
                </span>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3 text-muted">Loading orders...</p>
                </div>
            ) : orders.length === 0 ? (
                    <div className="alert alert-info text-center">
                        No orders found.
                    </div>
            ) : (
                orders.map((order) => (
                    <div className="card border-0 shadow-lg rounded-4 mb-4" key={order._id}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">
                                    Order #{order._id.slice(-6)}
                                </h5>

                                <span className="badge bg-primary fs-6">
                                    {order.status}
                                </span>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="bg-light p-3 rounded">
                                        <h6 className="fw-bold mb-2">
                                            Customer Details
                                        </h6>

                                        <p className="mb-1">
                                            <strong>Name:</strong> {" "}
                                            {order.userId?.name || "Unknown"}
                                        </p>

                                        <p className="mb-0">
                                            <strong>Email:</strong>{" "}
                                            {order.userId?.email || "No Email"}
                                        </p>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="bg-light p-3 rounded">
                                        <h6 className="fw-bold mb-2">
                                            Order Details
                                        </h6>

                                        <p className="mb-1">
                                            <strong>Total:</strong>{" "}
                                            ₹{order.totalAmount.toLocaleString("en-IN")}
                                        </p>


                                        <p className="mb-1">
                                            <strong>Payment:</strong>{" "}
                                            {order.paymentMethod}
                                        </p>

                                        <p className="mb-1">
                                            <strong>Payment Status:</strong>{" "}
                                            {order.paymentStatus}
                                        </p>
                                    </div>
                                </div>

                            </div>
                            
                            <hr />

                            <h6 className="fw-bold mb-3">Order Items</h6>

                            {order.items.map((item, index) => (
                                <div key={index} className="border rounded p-2 mb-2 bg-light">
                                    <p className="mb-1 fw-semibold">
                                        {item.name}
                                    </p>

                                    <small className="text-muted">
                                         ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                                    </small>

                                    <div>
                                        <strong>
                                             ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                        </strong>
                                    </div>
                                </div>
                            ))}

                            <h6 className="fw-bold mt-4 mb-2">Update Order Status</h6>
                            
                            <div className="mt-3">
                                <select 
                                    className="form-select"
                                    value={order.status}
                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default AdminOrders;