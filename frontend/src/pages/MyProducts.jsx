import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MyProducts(){
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchMyProducts = async () => {
            try{
                setLoading(true);

                const token = localStorage.getItem("token");

                const res = await axios.get("http://localhost:5000/api/products/my-products", 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setProducts(res.data);

                setLoading(false);
            }
            catch(error)
            {
                setLoading(false);

                console.log(error);
            }
        };
        fetchMyProducts();
    }, []);


    const handleDelete = async (id) => {

        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if(!confirmDelete) return;

        try{
            const token = localStorage.getItem("token");

            await axios.delete(`http://localhost:5000/api/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Product deleted successfully!");

            setProducts(products.filter((product) => product._id !== id));
        }
        catch(error)
        {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to delete product");
        }
    };

    const handleStatusToggle = async (id) => {
        try{
            const token = localStorage.getItem("token");

            const res = await axios.patch(`http://localhost:5000/api/products/${id}/status`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === id ? res.data : product));

            toast.success(`Product ${res.data.status === "active" ? "activated" : "deactivated"} successfully!`);
        }
        catch(error)
        {
            console.log(error);
            toast.error("Failed to update product status");
        }
    };

    const filteredProducts = products.filter((product) => 
        product.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4">My Products</h2>

            <div className="mb-4">
                <input 
                   type="text"
                   className="form-control"
                   placeholder="Search your products...."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="row">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="text-muted">Loading products...</p>
                    </div>
                
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-5">
                        <h4 className="text-muted">No products found.</h4>
                    </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div className="col-lg-4 col-md-6 mb-4" key={product._id}>
                        <div className="card h-100 shadow-sm border-0">
                            <img 
                                src={`http://localhost:5000/uploads/${product.image}`}
                                className="card-img-top"
                                alt={product.name}
                                style={{ height: "220px", objectFit: "cover" }}
                            />

                            <div className="card-body">
                                <h5 className="fw-bold">{product.name}</h5>
                                <p className="text-muted">{product.category}</p>
                                
                                <p>
                                    <span className={`badge ${
                                        product.status === "active" ? "bg-success" : "bg-secondary" 
                                        }`}> {product.status} 
                                    </span>
                                </p>

                                <h5 className="text-success">₹{Number(product.price).toLocaleString("en-IN")}</h5>
                                <button className={`btn ${ product.status === "active" ? "btn-secondary" : "btn-success" } w-100 mb-2`} onClick={() => handleStatusToggle(product._id)}>
                                    {product.status === "active" ? "Deactivate" : "Activate"}
                                </button>
                                <div className="d-flex gap-2 mt-3">
                                    <button className="btn btn-warning w-50" onClick={() => navigate(`/edit-product/${product._id}`)}>Edit</button>
                                    <button className="btn btn-danger w-50" onClick={() => handleDelete(product._id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
            </div>
        </div>
    );
}
export default MyProducts;