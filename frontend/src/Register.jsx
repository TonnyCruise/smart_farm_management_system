import { useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";
import { Wheat, Lock, Mail, User as UserIcon } from "lucide-react";

function Register({ setToken }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }
    setLoading(true);
    setError("");
    
    try {
      const res = await API.post("/register", { name, email, password, role: "customer" });
      setToken(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={leftSection}>
        <div style={heroContent}>
          <div style={heroIcon}><Wheat size={48} color="white" /></div>
          <h1 style={heroTitle}>Join SmartFarm</h1>
          <p style={heroSubtitle}>Order premium agriculture products directly to your front door!</p>
        </div>
      </div>

      <div style={rightSection}>
        <div style={loginCard}>
          <div style={cardHeader}>
            <h2 style={cardTitle}>Create Account</h2>
            <p style={cardSubtitle}>Sign up to access our fresh inventory</p>
          </div>

          {error && <div style={errorAlert}>{error}</div>}

          <div style={formGroup}>
            <label style={labelStyle}>Full Name</label>
            <div style={inputWrapper}>
              <UserIcon size={18} style={inputIcon} />
              <input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} style={inputWithIcon} />
            </div>
          </div>

          <div style={formGroup}>
            <label style={labelStyle}>Email Address</label>
            <div style={inputWrapper}>
              <Mail size={18} style={inputIcon} />
              <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputWithIcon} />
            </div>
          </div>

          <div style={formGroup}>
            <label style={labelStyle}>Create Password</label>
            <div style={inputWrapper}>
              <Lock size={18} style={inputIcon} />
              <input type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} style={inputWithIcon} />
            </div>
          </div>

          <button onClick={handleRegister} disabled={loading} style={loginButton}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p style={registerText}>
            Already have an account? <Link to="/login" style={registerLink}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Styling copied from Login.jsx for consistency
const pageStyle = { display: "flex", minHeight: "100vh", background: "var(--bg-main)" };
const leftSection = { flex: 1, background: "linear-gradient(135deg, #16a34a 0%, #15803d 50%, #14532d 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" };
const heroContent = { textAlign: "center", color: "white", maxWidth: "480px" };
const heroIcon = { width: "100px", height: "100px", background: "rgba(255,255,255,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" };
const heroTitle = { fontSize: "42px", fontWeight: "700", marginBottom: "16px" };
const heroSubtitle = { fontSize: "18px", opacity: 0.9, marginBottom: "40px" };
const rightSection = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", background: "var(--bg-main)" };
const loginCard = { width: "100%", maxWidth: "420px", padding: "40px", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" };
const cardHeader = { textAlign: "center", marginBottom: "32px" };
const cardTitle = { fontSize: "28px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" };
const cardSubtitle = { color: "var(--text-secondary)", fontSize: "15px" };
const errorAlert = { background: "#fee2e2", color: "#b91c1c", padding: "12px 16px", borderRadius: "var(--radius)", fontSize: "14px", marginBottom: "20px" };
const formGroup = { marginBottom: "20px" };
const labelStyle = { display: "block", fontSize: "14px", fontWeight: "500", color: "var(--text-primary)", marginBottom: "8px" };
const inputWrapper = { position: "relative", display: "flex", alignItems: "center" };
const inputIcon = { position: "absolute", left: "14px", color: "var(--text-secondary)", pointerEvents: "none" };
const inputWithIcon = { width: "100%", padding: "12px 14px 12px 44px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "15px", background: "var(--bg-card)", color: "var(--text-primary)" };
const loginButton = { width: "100%", padding: "14px", background: "var(--primary)", color: "white", border: "none", borderRadius: "var(--radius)", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "8px" };
const registerText = { textAlign: "center", marginTop: "24px", color: "var(--text-secondary)", fontSize: "14px" };
const registerLink = { color: "var(--primary)", textDecoration: "none", fontWeight: "500" };

export default Register;
