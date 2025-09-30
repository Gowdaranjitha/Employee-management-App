// Registration.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";

function Registration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password || !email) {
      setError("All fields are required!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/"); // go to login after registration
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4">
      <h2>Sign Up / Registration</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleRegister}>
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

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </Form.Group>

        <Button type="submit" variant="success">Register</Button>
      </Form>
    </div>
  );
}

export default Registration;
