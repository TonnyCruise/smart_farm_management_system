import { useState } from "react";
import API from "./api";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { email, password });
      setToken(res.data.token);
    } catch (err) {
        console.log(err.response);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#2c3e50" }}>Farm System Login</h2>
        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button onClick={handleLogin} style={buttonStyle}>Login</button>
      </div>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f5f5f5"
};

const formStyle = {
  padding: "40px",
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "400px"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "5px",
  fontSize: "14px",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
  fontWeight: "bold"
};

export default Login;
