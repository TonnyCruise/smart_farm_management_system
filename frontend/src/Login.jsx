import { useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";
import { Wheat, Lock, Mail, Eye, EyeOff } from "lucide-react";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await API.post("/login", { email, password });
      setToken(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={pageStyle}>
      <div style={leftSection}>
        <div style={heroContent}>
          <div style={heroIcon}>
            <Wheat size={48} color="white" />
          </div>
          <h1 style={heroTitle}>SmartFarm ERP</h1>
          <p style={heroSubtitle}>
            Manage your farm operations efficiently with our comprehensive 
            enterprise resource planning system
          </p>
          <div style={featuresList}>
            <div style={featureItem}>
              <span style={featureCheck}>✓</span> Livestock Management
            </div>
            <div style={featureItem}>
              <span style={featureCheck}>✓</span> Crop & Field Tracking
            </div>
            <div style={featureItem}>
              <span style={featureCheck}>✓</span> Inventory Control
            </div>
            <div style={featureItem}>
              <span style={featureCheck}>✓</span> Financial Reports
            </div>
          </div>
        </div>
      </div>

      <div style={rightSection}>
        <div style={loginCard}>
          <div style={cardHeader}>
            <h2 style={cardTitle}>Welcome Back</h2>
            <p style={cardSubtitle}>Sign in to access your farm dashboard</p>
          </div>

          {error && (
            <div style={errorAlert}>
              {error}
            </div>
          )}

          <div style={formGroup}>
            <label style={labelStyle}>Email Address</label>
            <div style={inputWrapper}>
              <Mail size={18} style={inputIcon} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                style={inputWithIcon}
              />
            </div>
          </div>

          <div style={formGroup}>
            <label style={labelStyle}>Password</label>
            <div style={inputWrapper}>
              <Lock size={18} style={inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                style={inputWithIcon}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={togglePassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            onClick={handleLogin} 
            disabled={loading}
            style={loginButton}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p style={registerText}>
            Don't have an account? <Link to="/register" style={registerLink}>Contact Admin</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  display: "flex",
  minHeight: "100vh",
  background: "var(--bg-main)",
};

const leftSection = {
  flex: 1,
  background: "linear-gradient(135deg, #16a34a 0%, #15803d 50%, #14532d 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px",
  position: "relative",
  overflow: "hidden",
};

const heroContent = {
  textAlign: "center",
  color: "white",
  maxWidth: "480px",
  zIndex: 1,
};

const heroIcon = {
  width: "100px",
  height: "100px",
  background: "rgba(255,255,255,0.15)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 24px",
  backdropFilter: "blur(10px)",
};

const heroTitle = {
  fontSize: "42px",
  fontWeight: "700",
  marginBottom: "16px",
  letterSpacing: "-0.5px",
};

const heroSubtitle = {
  fontSize: "18px",
  opacity: 0.9,
  marginBottom: "40px",
  lineHeight: 1.6,
};

const featuresList = {
  textAlign: "left",
  display: "inline-block",
};

const featureItem = {
  fontSize: "16px",
  marginBottom: "12px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const featureCheck = {
  width: "24px",
  height: "24px",
  background: "rgba(255,255,255,0.2)",
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
};

const rightSection = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px",
  background: "var(--bg-main)",
};

const loginCard = {
  width: "100%",
  maxWidth: "420px",
  padding: "40px",
  background: "var(--bg-card)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-lg)",
  border: "1px solid var(--border)",
};

const cardHeader = {
  textAlign: "center",
  marginBottom: "32px",
};

const cardTitle = {
  fontSize: "28px",
  fontWeight: "700",
  color: "var(--text-primary)",
  marginBottom: "8px",
};

const cardSubtitle = {
  color: "var(--text-secondary)",
  fontSize: "15px",
};

const errorAlert = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "12px 16px",
  borderRadius: "var(--radius)",
  fontSize: "14px",
  marginBottom: "20px",
  border: "1px solid #fecaca",
};

const formGroup = {
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  fontSize: "14px",
  fontWeight: "500",
  color: "var(--text-primary)",
  marginBottom: "8px",
};

const inputWrapper = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

const inputIcon = {
  position: "absolute",
  left: "14px",
  color: "var(--text-secondary)",
  pointerEvents: "none",
};

const inputWithIcon = {
  width: "100%",
  padding: "12px 14px 12px 44px",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  fontSize: "15px",
  transition: "all 0.2s ease",
  background: "var(--bg-card)",
  color: "var(--text-primary)",
};

const togglePassword = {
  position: "absolute",
  right: "14px",
  background: "none",
  border: "none",
  color: "var(--text-secondary)",
  cursor: "pointer",
  padding: "4px",
};

const loginButton = {
  width: "100%",
  padding: "14px",
  background: "var(--primary)",
  color: "white",
  border: "none",
  borderRadius: "var(--radius)",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginTop: "8px",
};

const registerText = {
  textAlign: "center",
  marginTop: "24px",
  color: "var(--text-secondary)",
  fontSize: "14px",
};

const registerLink = {
  color: "var(--primary)",
  textDecoration: "none",
  fontWeight: "500",
};

export default Login;
