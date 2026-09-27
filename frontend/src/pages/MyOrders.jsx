import { useState, useEffect } from "react";
import axios from "axios";

function MyOrders()
{
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try{
                const token = localStorage.getItem("token");

                const res = await axios.get("http://localhost:5000/api/orders/my-orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrders(res.data);
            }
            catch(error)
            {
                console.log(error);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4">My Orders</h2>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => (
                    <div className="card shadow-sm mb-4 p-4" key={order._id}>
                        <h5 className="fw-bold">Order #{order._id.slice(-6)}</h5>
                        <p className="text-muted mb-2">Ordered on: {new Date(order.createdAt).toLocaleDateString("en-IN")} </p>
                        <p><strong>Total:</strong>{" "} ₹{order.totalAmount.toLocaleString("en-IN")}</p>
                        <p><strong>Payment:</strong>{" "} {order.paymentMethod}</p>
                        <p><strong>Payment Status:</strong>{" "} {order.paymentStatus}</p>
                        <p><strong>Status:</strong>{" "} {order.status}</p>

                        <hr />

                        <h6 className="fw-bold mb-3">Items</h6>

                        {order.items.map((item, index) => (
                            <div key={index} className="border rounded p-3 mb-2">
                                <p className="fw-semibold mb-1">
                                    {item.name}
                                </p>

                                <small className="text-muted d-block">
                                    ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                                </small>

                                <p className="mb-0 mt-1">
                                    Total: ₹
                                    {(
                                        item.price * item.quantity
                                    ).toLocaleString("en-IN")}
                                </p>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}
export default MyOrders;