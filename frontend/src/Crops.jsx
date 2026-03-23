import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";

export default function Crops({ token }) {
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState(null);

  const fetchCrops = async () => {
    try {
      const res = await API.get("/crops", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCrops(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load crops");
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;
    try {
      await API.delete(`/crops/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCrops();
    } catch (err) {
      setError("Failed to delete crop");
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      vegetable: "#28a745",
      fruit: "#dc3545",
      grain: "#ffc107",
      legume: "#17a2b8"
    };
    return colors[category?.toLowerCase()] || "#6c757d";
  };

  return (
    <div>
      <div style={headerStyle}>
        <h1>Crops</h1>
        <Link to="/crops/create" style={addButtonStyle}>
          + Add New Crop
        </Link>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {crops.length === 0 ? (
        <div style={emptyStateStyle}>
          <p>No crops found. Create your first crop to get started.</p>
          <Link to="/crops/create" style={addButtonStyle}>
            + Add New Crop
          </Link>
        </div>
      ) : (
        <div style={gridStyle}>
          {crops.map(crop => (
            <div key={crop.id} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={cardTitleStyle}>{crop.name}</h3>
                {crop.category && (
                  <span style={{...badgeStyle, backgroundColor: getCategoryColor(crop.category)}}>
                    {crop.category}
                  </span>
                )}
              </div>
              <div style={cardBodyStyle}>
                <p><strong>Description:</strong> {crop.description || "N/A"}</p>
                <p><strong>Price per Unit:</strong> ${crop.price_per_unit || "0.00"}</p>
              </div>
              <div style={cardFooterStyle}>
                <Link to={`/crops/edit/${crop.id}`} style={editLinkStyle}>
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(crop.id)}
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
  color: "white"
};

const cardBodyStyle = {
  padding: "15px"
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
