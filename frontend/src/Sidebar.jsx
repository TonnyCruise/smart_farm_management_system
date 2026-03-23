import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={sidebarStyle}>
      <h2 style={logoStyle}>Farm System</h2>

      <nav>
        <div style={sectionLabel}>Main Menu</div>
        <Link to="/dashboard" style={linkStyle}>
          <span style={iconStyle}>📊</span> Dashboard
        </Link>
        
        <div style={sectionLabel}>Farm Management</div>
        <Link to="/fields" style={linkStyle}>
          <span style={iconStyle}>🌾</span> Fields
        </Link>
        <Link to="/crops" style={linkStyle}>
          <span style={iconStyle}>🌱</span> Crops
        </Link>
        <Link to="/tasks" style={linkStyle}>
          <span style={iconStyle}>✅</span> Tasks
        </Link>
        
        <div style={sectionLabel}>Resources</div>
        <Link to="/inputs" style={linkStyle}>
          <span style={iconStyle}>📦</span> Inputs
        </Link>
        <Link to="/animals" style={linkStyle}>
          <span style={iconStyle}>🐄</span> Animals
        </Link>
        <Link to="/workers" style={linkStyle}>
          <span style={iconStyle}>👥</span> Workers
        </Link>
      </nav>
    </div>
  );
}

const sidebarStyle = {
  width: "250px",
  height: "100vh",
  background: "linear-gradient(180deg, #2c3e50 0%, #34495e 100%)",
  color: "white",
  padding: "20px",
  display: "flex",
  flexDirection: "column"
};

const logoStyle = {
  fontSize: "22px",
  marginBottom: "30px",
  paddingBottom: "20px",
  borderBottom: "1px solid rgba(255,255,255,0.2)",
  textAlign: "center"
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  padding: "12px 15px",
  margin: "5px 0",
  borderRadius: "5px",
  transition: "background-color 0.3s",
  fontSize: "15px"
};

const sectionLabel = {
  color: "rgba(255,255,255,0.5)",
  fontSize: "12px",
  textTransform: "uppercase",
  padding: "15px 15px 5px",
  marginTop: "10px"
};

const iconStyle = {
  marginRight: "10px",
  fontSize: "18px"
};

export default Sidebar;
