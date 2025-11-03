import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import dashboardBg from "../assets/dashboardbg.png";
import API from "../api/axiosConfig";

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

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (!user) navigate("/login");
    else fetchUsers();
    // eslint-disable-next-line
  }, []);

  // Fetch users based on role
  const fetchUsers = async () => {
    try {
      if (user.role === "Admin" || user.role === "Manager") {
        const res = await API.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } else if (user.role === "Employee") {
        const res = await API.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers([res.data]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userId === id) {
        localStorage.clear();
        navigate("/login");
      } else {
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // Edit setup
  const handleEdit = (u) => {
    setEditingUser(u._id);
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

    const payload = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] && formData[key].trim() !== "") {
        payload[key] = formData[key];
      }
    });

    try {
      await API.patch(`/users/${editingUser}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (!user) return null;

  const isAdmin = user.role === "Admin";
  const isManager = user.role === "Manager";
  const isEmployee = user.role === "Employee";

  return (
    <div
      className="dashboard-container"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(58,44,97,0.6), rgba(76,100,153,0.6)), url(${dashboardBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="dashboard-overlay"></div>

      <main className="dashboard-content">
        <div className="welcome-card">
          <h1>Welcome, {user.username} 👋</h1>
          <p>
            {isAdmin
              ? "You have full control (View, Update, Delete all users)"
              : isManager
              ? "You can view all users but update/delete only your own profile"
              : "You can view and update your own details"}
          </p>
        </div>

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
              {(isAdmin || editingUser === userId) && (
                <input
                  type="text"
                  placeholder="Role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                />
              )}
              <button type="submit" className="btn btn-update">
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="btn btn-delete"
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

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
              {users.map((u) => {
                const canView =
                  isAdmin || isManager || (isEmployee && userId === u._id);
                const canModify =
                  isAdmin ||
                  (isManager && userId === u._id) ||
                  (isEmployee && userId === u._id);

                if (!canView) return null;

                return (
                  <tr key={u._id}>
                    <td>{u._id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.department}</td>
                    <td>{u.role}</td>
                    <td>
                      {canModify && (
                        <div className="action-buttons">
                          <button
                            className="btn btn-update"
                            onClick={() => handleEdit(u)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => handleDelete(u._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;