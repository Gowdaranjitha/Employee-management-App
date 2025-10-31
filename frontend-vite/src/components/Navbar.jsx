import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h2 className="navbar-title">****************** //\\ Employee Management App //\\ ****************** </h2>
      <div className="navbar-right">
        {user && <span className="user-role">Role: {user.role}</span>}
        {user && (
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="logout-btn"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
