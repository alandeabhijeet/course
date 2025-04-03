import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Get the token
      if (!token) {
        setIsAuthenticated(false);
        navigate("/login");
        return;
      }
  
      const response = await fetch("http://localhost:5002/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });
  
      if (response.ok) {
        localStorage.removeItem("authToken"); // Remove token after successful logout
        setIsAuthenticated(false);
        navigate("/login");
      } else {
        console.error("Logout failed:", await response.json());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/buy">Buy</Link></li>
        <li><Link to="/owner">Owner</Link></li>
        <li><Link to="/add">Add Course</Link></li>
        
        {isAuthenticated ? (
          <li><button onClick={handleLogout}>Logout</button></li>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
