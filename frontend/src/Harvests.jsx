import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";

export default function Harvests({ token }) {
  const [harvests, setHarvests] = useState([]);
  const [error, setError] = useState(null);

  const fetchHarvests = async () => {
    try {
      const res = await API.get("/harvests", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHarvests(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load harvests");
    }
  };

  useEffect(() => {
    fetchHarvests();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this harvest record?")) return;
    try {
      await API.delete(`/harvests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHarvests();
    } catch (err) {
      setError("Failed to delete harvest");
    }
  };

  return (
    <div>
      <div style={headerStyle}>
        <h1>Harvests (Yield Tracking)</h1>
        <Link to="/harvests/create" style={addButtonStyle}>
          + Record New Harvest
        </Link>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {harvests.length === 0 ? (
        <div style={emptyStateStyle}>
          <p>No harvests found. Record your first harvest to get started.</p>
          <Link to="/harvests/create" style={addButtonStyle}>
            + Record New Harvest
          </Link>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Field</th>
                <th style={thStyle}>Crop</th>
                <th style={thStyle}>Harvest Date</th>
                <th style={thStyle}>Yield</th>
                <th style={thStyle}>Revenue</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {harvests.map(harvest => (
                <tr key={harvest.id} style={trStyle}>
                  <td style={tdStyle}>{harvest.id}</td>
                  <td style={tdStyle}>{harvest.planting?.field?.name || "N/A"}</td>
                  <td style={tdStyle}>{harvest.planting?.crop?.name || "N/A"}</td>
                  <td style={tdStyle}>{harvest.harvest_date}</td>
                  <td style={tdStyle}>{harvest.yield_quantity}</td>
                  <td style={tdStyle}>
                    ${harvest.yield_quantity * (harvest.planting?.crop?.price_per_unit || 0).toFixed(2)}
                  </td>
                  <td style={tdStyle}>
                    <Link to={`/harvests/edit/${harvest.id}`} style={editLinkStyle}>
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(harvest.id)}
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
};

const addButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#28a745",
  color: "white",
  textDecoration: "none",
  borderRadius: "5px",
  fontWeight: "bold"
};

const errorStyle = {
  padding: "10px",
  backgroundColor: "#f8d7da",
  color: "#721c24",
  borderRadius: "5px",
  marginBottom: "15px"
};

const emptyStateStyle = {
  textAlign: "center",
  padding: "40px",
  backgroundColor: "#f9f9f9",
  borderRadius: "10px"
};

const tableContainerStyle = {
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  overflow: "hidden"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

const thStyle = {
  padding: "15px",
  textAlign: "left",
  backgroundColor: "#2c3e50",
  color: "white",
  fontWeight: "600"
};

const trStyle = {
  borderBottom: "1px solid #eee"
};

const tdStyle = {
  padding: "15px"
};

const editLinkStyle = {
  padding: "5px 15px",
  backgroundColor: "#007bff",
  color: "white",
  textDecoration: "none",
  borderRadius: "4px",
  marginRight: "5px"
};

const deleteButtonStyle = {
  padding: "5px 10px",
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};
