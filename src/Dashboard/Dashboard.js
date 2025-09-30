import { useNavigate } from "react-router-dom";
import { Button, Container, Navbar, Nav } from "react-bootstrap";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

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
          <Button variant="outline-light" onClick={() => navigate("/")}>Logout</Button>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <h2>Dashboard</h2>
        {user ? (
          <>
            <p><b>Username:</b> {user.username}</p>
            <p><b>Email:</b> {user.email}</p>
          </>
        ) : (
          <p>No user data found.</p>
        )}
      </Container>
    </div>
  );
}

export default Dashboard;
