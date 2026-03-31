import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./api";

export default function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    task_name: "",
    worker_id: "",
    field_id: "",
    planting_id: "",
    task_date: "",
    status: "pending",
    notes: ""
  });
  const [workers, setWorkers] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch workers and fields for dropdowns
    Promise.all([
      API.get("/workers", { headers: { Authorization: `Bearer ${token}` } }),
      API.get("/fields", { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(([workersRes, fieldsRes]) => {
        setWorkers(workersRes.data);
        setFields(fieldsRes.data);
      })
      .catch(err => console.error(err));

    // Fetch existing task if editing
    if (id) {
      setLoading(true);
      API.get(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setForm({
            task_name: res.data.task_name,
            worker_id: res.data.worker_id,
            field_id: res.data.field_id,
            planting_id: res.data.planting_id || "",
            task_date: res.data.task_date,
            status: res.data.status,
            notes: res.data.notes || ""
          });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load task data");
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
        await API.put(`/tasks/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await API.post("/tasks", form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate("/tasks");
    } catch (err) {
      console.error(err);
      setError("Failed to save task. Please try again.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/tasks");
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={titleStyle}>{id ? "Edit Task" : "Create New Task"}</h2>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Task Name *</label>
            <input
              name="task_name"
              placeholder="Enter task name"
              value={form.task_name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Worker *</label>
            <select
              name="worker_id"
              value={form.worker_id}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Worker</option>
              {workers.map(worker => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Field *</label>Farm Overview
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
                  {field.name}
                </option>
              ))}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Task Date *</label>
            <input
              name="task_date"
              type="date"
              value={form.task_date}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Notes</label>
            <textarea
              name="notes"
              placeholder="Enter task notes"
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
