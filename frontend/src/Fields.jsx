import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";

export default function Fields({ token }) {
  const [fields, setFields] = useState([]);
  const [error, setError] = useState(null);

  const fetchFields = async () => {
    try {
      const res = await API.get("/fields", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFields(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load fields");
    }
  };

  useEffect(() => {
    fetchFields();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this field?")) return;
    try {
      await API.delete(`/fields/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFields();
    } catch (err) {
      setError("Failed to delete field");
    }
  };

  const deleteButtonStyle = {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  };

  return (
    <div>
      <div style={headerStyle}>
        <h1>Fields</h1>
        <Link to="/fields/create" style={addButtonStyle}>
          + Add New Field
        </Link>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {fields.length === 0 ? (
        <div style={emptyStateStyle}>
          <p>No fields found. Create your first field to get started.</p>
          <Link to="/fields/create" style={addButtonStyle}>
            + Add New Field
          </Link>
        </div>
      ) : (
        <div style={gridStyle}>
          {fields.map(field => (
            <div key={field.id} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={cardTitleStyle}>{field.name}</h3>
                <span style={badgeStyle}>{field.size} acres</span>
              </div>
              <div style={cardBodyStyle}>
                <p><strong>Location:</strong> {field.location || "N/A"}</p>
                <p><strong>Soil Type:</strong> {field.soil_type || "N/A"}</p>
              </div>
              <div style={cardFooterStyle}>
                <Link to={`/fields/edit/${field.id}`} style={editLinkStyle}>
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(field.id)}
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
  backgroundColor: "#28a745",
  padding: "5px 10px",
  borderRadius: "15px",
  fontSize: "12px"
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
