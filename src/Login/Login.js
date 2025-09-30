// Login.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";

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
    <div className="p-4">
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary">Login</Button>
      </Form>
      <p className="mt-3">
        Don't have an account?{" "}
        <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/registration")}>
          Sign Up
        </span>
      </p>
    </div>
  );
}

export default Login;
