import { useEffect, useRef, useState } from "react";
import axios from "axios";

function App() {
  const [userType, setUserType] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const [editId, setEditId] = useState(null);

  const fileRef = useRef(null);

  const fetchProducts = async () => {
    try{
      const res = await axios.get("http://localhost:5000/api/products");

      setProducts(res.data);
    }
    catch(error){
      console.log(error);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if(savedToken) setToken(savedToken);

    fetchProducts();  
  }, []);

  //Registration
  const userRegister = async(e) => {
    e.preventDefault();

    if(!name || !email || !password || !userType)
    {
      alert("Please fill all fields");
      return;
    }

    if(password !== confirmPassword)
    {
      alert("Passwords do not match");
      return;
    }

    try{
      const res = await axios.post("http://localhost:5000/api/auth", {
        name,
        email,
        password,
        userType
      });

      alert("Registration successful");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUserType("");
      
    }
    catch(error){
      console.log(error);
      alert("User registration failed");
    }

  };

  //login
  const loginUser = async (e) => {
    e.preventDefault();

    try{
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      
      alert("Login successful");
    }

    catch(error){
      console.log(error);
      alert("Login failed");
    }
  };

  //add product
  const addProduct = async(e) => {
    e.preventDefault();
    
    if(!token)
    {
      alert("Please login first");
      return;
    }

    if(!editId && !image)
      {
        alert("Please select an image");
        return; 
      }

      if(!name || !price || !category)
      {
        alert("Please fill all the fields");
        return;
      }

    try{
      
      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);

      if(image){
        formData.append("image", image);
      }

      if(editId){
        await axios.put(`http://localhost:5000/api/products/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      else
      {
        if(!image){
          alert("Please select an image");
          return;
        }

        formData.append("image", image);
      


        await axios.post("http://localhost:5000/api/products",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      }    

    //clear form
    setName("");
    setPrice("");
    setCategory("");
    setImage(null);
    setEditId(null);

    //clear file input UI
    if(fileRef.current) fileRef.current.value = "";    

    fetchProducts();
    }
    catch(error)
    {
      console.log(error);
    }
  };

  const deleteProduct = async (id) => {
    if(!token)
    {
      alert("Please login first");
      return;
    }

    try{
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProducts();
    }
    catch(error)
    {
      console.log(error);
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
  };

  return (
    <>
    <div className="container mt-4">
      <h1 className="text-center mb-4">ShopNest</h1>

      <div className="card p-3 mb-4">
        <h4>Registration</h4>
        <form onSubmit={userRegister}>
          <div className="mb-3">
            <input 
              className="form-control"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input 
              className="form-control"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input 
              className="form-control"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input 
              className="form-control"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <select className="form-control"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="">Select User Type</option>
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <button className="btn btn-dark w-100">Submit</button>

        </form>  
      </div>

      <div className="card p-3 mb-4">
        <h4>Login</h4>

        <form onSubmit={loginUser}>
          
          <div className="mb-3">
            <input
              className="form-control"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="mb-3">
            <input 
              className="form-control"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>  
          <button className="btn btn-success w-100">Login</button>
        </form>
      </div>

      {/* form   */}
      <div>
        <h4>Add Product</h4>

        <form onSubmit={addProduct}>
          <div className="mb-3">
          <input 
            className="form-control"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          </div>

          <div className="mb-3">
            <input 
              className="form-control"
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input 
              className="form-control"
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <input 
              className="mb-3"
              ref={fileRef}
              type="file"
              onChange={(e) => setImage(e.target.files[0])}  
            />
          </div>

          <button className="btn btn-primary w-100">{editId ? "Update Product" : "Add Product"}</button>
        </form>
      </div>

      {/* Products */}
      <div className="row">
        {products.map((product) => (
        <div className="col-md-4 mb-3" key={product._id}>
          <div className="card p-3 shadow-sm">
            {product.image && (
              <img 
                src={`http://localhost:5000/uploads/${product.image}`}
                alt={product.name}
                className="img-fluid mb-2"
                style={{ height: "150px", objectFit: "cover" }}
              />
            )}
            <h5>{product.name}</h5>
            <p className="mb-1">₹{product.price}</p>
            <span className="badge bg-secondary">{product.category}</span>
            <button className="btn btn-danger mt-2" onClick={() => deleteProduct(product._id)}>Delete</button>
            <button className="btn btn-warning mt-2" onClick={() => handleEdit(product)}>Edit</button>
          </div>
        </div>
      ))}
    </div>
  </div>
    </>
  );
}

export default App;