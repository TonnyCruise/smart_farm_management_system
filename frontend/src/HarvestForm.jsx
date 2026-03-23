import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./api";

export default function HarvestForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    planting_id: "",
    harvest_date: "",
    yield_quantity: "",
    notes: ""
  });
  const [plantings, setPlantings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [calculatedRevenue, setCalculatedRevenue] = useState(0);

  useEffect(() => {
    // Fetch plantings for dropdown
    API.get("/plantings", { 
      headers: { Authorization: `Bearer ${token}` } 
    })
      .then(res => setPlantings(res.data))
      .catch(err => console.error(err));

    // Fetch existing harvest if editing
    if (id) {
      setLoading(true);
      API.get(`/harvests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setForm({
            planting_id: res.data.planting_id,
            harvest_date: res.data.harvest_date,
            yield_quantity: res.data.yield_quantity,
            notes: res.data.notes || ""
          });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load harvest data");
          setLoading(false);
        });
    }
  }, [id, token]);

  const calculateRevenue = (plantingId, quantity) => {
    const selected = plantings.find(p => p.id === parseInt(plantingId));
    if (selected && quantity) {
      const revenue = parseFloat(quantity) * parseFloat(selected.crop?.price_per_unit || 0);
      setCalculatedRevenue(revenue.toFixed(2));
    } else {
      setCalculatedRevenue(0);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      
      // Calculate revenue when planting or quantity changes
      if (name === "planting_id" || name === "yield_quantity") {
        const plantingId = name === "planting_id" ? value : prev.planting_id;
        const quantity = name === "yield_quantity" ? value : prev.yield_quantity;
        calculateRevenue(plantingId, quantity);
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (id) {
        await API.put(`/harvests/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await API.post("/harvests", form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate("/harvests");
    } catch (err) {
      console.error(err);
      setError("Failed to save harvest. Please try again.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/harvests");
  };

  // Get field info from selected planting
  const selectedPlanting = plantings.find(p => p.id === parseInt(form.planting_id));

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={titleStyle}>{id ? "Edit Harvest" : "Record New Harvest"}</h2>
        <p style={subtitleStyle}>
          Track yield and calculate revenue automatically
        </p>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Planting (Field + Crop) *</label>
            <select
              name="planting_id"
              value={form.planting_id}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Planting</option>
              {plantings.map(planting => (
                <option key={planting.id} value={planting.id}>
                  {planting.field?.name} - {planting.crop?.name} (${planting.crop?.price_per_unit}/unit)
                </option>
              ))}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Harvest Date *</label>
            <input
              name="harvest_date"
              type="date"
              value={form.harvest_date}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Yield Quantity *</label>
            <input
              name="yield_quantity"
              type="number"
              step="0.01"
              placeholder="Enter yield quantity"
              value={form.yield_quantity}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Notes</label>
            <textarea
              name="notes"
              placeholder="Enter any notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              style={{...inputStyle, resize: "vertical"}}
            />
          </div>

          {/* Auto-calculated Revenue Display */}
          <div style={revenueDisplayStyle}>
            <div style={revenueItemStyle}>
              <span style={revenueLabelStyle}>Price per Unit:</span>
              <span style={revenueValueStyle}>
                ${selectedPlanting?.crop?.price_per_unit || "0.00"}
              </span>
            </div>
            <div style={revenueItemStyle}>
              <span style={revenueLabelStyle}>Total Revenue:</span>
              <span style={revenueValueStyleHighlighted}>${calculatedRevenue}</span>
            </div>
            {selectedPlanting && (
              <div style={fieldInfoStyle}>
                <strong>Field:</strong> {selectedPlanting.field?.name} | 
                <strong> Crop:</strong> {selectedPlanting.crop?.name}
              </div>
            )}
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
  maxWidth: "550px"
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

const revenueDisplayStyle = {
  padding: "15px",
  backgroundColor: "#e3f2fd",
  borderRadius: "8px",
  marginBottom: "20px"
};

const revenueItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px"
};

const revenueLabelStyle = {
  fontSize: "14px",
  color: "#1565c0"
};

const revenueValueStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1565c0"
};

const revenueValueStyleHighlighted = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#1565c0"
};

const fieldInfoStyle = {
  paddingTop: "10px",
  borderTop: "1px solid #bbdefb",
  color: "#555",
  fontSize: "14px"
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
