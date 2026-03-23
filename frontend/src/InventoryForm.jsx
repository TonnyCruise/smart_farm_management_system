import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./api";

export default function InventoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    planting_id: "",
    input_id: "",
    quantity_used: "",
    usage_date: "",
    notes: ""
  });
  const [plantings, setPlantings] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [selectedInputDetails, setSelectedInputDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [calculatedCost, setCalculatedCost] = useState(0);
  const [stockWarning, setStockWarning] = useState(null);

  useEffect(() => {
    // Fetch plantings and inputs for dropdowns
    Promise.all([
      API.get("/plantings", { headers: { Authorization: `Bearer ${token}` } }),
      API.get("/inputs", { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(([plantingsRes, inputsRes]) => {
        setPlantings(plantingsRes.data);
        setInputs(inputsRes.data);
      })
      .catch(err => console.error(err));

    // Fetch existing inventory record if editing
    if (id) {
      setLoading(true);
      API.get(`/inventories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setForm(res.data);
          calculateCost(res.data.input_id, res.data.quantity_used, inputs);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load inventory data");
          setLoading(false);
        });
    }
  }, [id, token]);

  const calculateCost = (inputId, quantity, inputList) => {
    const selectedInput = inputList || inputs.find(i => i.id === parseInt(inputId));
    if (selectedInput && quantity) {
      const cost = parseFloat(quantity) * parseFloat(selectedInput.cost_per_unit || 0);
      setCalculatedCost(cost.toFixed(2));
    } else {
      setCalculatedCost(0);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      
      // Calculate cost and check stock when input or quantity changes
      if (name === "input_id" || name === "quantity_used") {
        const inputId = name === "input_id" ? value : prev.input_id;
        const quantity = name === "quantity_used" ? value : prev.quantity_used;
        
        // Find selected input details
        const selectedInput = inputs.find(i => i.id === parseInt(inputId));
        setSelectedInputDetails(selectedInput || null);
        
        // Check stock levels
        if (selectedInput && quantity) {
          const qty = parseFloat(quantity);
          if (qty > (selectedInput.quantity || 0)) {
            setStockWarning(`Warning: Only ${selectedInput.quantity} ${selectedInput.unit} available in stock!`);
          } else {
            setStockWarning(null);
          }
          calculateCost(inputId, quantity, null);
        } else {
          setStockWarning(null);
          calculateCost(inputId, quantity, null);
        }
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
        await API.put(`/inventories/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await API.post("/inventories", form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate("/inventories");
    } catch (err) {
      console.error(err);
      setError("Failed to save inventory record. Please try again.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/inventories");
  };

  // Get field info from selected planting
  const selectedPlanting = plantings.find(p => p.id === parseInt(form.planting_id));

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={titleStyle}>{id ? "Edit Input Usage" : "Record Input Usage"}</h2>
        <p style={subtitleStyle}>
          Link input usage to a field (via planting) and track costs automatically
        </p>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Field/Planting *</label>
            <select
              name="planting_id"
              value={form.planting_id}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Field to Apply Input</option>
              {plantings.map(planting => (
                <option key={planting.id} value={planting.id}>
                  {planting.field?.name} - {planting.crop?.name} ({planting.planting_date})
                </option>
              ))}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Input *</label>
            <select
              name="input_id"
              value={form.input_id}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Input</option>
              {inputs.map(input => (
                <option key={input.id} value={input.id}>
                  {input.name} ({input.unit}) - ${input.cost_per_unit}/unit | Stock: {input.quantity} {input.unit}
                </option>
              ))}
            </select>
            
            {/* Show selected input details */}
            {selectedInputDetails && (
              <div style={inputDetailsStyle}>
                <div><strong>Available Stock:</strong> {selectedInputDetails.quantity} {selectedInputDetails.unit}</div>
                <div><strong>Cost per Unit:</strong> ${selectedInputDetails.cost_per_unit}</div>
                <div><strong>Total Value:</strong> ${(selectedInputDetails.quantity * selectedInputDetails.cost_per_unit).toFixed(2)}</div>
              </div>
            )}
            
            {stockWarning && <div style={warningStyle}>{stockWarning}</div>}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Quantity Used *</label>
            <input
              name="quantity_used"
              type="number"
              step="0.01"
              placeholder="Enter quantity used"
              value={form.quantity_used}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Usage Date *</label>
            <input
              name="usage_date"
              type="date"
              value={form.usage_date}
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

          {/* Auto-calculated Cost Display */}
          <div style={costDisplayStyle}>
            <div style={costItemStyle}>
              <span style={costLabelStyle}>Input Cost:</span>
              <span style={costValueStyle}>${calculatedCost}</span>
            </div>
            {selectedPlanting && (
              <div style={fieldInfoStyle}>
                <strong>Field:</strong> {selectedPlanting.field?.name} | 
                <strong> Crop:</strong> {selectedPlanting.crop?.name}
              </div>
            )}
            {selectedInputDetails && form.planting_id && (
              <div style={fieldInfoStyle}>
                <strong>Input:</strong> {selectedInputDetails.name} | 
                <strong> Qty:</strong> {form.quantity_used} {selectedInputDetails.unit}
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

const costDisplayStyle = {
  padding: "15px",
  backgroundColor: "#e8f5e9",
  borderRadius: "8px",
  marginBottom: "20px"
};

const costItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px"
};

const costLabelStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#2e7d32"
};

const costValueStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#2e7d32"
};

const fieldInfoStyle = {
  paddingTop: "10px",
  borderTop: "1px solid #c8e6c9",
  color: "#555"
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

const inputDetailsStyle = {
  marginTop: "10px",
  padding: "12px",
  backgroundColor: "#e3f2fd",
  borderRadius: "5px",
  fontSize: "14px"
};

const warningStyle = {
  marginTop: "8px",
  padding: "10px",
  backgroundColor: "#fff3cd",
  color: "#856404",
  borderRadius: "5px",
  fontSize: "14px",
  border: "1px solid #ffeeba"
};
