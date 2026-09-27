import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

    // const navigate = useNavigate();

    const token = localStorage.getItem("token");
    let user = null;

    try{
        user = JSON.parse(localStorage.getItem("user")); 
    }
    catch{
        user = null;
    }
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.replace("/login");
    };

    return (
        <nav className="navbar">
            <div className="nav-logo">
                <Link to="/" >ShopNest</Link>
            </div>    

            <div className="nav-links">
                <Link to="/">Home</Link>
                
                { !token ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                      {user?.userType === "customer" && (
                        <>
                            <Link to="/cart">Cart</Link>
                            <Link to="/my-orders">My Orders</Link>
                        </>
                      )}  

                      {user?.userType === "seller" && (
                        <>
                            <Link to="/seller">Dashboard</Link>
                            <Link to="/add-product">Add Product</Link>
                            <Link to="/my-products">My Products</Link>
                        </>
                      )}

                      {user?.userType === "admin" && (
                        <>
                            <Link to="/admin">Dashboard</Link>
                            <Link to="/admin-products">Products</Link>
                            <Link to="/admin-orders">Orders</Link>
                        </>
                      )}

                      <Link to="/profile">Profile</Link>

                      <span className="user-name">
                          Hi, {user?.name || "User"}
                      </span>
                      
                      <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>        
        </nav>
    );
}

export default Navbar;