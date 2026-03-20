import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{
      width: "200px",
      height: "100vh",
      background: "#2c3e50",
      color: "white",
      padding: "20px"
    }}>
      <h2>Farm System</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/dashboard" style={linkStyle}>Dashboard</Link></li>
        <li><Link to="/animals" style={linkStyle}>Animals</Link></li>
        <li><Link to="/fields" style={linkStyle}>Fields</Link></li>
        <li><Link to="/workers" style={linkStyle}>Workers</Link></li>
      </ul>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  display: "block",
  margin: "10px 0"
};

export default Sidebar;