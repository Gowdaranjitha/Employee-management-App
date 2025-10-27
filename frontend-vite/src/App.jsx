import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Registration from "./Registration/Registration";
import Dashboard from "./Dashboard/Dashboard";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
