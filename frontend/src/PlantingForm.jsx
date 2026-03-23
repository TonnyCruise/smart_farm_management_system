import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./api";

export default function PlantingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    field_id: "",
    crop_id: "",
    planting_date: "",
    notes: ""
  });
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch fields and crops for dropdowns
    Promise.all([
      API.get("/fields", { headers: { Authorization: `Bearer ${token}` } }),
      API.get("/crops", { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(([fieldsRes, cropsRes]) => {
        setFields(fieldsRes.data);
        setCrops(cropsRes.data);
      })
      .catch(err => console.error(err));

    // Fetch existing planting if editing
    if (id) {
      setLoading(true);
      API.get(`/plantings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setForm({
            field_id: res.data.field_id,
            crop_id: res.data.crop_id,
            planting_date: res.data.planting_date,
            notes: res.data.notes || ""
          });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load planting data");
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
        await API.put(`/plantings/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await API.post("/plantings", form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate("/plantings");
    } catch (err) {
      console.error(err);
      setError("Failed to save planting. Please try again.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/plantings");
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={titleStyle}>{id ? "Edit Planting" : "Record New Planting"}</h2>
        <p style={subtitleStyle}>
          Track when crops are planted in each field
        </p>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Field *</label>
            <select
              name="field_id"
              value={form.field_id}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Field</option>
              {fields.map(field => (
                <option key={field.id} value={field.id}>
                  {field.name} ({field.size} acres)
                </option>
              ))}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Crop *</label>
            <select
              name="crop_id"
              value={form.crop_id}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Crop</option>
              {crops.map(crop => (
                <option key={crop.id} value={crop.id}>
                  {crop.name}
                </option>
              ))}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Planting Date *</label>
            <input
              name="planting_date"
              type="date"
              value={form.planting_date}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Notes</label>
            <textarea
              name="notes"
              placeholder="Enter any notes about this planting"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              style={{...inputStyle, resize: "vertical"}}
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
  marginBottom: "5px",
  color: "#2c3e50",
  textAlign: "center"
};

const subtitleStyle = {
  textAlign: "center",
  color: "#666",
  marginBottom: "20px",
  fontSize: "14px"
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
