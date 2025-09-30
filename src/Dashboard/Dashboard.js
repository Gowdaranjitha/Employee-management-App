import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Navbar, Nav, Table } from "react-bootstrap";

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
    <div>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand onClick={() => navigate("/")}>MyApp</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/")}>Login</Nav.Link>
            <Nav.Link onClick={() => navigate("/registration")}>Register</Nav.Link>
            <Nav.Link onClick={() => navigate("/dashboard")}>Dashboard</Nav.Link>
          </Nav>
          <Button variant="outline-light" onClick={() => navigate("/")}>
            Logout
          </Button>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <h2>Dashboard</h2>
        {user && (
          <p>
            <b>Logged in as:</b> {user.username} ({user.name})
          </p>
        )}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u.id}>
                <td>{index + 1}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default Dashboard;
