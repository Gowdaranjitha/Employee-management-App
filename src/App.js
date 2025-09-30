import './App.css';
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import Registration from './Registration/Registration';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [loginData, setLoginData] = useState({});
  const [registrationData, setRegistrationData] = useState({});

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login setLoginData={setLoginData} />} />
        <Route
          path="/registration"
          element={<Registration setRegistrationData={setRegistrationData} />}
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              loginData={loginData}
              registrationData={registrationData}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
