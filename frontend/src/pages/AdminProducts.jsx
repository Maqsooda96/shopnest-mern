import { useEffect, useState } from "react";
import axios from "axios";

function AdminProducts() {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/products");
            setProducts(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="container py-5">
            <h2 className="mb-4">Admin Products</h2>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Seller</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    <img
                                        src={`http://localhost:5000/uploads/${product.image}`}
                                        alt={product.name}
                                        width="70"
                                        height="70"
                                        style={{ objectFit: "cover" }}
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>₹{Number(product.price).toLocaleString("en-IN")}</td>
                                <td>{product.sellerId?.name || "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminProducts;