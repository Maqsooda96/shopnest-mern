import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ProductDetails() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);

    const[loading, setLoading] = useState(true);
    const[cartLoading, setCartLoading] = useState(false);

    useEffect (() => {
        const fetchProduct = async () => {
            try{
                setLoading(true);

                const res = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(res.data);
                
                setLoading(false);
            }
            catch(error)
            {
                setLoading(false);

                console.log(error);
            }
        };
        fetchProduct();
    }, [id]);

    if(loading)
    {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 text-muted">Loading product...</p>
            </div>
        );
    }

    const handleAddToCart = async (productId) => {
        try{
            setCartLoading(true);

            const token = localStorage.getItem("token");

            if(!token)
            {   
                setCartLoading(false);

                toast.error("Please login to add products to cart");
                return;
            }

            await axios.post("http://localhost:5000/api/cart", 
                {productId}, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCartLoading(false);

            toast.success("Product added to cart!");
        }
        catch(error)
        {
            setCartLoading(false);

            console.log(error);
            toast.error(error.response?.data?.message || "Failed to add to cart");
        }
    };

    return (
        <div className="container py-5">
            <div className="row align-items-center">
                <div className="col-md-6">
                    <img
                        className="img-fluid rounded shadow"
                        src={ `http://localhost:5000/uploads/${product.image}`}
                        alt={product.name} 
                    />
                </div>

                <div className="col-md-6">
                    <span className="badge bg-primary mb-3">
                        {product.category}
                    </span>

                    <h2 className="fw-bold">{product.name}</h2>

                    <h3 className="text-success my-3"> ₹{Number(product.price).toLocaleString("en-IN")} </h3>

                    <p className="text-muted"> sold by: {product.sellerId?.name || "Seller"}</p>

                    <button 
                        className="btn btn-primary btn-lg" 
                        onClick={() => handleAddToCart(product._id)}
                        disabled={cartLoading}
                    >
                        {cartLoading ? "Adding..." : "Add to Cart"}
                    </button>
                </div>

            </div>

        </div>
    );
}

export default ProductDetails;