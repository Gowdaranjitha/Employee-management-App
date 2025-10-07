import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
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
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">✨ Employee App</h2>
        <Button className="sidebar-btn" onClick={() => navigate("/")}>
          Login
        </Button>
        <Button
          className="sidebar-btn"
          onClick={() => navigate("/registration")}
        >
          Register
        </Button>
        <Button
          className="sidebar-btn active"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </Button>
        <Button
          className="logout-btn mt-auto"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          Logout
        </Button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="welcome-banner">
          <h2>Welcome, {user ? user.username : "User"} 👋</h2>
          <p>Manage employees and view registered users below</p>
        </div>

        <div className="dashboard-card">
          <h3 className="section-title">Registered Users</h3>
          <Table striped bordered hover responsive className="custom-table">
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
      </div>
    </div>
  );
}

export default Dashboard;
