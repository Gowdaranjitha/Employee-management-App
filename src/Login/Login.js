import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import loginImg from "../assets/loginbg.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/dashboard");
      } else {
        throw new Error(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Left Image */}
        <div className="login-card-left">
          <img src={loginImg} alt="Login Screenshot" className="login-image" />
        </div>

        {/* Right Login Form */}
        <div className="login-card-right">
          <h2 className="login-title">Welcome Back 👋</h2>
          <p className="login-subtitle">Sign in to continue to your account</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3 text-start">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 text-start">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </Form.Group>

            <Button type="submit" className="login-btn">
              Login
            </Button>
          </Form>

          <p className="signup-text">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/registration")}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
