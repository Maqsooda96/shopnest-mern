import { useState } from "react";
import axios from "axios";
import "./Register.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        userType: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const[loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!form.name || !form.email || !form.password || !form.confirmPassword || !form.userType)
        {
            toast.error("All fields are required!");
            return;
        }

        if(form.password !== form.confirmPassword) // this runs in frontend side only. after compare both save correct password only
        {
            toast.error("Passwords do not match!");
            return;
        }

        try{
            setLoading(true);

            await axios.post("http://localhost:5000/api/auth", 
                {   // this will goes to backend
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    userType: form.userType,
                }
            );

            toast.success("Registration successful!");
            
            setForm({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                userType: "",
            });

            setLoading(false);


            setTimeout(() => {
                navigate("/login");
            }, 1500);
        }
        catch(error){
            setLoading(false);

            toast.error(error.response?.data?.message || "Registration failed");
            console.log(error);
        }
    };

    return (
        <div className="register-container">
             <form className="register-form" onSubmit={handleSubmit}>
                <h2>Create Account</h2>
         
               <input 
                    type="text"
                    name="name"
                    value={form.name}
                    placeholder="Full Name"
                    onChange={handleChange}
                    required
                />
            
                <input 
                    type="email"
                    name="email"
                    value={form.email}
                    placeholder="Email Address"
                    onChange={handleChange}
                    required
                />
            
                <div className="password-field">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        placeholder="Enter Password"
                        onChange={handleChange}
                        required
                    />
                    <span 
                        className="eye-icon"
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                
                <div className="password-field">
                    <input 
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        required
                    />
                    <span 
                        className="eye-icon"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
            
                <select 
                    name="userType" 
                    value={form.userType}
                    onChange={handleChange} 
                    required>
                    <option value="">Select User Type</option>
                    <option value="customer">Customer</option>
                    <option value="seller">Seller</option>
                </select>
            

            <button 
                type="submit"
                disabled={loading}
            >
                {loading ? "Registering..." : "Register"}
            </button>

            </form>  
        </div>
        
    );
}

export default Register;