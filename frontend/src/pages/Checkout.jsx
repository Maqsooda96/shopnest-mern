import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Checkout(){
    const navigate = useNavigate();

    const[formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        paymentMethod: "COD",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const placeOrder = async () => {
        if (!formData.fullName || !formData.phone || !formData.address) 
        {
            toast.error("All fields are required!");
            return;
        }

        if (!/^\d{10}$/.test(formData.phone)) 
        {
            toast.error("Enter a valid 10-digit phone number");
            return;
        }

        try{
            setLoading(true);

            const token = localStorage.getItem("token");

            await axios.post("http://localhost:5000/api/orders",
                formData, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Order placed successfully!");

            setFormData({
                fullName: "",
                phone: "",
                address: "",
                paymentMethod: "COD",
            });

            setLoading(false);
        
            setTimeout(() => {
                navigate("/");
            }, 1500);

        }
        catch(error)
        {
            setLoading(false);

            console.log(error);
            toast.error(error.response?.data?.message || "Failed to place order");
        }
    };

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4">Checkout</h2>

            <div className="card p-4 shadow-sm">
                <h5>Delivery Details</h5>

                <input 
                    type="text"
                    name="fullName"
                    className="form-control my-2"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />

                <input 
                    type="text"
                    name="phone"
                    className="form-control my-2"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="address"
                    className="form-control my-2"
                    rows="4"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                >
                </textarea> 
                <p className="text-muted text-sm">Select payment method</p>
                <select 
                    className="form-control my-2"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}>
                    <option value="COD">Cash on delivery</option>
                    <option value="ONLINE">Online Payment</option>    
                </select>

                <button 
                    className="btn btn-success mt-3" 
                    onClick={placeOrder}
                    disabled={loading}
                >
                    {loading ? "Placing Order..." : "Place Order"}
                </button>
                
            </div>
        </div>
    );
}

export default Checkout;