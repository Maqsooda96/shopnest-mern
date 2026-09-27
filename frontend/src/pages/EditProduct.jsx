import {useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";
import { toast } from "react-toastify";

function EditProduct(){
    const {id} = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: "",
        price: "",
        category: "",
        image: "",
    });

    const [newImage, setNewImage] = useState(null);

    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try{
                setLoading(true);

                const res = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct({
                    name: res.data.name,
                    price: res.data.price,
                    category: res.data.category,
                    image: res.data.image,
                }); 
                
                setLoading(false);
            }
            catch(error){
                setLoading(false);

                console.log(error);
                toast.error("Failed to fetch product");
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    const handleUpdate = async(e) => {
        e.preventDefault();

        if (!product.name || !product.price || !product.category) 
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
            setUpdateLoading(true);
            
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("name", product.name);
            formData.append("price", product.price);
            formData.append("category", product.category);

            if(newImage)
            {
                formData.append("image", newImage);
            }

            await axios.put(`http://localhost:5000/api/products/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setUpdateLoading(false);
            
            toast.success("Product updated successfully!");
            navigate("/my-products");
        }
        catch(error)
        {
            setUpdateLoading(false);

            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update product");
        }
    };

    if(loading){
        return(
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 text-muted">Loading product...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="col-md-6 mx-auto">
                <div className="card shadow border-0 p-4">
                    <h2 className="fw-bold mb-4">Edit Product</h2>

                    {product.image && (
                        <div className="mb-3 text-center">
                            <img
                                src={`http://localhost:5000/uploads/${product.image}`}
                                alt={product.name}
                                className="img-fluid rounded"
                                style={{ maxHeight: "250px", objectFit: "cover" }}
                            />
                        </div>
                    )}

                    <form onSubmit={handleUpdate}>
                        
                        <div className="mb-3">
                            <label className="form-label">Product Name</label>
                            <input 
                                type="text"
                                className="form-control"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                required/>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Price</label>
                            <input
                                className="form-control"
                                type="text"
                                name="price"
                                value={
                                    product.price ?
                                    Number(product.price || 0).toLocaleString("en-IN")
                                : ""
                            }
                                onChange={(e) => {
                                    const value = e.target.value.replace(/,/g, "");
                                    setProduct({
                                        ...product, 
                                        price: value, 
                                    });
                                }}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Category</label>
                            <input 
                               type="text"
                               className="form-control"
                               name="category"
                               value={product.category}
                               onChange={handleChange}
                               required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Change Product Image</label>
                            <input 
                               type="file"
                               className="form-control"
                               accept="image/*"
                               onChange={handleImageChange}
                               />
                            <small className="text-muted">Leave empty if you don't want to change image.</small>
                        </div>

                        <button 
                            className="btn btn-success w-100"
                            disabled={updateLoading}
                        >
                            {updateLoading ? "Updating..." : "Update Product"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default EditProduct;