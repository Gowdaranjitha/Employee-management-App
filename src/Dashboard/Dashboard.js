import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import dashboardBg from "../assets/dashboardbg.png";

function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div
      className="dashboard-container"
      style={{
        backgroundImage: `linear-gradient(rgba(42,27,81,0.6), rgba(76,100,153,0.6)), url(${dashboardBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="dashboard-overlay" />

      <aside className="sidebar">
        <h2>✨ Dashboard</h2>
        <ul>
          <li onClick={() => navigate("/dashboard")}>Home</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      <main className="dashboard-content">
        <div className="welcome-card">
          <h1>Welcome, {user.username} 👋</h1>
          <p>Here’s a list of all registered users:</p>
        </div>

        <div className="table-card">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className={user.id === u.id ? "highlight" : ""}
                >
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.department}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
