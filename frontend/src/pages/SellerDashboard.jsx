import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function SellerDashboard() {
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        const fetchProductCount = async() => {
            try{
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/products/my-products", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setTotalProducts(res.data.length);
            }
            catch(error)
            {
                console.log(error);
            }
        };
        fetchProductCount();
    }, []);

    return (
        <div className="container py-5">
            <div className="card shadow border-0 p-4">
                <div className="text-center">
                    <h1 className="fw-bold mb-2">Welcome, {JSON.parse(localStorage.getItem("user"))?.name}</h1>
                    <p className="text-muted mb-4">Manage your products, update listings, and track your store.</p>   
                    
                    <div className="row justify-content-center mb-4">
                        <div className="col-md-4">
                            <div className="card bg-light border-0">
                                <div className="card-body">
                                    <h5 className="text-muted">Total Products</h5>
                                    <h2 className="fw-bold text-primary">{totalProducts}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {totalProducts === 0 && (
                        <p className="text-muted mb-4">You haven't added any products yet.</p>
                    )}
            
            
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Link to="/add-product">
                            <button className="btn btn-primary btn-lg">Add Product</button>
                        </Link>

                        <Link to="/my-products">
                            <button className="btn btn-success btn-lg">My Products</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerDashboard;