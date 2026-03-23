import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";

export default function Inventories({ token }) {
  const [inventories, setInventories] = useState([]);
  const [error, setError] = useState(null);

  const fetchInventories = async () => {
    try {
      const res = await API.get("/inventories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventories(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load inventories");
    }
  };

  useEffect(() => {
    fetchInventories();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inventory record?")) return;
    try {
      await API.delete(`/inventories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInventories();
    } catch (err) {
      setError("Failed to delete inventory record");
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity < 50) return { label: "Critical", color: "#dc3545" };
    if (quantity < 100) return { label: "Low", color: "#ffc107" };
    return { label: "Good", color: "#28a745" };
  };

  return (
    <div>
      <div style={headerStyle}>
        <h1>Inventory (Stock Levels)</h1>
        <Link to="/inventories/create" style={addButtonStyle}>
          + Record Input Usage
        </Link>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {inventories.length === 0 ? (
        <div style={emptyStateStyle}>
          <p>No inventory records found. Record your first input usage.</p>
          <Link to="/inventories/create" style={addButtonStyle}>
            + Record Input Usage
          </Link>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Input</th>
                <th style={thStyle}>Quantity Available</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Last Updated</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventories.map(inv => {
                const status = getStockStatus(inv.quantity_available);
                return (
                  <tr key={inv.id} style={trStyle}>
                    <td style={tdStyle}>{inv.id}</td>
                    <td style={tdStyle}>{inv.input?.name || "N/A"}</td>
                    <td style={tdStyle}>{inv.quantity_available} {inv.input?.unit || ""}</td>
                    <td style={tdStyle}>
                      <span style={{
                        ...badgeStyle, 
                        backgroundColor: status.color
                      }}>
                        {status.label}
                      </span>
                    </td>
                    <td style={tdStyle}>{new Date(inv.updated_at).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      <button 
                        onClick={() => handleDelete(inv.id)}
                        style={deleteButtonStyle}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
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

const badgeStyle = {
  padding: "5px 10px",
  borderRadius: "15px",
  fontSize: "12px",
  color: "white"
};

const deleteButtonStyle = {
  padding: "5px 10px",
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};
