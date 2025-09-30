import { Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Registration from "./Registration/Registration";
import Dashboard from "./Dashboard/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
