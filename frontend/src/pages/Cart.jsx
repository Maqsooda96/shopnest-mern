import {useState, useEffect} from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Cart(){

    const [cartItems, setCartItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [quantityLoading, setQuantityLoading] = useState(null);
    const [removeLoading, setRemoveLoading] = useState(null);

    useEffect(() => {
        const fetchCart = async() => {

            try{
                setLoading(true);

                const token = localStorage.getItem("token");

                const res = await axios.get("http://localhost:5000/api/cart", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCartItems(res.data);

                setLoading(false);
            }
            catch(error)
            {
                setLoading(false);

                console.log(error);
            }
        };
        fetchCart();
    }, []);

    const updateQuantity = async (id, action) => {
        try{
            setQuantityLoading(id);

            const token = localStorage.getItem("token");

            await axios.put(`http://localhost:5000/api/cart/${action}/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const res = await axios.get("http://localhost:5000/api/cart",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCartItems(res.data);

            setQuantityLoading(null);
        }
        catch(error)
        {
            setQuantityLoading(null);

            console.log(error);
            toast.error("Failed to update quantity");
        }
    };

    const removeItem = async (id) => {
        try{
            setRemoveLoading(id);

            const token = localStorage.getItem("token");

            await axios.delete(`http://localhost:5000/api/cart/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCartItems(cartItems.filter((item) => item._id !== id));

            setRemoveLoading(null);

            toast.success("Item removed from cart");
        }
        catch(error)
        {
            setRemoveLoading(null);

            console.log(error);
            toast.error("Failed to remove item");
        }
    };
    
    const totalAmount = cartItems.reduce((total, item) => {
        return total + item.productId.price* item.quantity;
    }, 0);

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4">My Cart</h2>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3 text-muted">Loading cart items...</p>
                </div>
            ) : cartItems.length === 0 ? (
                <h5>Your cart is empty</h5>
            ) : (
                cartItems.map((item) => (
                    <div className="card mb-3 shadow-sm" key={item._id}> 
                        <div className="row g-0 align-items-center">
                            <div className="col-md-3">
                                <img 
                                   src={`http://localhost:5000/uploads/${item.productId.image}`}
                                   className="img-fluid rounded-start"
                                   alt={item.productId.name}
                                />
                            </div>

                            <div className="col-md-6">
                                <div className="card-body">
                                    <h5>{item.productId.name}</h5>
                                    <p className="text-muted">{item.productId.category}</p>
                                    <h5 className="text-success"> ₹{Number(item.productId.price).toLocaleString("en-IN")} </h5>
                                    <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                                        <button 
                                            className="btn btn-danger btn-sm" 
                                            onClick={() => updateQuantity(item._id, "decrease")}
                                            disabled={quantityLoading === item._id}
                                        >
                                            - 
                                        </button>
                                        <span className="fw-bold">{item.quantity}</span>
                                        
                                        <button 
                                            className="btn btn-success btn-sm" 
                                            onClick={() => updateQuantity(item._id, "increase")}
                                            disabled={quantityLoading === item._id}
                                        >
                                            + 
                                        </button>
                                        
                                        <button 
                                            className="btn btn-outline-danger btn-sm" 
                                            onClick={() => removeItem(item._id)}
                                            disabled={removeLoading === item._id}
                                        >
                                            {removeLoading === item._id ? "Removing..." : "Remove"} 
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {cartItems.length > 0 && (
                <>
                    <div className="card p-3 shadow-sm mt-4">
                        <h4 className="fw-bold">
                            Total: ₹{totalAmount.toLocaleString("en-IN")}
                        </h4>
                    </div>

                    <div className="mt-3">
                        <a href="/checkout" className="btn btn-primary">
                            Proceed to Checkout
                        </a>
                    </div>
                </>
            )}
        </div>
    );
}
export default Cart;