import { useState } from "react";
import axios from "axios";
import "./AddProduct.css";
import { toast } from "react-toastify";

function AddProduct() {

    const [product, setProduct] = useState({
        name:"",
        price: "",
        category: "",
    });

    const [image, setImage] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]:e.target.value,
        });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!product.name || !product.price || !product.category || !image) 
        {
            toast.error("All fields are required!");
            return;
        }

        if (Number(product.price) <= 0) 
        {
            toast.error("Price must be greater than 0");
            return;
        }

        try{
            setLoading(true);

            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("name", product.name);
            formData.append("price", product.price);
            formData.append("category", product.category);
            formData.append("image", image);

            await axios.post("http://localhost:5000/api/products", formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                        "Content-Type": "multipart/form-data",
                    },    
                }
            );

            toast.success("Product added successfully!");

            setProduct({
                name: "",
                price: "",
                category: "",
            });

            setImage(null);

            setLoading(false);

        }
        catch(error)
        {
            setLoading(false);

            console.log(error);
            
            toast.error(error.response?.data?.message || 
                  error.response?.data || 
                  "Failed to add product");
        }
    };

    return (
        <div className="add-product-container">
            <div className="add-product-card">
                <h1 className="add-product-title">Add Product</h1>

                <form className="add-product-form" onSubmit={handleSubmit}>
                    <input
                        className="form-control" 
                        type="text"
                        name="name"
                        value={product.name}
                        placeholder="Product Name"
                        onChange={handleChange}
                        required
                     />

                    <input
                        className="form-control"
                        type="number"
                        name="price"
                        value={product.price}
                        placeholder="Price"
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="form-control"
                        type="text"
                        name="category"
                        value={product.category}
                        placeholder="Category"
                        onChange={handleChange}
                        required 
                    />

                    <input
                        className="form-control"
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />

                    <button
                        type="submit"
                        className="add-product-btn"
                        disabled={loading}
                    >
                        {loading ? "Adding Product..." : "Add Product"}
                    </button>
                
                </form>
            </div>
        </div>
    );
}

export default AddProduct;