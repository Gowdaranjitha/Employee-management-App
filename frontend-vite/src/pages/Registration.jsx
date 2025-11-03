import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registration.css";
import loginBg from "../assets/loginbg.png";
import API from "../api/axiosConfig";

function Registration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Simple validation
    if (!username || !password || !email || !department || !role) {
      setError("All fields are required");
      return;
    }

    try {
      // POST to backend (make sure your backend has /users route)
      await API.post("/users", { username, password, email, department, role });

      setSuccess("Registration successful! Redirecting to Login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Server error. Please try again.");
    }
  };

  return (
    <div
      className="register-container"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="register-overlay" />
      <div className="register-box">
        <h2>Create Account ✨</h2>
        <p className="subtitle">Join us and get started</p>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <input
            type="text"
            placeholder="Role (Admin / Manager / Employee)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <span className="link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Registration;
