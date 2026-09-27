import { Navigate } from "react-router-dom";

function RoleRoute({ children, role }) {
    const user = JSON.parse(localStorage.getItem("user"));

    if(!user)
    {
        return <Navigate to="/login" />
    }

    if(user.userType !== role)
    {
        return <Navigate to="/" />
    }
    // If user.userType == seller / user.userType === customer, will go its curresponding Dashboard
    return children;  // If user is authenticated and has the correct role, render the child component
}

export default RoleRoute;

// Authentication -->	Who are you?
// Authorization  -->   What can you access?