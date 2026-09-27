import { useState } from "react";
import axios from "axios";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

// Login → Success → Token saved → Redirect to Home

function Login() {

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!form.email || !form.password)
        {
            toast.error("All fields are required!");
            return;
        }

        try{
            setLoading(true);

            const res = await axios.post("http://localhost:5000/api/auth/login", 
                {
                    email: form.email,
                    password: form.password,
                }
            );

            toast.success("Successfully logged in!");

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            setLoading(false);

            if (res.data.user.userType === "seller")
            {
                window.location.href = "/seller";
            }
            else {
                window.location.href = "/";
            }
  }
        catch(error)
        {
            setLoading(false);

            toast.error(error.response?.data?.message || "Login failed");
            console.log(error);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>

                <input 
                    type="email"
                    name="email"
                    value={form.email}
                    placeholder="Enter Email Id"
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
                

                <button 
                    type="submit"
                    disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>    

            </form>
        </div>
    );
}

export default Login;