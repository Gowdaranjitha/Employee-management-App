import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login/Login";
import Registration from "./Registration/Registration";
import Dashboard from "./Dashboard/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
