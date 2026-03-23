import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./api";

export default function FieldForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    size: "",
    location: "",
    soil_type: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      API.get(`/fields/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setForm(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load field data");
          setLoading(false);
        });
    }
  }, [id, token]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (id) {
        await API.put(`/fields/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await API.post("/fields", form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate("/fields");
    } catch (err) {
      console.error(err);
      setError("Failed to save field. Please try again.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/fields");
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={titleStyle}>{id ? "Edit Field" : "Create New Field"}</h2>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Field Name *</label>
            <input
              name="name"
              placeholder="Enter field name"
              value={form.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Size (acres) *</label>
            <input
              name="size"
              type="number"
              placeholder="Enter field size"
              value={form.size}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Location</label>
            <input
              name="location"
              placeholder="Enter location"
              value={form.location}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Soil Type</label>
            <input
              name="soil_type"
              placeholder="Enter soil type"
              value={form.soil_type}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={buttonGroupStyle}>
            <button 
              type="submit" 
              style={submitButtonStyle}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button 
              type="button" 
              onClick={handleCancel}
              style={cancelButtonStyle}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f5f5f5",
  padding: "20px"
};

const formCardStyle = {
  padding: "30px",
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "500px"
};

const titleStyle = {
  marginBottom: "25px",
  color: "#2c3e50",
  textAlign: "center"
};

const errorStyle = {
  padding: "10px",
  backgroundColor: "#f8d7da",
  color: "#721c24",
  borderRadius: "5px",
  marginBottom: "15px",
  border: "1px solid #f5c6cb"
};

const formGroupStyle = {
  marginBottom: "20px"
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#555",
  fontWeight: "500"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "5px",
  fontSize: "14px",
  boxSizing: "border-box"
};

const buttonGroupStyle = {
  display: "flex",
  gap: "10px",
  marginTop: "25px"
};

const submitButtonStyle = {
  flex: 1,
  padding: "12px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
  fontWeight: "bold"
};

const cancelButtonStyle = {
  flex: 1,
  padding: "12px",
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
  fontWeight: "bold"
};
