import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import SellerDashboard from "./pages/SellerDashboard";
import RoleRoute from "./components/RoleRoute";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import MyProducts from "./pages/MyProducts";
import EditProduct from "./pages/EditProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";

function App() {

  return(
    
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/profile" element= {
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
        />

        <Route path="/seller" element={
          <RoleRoute role="seller">
            <SellerDashboard />
          </RoleRoute>
        } 
        />

        <Route path="/add-product" element={
          <RoleRoute role="seller">
            <AddProduct />
          </RoleRoute>
        } />

        <Route path="/product/:id" element={
          <ProductDetails />
        } />

        <Route path="/my-products" element={
          <RoleRoute role="seller">
            <MyProducts />
          </RoleRoute>
        } />

        <Route path="/edit-product/:id" element={
          <RoleRoute role="seller">
            <EditProduct />
          </RoleRoute>
        } />

        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />

        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />

        <Route path="/my-orders" element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <RoleRoute role="admin">
            <AdminDashboard />
          </RoleRoute>
        } />

        <Route path="/admin-orders" element={
          <RoleRoute role="admin">
            <AdminOrders />
          </RoleRoute>
        }/>

        <Route path="/admin-products" element={
          <RoleRoute role="admin">
            <AdminProducts />
          </RoleRoute>
        } />
                
      </Routes>
    </Router>
  );
}

export default App;