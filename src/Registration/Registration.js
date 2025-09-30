import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registration({ setRegistrationData }) {
  const [form, setForm] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setRegistrationData(form);
    navigate("/dashboard");
  };

  return (
    <div>
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <br />
      </form>

      <button onClick={() => navigate("/")}>⬅ Back to Login</button>
       <br/><button onClick={() => navigate("/dashboard")}> Next</button><br/>
    </div>
  );
}

export default Registration;
