import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";

export default function Inputs({ token }) {
  const [inputs, setInputs] = useState([]);
  const [error, setError] = useState(null);

  const fetchInputs = async () => {
    try {
      const res = await API.get("/inputs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInputs(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load inputs");
    }
  };

  useEffect(() => {
    fetchInputs();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this input?")) return;
    try {
      await API.delete(`/inputs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInputs();
    } catch (err) {
      setError("Failed to delete input");
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      fertilizer: "#28a745",
      pesticide: "#dc3545",
      seed: "#ffc107",
      herbicide: "#17a2b8",
      fungicide: "#6f42c1"
    };
    return colors[type?.toLowerCase()] || "#6c757d";
  };

  return (
    <div>
      <div style={headerStyle}>
        <h1>Inputs (Inventory Items)</h1>
        <Link to="/inputs/create" style={addButtonStyle}>
          + Add New Input
        </Link>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {inputs.length === 0 ? (
        <div style={emptyStateStyle}>
          <p>No inputs found. Create your first input to get started.</p>
          <Link to="/inputs/create" style={addButtonStyle}>
            + Add New Input
          </Link>
        </div>
      ) : (
        <div style={gridStyle}>
          {inputs.map(input => (
            <div key={input.id} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={cardTitleStyle}>{input.name}</h3>
                {input.type && (
                  <span style={{...badgeStyle, backgroundColor: getTypeColor(input.type)}}>
                    {input.type}
                  </span>
                )}
              </div>
              <div style={cardBodyStyle}>
                <p><strong>Unit:</strong> {input.unit || "N/A"}</p>
                <p><strong>Cost per Unit:</strong> ${input.cost_per_unit || "0.00"}</p>
              </div>
              <div style={cardFooterStyle}>
                <Link to={`/inputs/edit/${input.id}`} style={editLinkStyle}>
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(input.id)}
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
