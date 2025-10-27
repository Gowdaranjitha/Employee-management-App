import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import dashboardBg from "../assets/dashboardbg.png";

function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    department: "",
    role: "",
  });

  const user = JSON.parse(localStorage.getItem("user")); // logged-in user

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch(`http://localhost:5000/api/users/${id}`, {
          method: "DELETE",
        });
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  // Start editing
  const handleEdit = (u) => {
    setEditingUser(u.id);
    setFormData({
      username: u.username,
      email: u.email,
      department: u.department,
      role: u.role,
    });
  };

  // Update user
  const handleUpdate = async (e) => {
  e.preventDefault();

  // Only include fields with values
  const payload = {};
  Object.keys(formData).forEach((key) => {
    if (formData[key] && formData[key].trim() !== "") {
      payload[key] = formData[key];
    }
  });

  try {
    await fetch(`http://localhost:5000/api/users/${editingUser}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setEditingUser(null);
    setFormData({ username: "", email: "", department: "", role: "" });
    fetchUsers();
  } catch (err) {
    console.error("Error updating user:", err);
  }
};


  // Logout
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

        {/* ✅ Update form */}
        {editingUser && (
          <div className="update-form">
            <h3>Update User</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              />
              <button type="submit">Update</button>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                style={{ marginLeft: "10px", background: "#74638dff" }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/*Users table */}
        <div className="table-card">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Actions</th>
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
                <td>
                <button className="btn btn-update" 
                onClick={() => handleEdit(u)}>Update</button>
                <button className="btn btn-delete" 
                onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
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
