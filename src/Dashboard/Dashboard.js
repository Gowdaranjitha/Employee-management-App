import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

function Dashboard({ loginData, registrationData }) {
  const navigate = useNavigate();

  return (
    <div>
      {/* 🔹 Navigation Header */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand onClick={() => navigate("/")}>MyApp</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/")}>Login</Nav.Link>
            <Nav.Link onClick={() => navigate("/registration")}>
              Registration
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/dashboard")}>Dashboard</Nav.Link>
          </Nav>
          <Button variant="outline-light" onClick={() => navigate("/")}>
            Logout
          </Button>
        </Container>
      </Navbar>

      {/* 🔹 Dashboard Content */}
      <Container className="mt-4">
        <h2>Dashboard</h2>

        <h3>Login Details</h3>
        <p>Username: {loginData.username}</p>
        <p>Password: {loginData.password}</p>

        <h3>Registration Details</h3>
        <p>Name: {registrationData.name}</p>
        <p>Email: {registrationData.email}</p>

        <Button variant="secondary" onClick={() => navigate("/registration")}>
          ⬅ Back to Registration
        </Button>
      </Container>
    </div>
  );
}

export default Dashboard;
