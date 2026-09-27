import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Home() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");

    const[loading, setLoading] = useState(true);
    const[cartLoading, setCartLoading] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try{
                setLoading(true);

                const res = await axios.get(`http://localhost:5000/api/products?category=${category}&sort=${sort}`);

                setProducts(res.data);
                setLoading(false);

            }
            catch(error)
            {
                setLoading(false);

                console.log(error);
            }
        };
        
        fetchProducts();   
    }, [category, sort]);

    const handleAddToCart = async (productId) => {
        try{
            setCartLoading(productId);

            const token = localStorage.getItem("token");

            if(!token)
            {
                setCartLoading(null);

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

            setCartLoading(null);

           toast.success("Product added to cart!");
        }
        catch(error)
        {
            setCartLoading(null);

            console.log(error);
            toast.error(error.response?.data?.message || "Failed to add to cart");
        }
    };
    

    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container py-5">
            <h2 className="text-center fw-bold mb-5">Products</h2>
            <div className="row mb-4">
                <div className="col-md-4 mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search products...."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                </div>

                <div className="col-md-4 mb-2">
                    <select 
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}>
                            <option value="">All categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothes">Clothes</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Beauty Products">Beauty Products</option>
                    </select>
                </div>

                <div className="col-md-4 mb-2">
                    <select
                        className="form-select"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}>
                            <option value="">Sort By</option>
                            <option value="price_asc">Price Low to High</option>
                            <option value="price_desc">Price High to Low</option>
                    </select>
                </div>
            </div>

            <div className="row">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-3 text-muted">Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-5">
                        <h4 className="text-muted">No products found</h4>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div className="col-lg-4 col-md-6 mb-4" key={product._id}>
                            <div className="card product-card border-0 shadow-sm h-100">
                                <img 
                                    className="card-img-top product-image" 
                                    src={`http://localhost:5000/uploads/${product.image}`}
                                    alt= {product.name}
                                />

                                <div className="card-body d-flex flex-column">
                                    <span className="badge bg-primary mb-2"> {product.category} </span>

                                    <h5 className="card-title fw-bold"> {product.name} </h5>

                                    <h4 className="text-success fw-bold mb-3"> ₹{Number(product.price).toLocaleString("en-IN")} </h4>

                                    <Link to={ `/product/${product._id}` } className="btn btn-primary mt-auto">View Details</Link>

                                    <button 
                                        className="btn btn-success mt-2" 
                                        onClick={() => handleAddToCart(product._id)}
                                        disabled={cartLoading === product._id}
                                    >
                                        {cartLoading === product._id ? "Adding..." : "Add to Cart"}
                                    </button>
                                </div>

                            </div>    
                      </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;