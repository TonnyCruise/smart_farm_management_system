import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";

export default function Plantings({ token, canEdit }) {
  const [plantings, setPlantings] = useState([]);
  const [error, setError] = useState(null);

  const fetchPlantings = async () => {
    try {
      const res = await API.get("/plantings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlantings(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load plantings");
    }
  };

  useEffect(() => {
    fetchPlantings();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this planting?")) return;
    try {
      await API.delete(`/plantings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPlantings();
    } catch (err) {
      setError("Failed to delete planting");
    }
  };

  return (
    <div>
      <div style={headerStyle}>
        <h1>Plantings (Crop Planning)</h1>
        <Link to="/plantings/create" style={addButtonStyle}>
          + Record New Planting
        </Link>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {plantings.length === 0 ? (
        <div style={emptyStateStyle}>
          <p>No plantings found. Record your first planting to get started.</p>
          <Link to="/plantings/create" style={addButtonStyle}>
            + Record New Planting
          </Link>
        </div>
      ) : (
        <div style={gridStyle}>
          {plantings.map(planting => (
            <div key={planting.id} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={cardTitleStyle}>{planting.field?.name}</h3>
                <span style={badgeStyle}>ID: {planting.id}</span>
              </div>
              <div style={cardBodyStyle}>
                <div style={detailRowStyle}>
                  <span style={detailLabelStyle}>Crop:</span>
                  <span style={detailValueStyle}>{planting.crop?.name}</span>
                </div>
                <div style={detailRowStyle}>
                  <span style={detailLabelStyle}>Planted:</span>
                  <span style={detailValueStyle}>{planting.planting_date}</span>
                </div>
                <div style={detailRowStyle}>
                  <span style={detailLabelStyle}>Notes:</span>
                  <span style={detailValueStyle}>{planting.notes || "No notes"}</span>
                </div>
              </div>
              <div style={cardFooterStyle}>
                <Link to={`/plantings/edit/${planting.id}`} style={editLinkStyle}>
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(planting.id)}
                  style={deleteButtonStyle}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px"
};

const cardStyle = {
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  overflow: "hidden"
};

const cardHeaderStyle = {
  padding: "15px",
  backgroundColor: "#2c3e50",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const cardTitleStyle = {
  margin: 0,
  fontSize: "18px"
};

const badgeStyle = {
  padding: "5px 10px",
  borderRadius: "15px",
  fontSize: "12px",
  backgroundColor: "#17a2b8"
};

const cardBodyStyle = {
  padding: "15px"
};

const detailRowStyle = {
  marginBottom: "8px"
};

const detailLabelStyle = {
  fontWeight: "bold",
  color: "#555",
  marginRight: "8px"
};

const detailValueStyle = {
  color: "#333"
};

const cardFooterStyle = {
  padding: "15px",
  borderTop: "1px solid #eee",
  display: "flex",
  justifyContent: "space-between"
};

const editLinkStyle = {
  padding: "5px 15px",
  backgroundColor: "#007bff",
  color: "white",
  textDecoration: "none",
  borderRadius: "4px"
};

const deleteButtonStyle = {
  padding: "5px 10px",
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};
