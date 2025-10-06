import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Navbar, Nav, Table } from "react-bootstrap";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="dashboard-page">
      {/* Navbar */}
      <Navbar className="navbar-custom" expand="lg">
        <Container>
          <Navbar.Brand onClick={() => navigate("/dashboard")}>
            ✨Employee App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/")}>Login</Nav.Link>
              <Nav.Link onClick={() => navigate("/registration")}>Register</Nav.Link>
              <Nav.Link onClick={() => navigate("/dashboard")}>Dashboard</Nav.Link>
            </Nav>
            <Button
              className="logout-btn"
              variant="outline-light"
              onClick={() => {
                localStorage.removeItem("user");
                navigate("/");
              }}
            >
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2>Welcome, {user ? user.username : "User"} 👋</h2>
        <p>Manage employees and view registered users below</p>
      </div>

      {/* Dashboard Content */}
      <Container className="dashboard-container">
        <div className="dashboard-card">
          <h3 className="section-title">Registered Users</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>No</th>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u, i) => (
                  <tr key={u.id}>
                    <td>{i + 1}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;
