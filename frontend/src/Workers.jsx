import { useEffect, useState } from "react";
import API from "./api";

function Workers({ token }) {
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    hire_date: ""
  });
  const [editingId, setEditingId] = useState(null);

  const fetchWorkers = async () => {
    try {
      const res = await API.get("/workers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkers(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load workers");
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [token]);

  const handleAdd = async () => {
    if (!form.name || !form.role) {
      setError("Please fill in required fields");
      return;
    }
    try {
      await API.post("/workers", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWorkers();
      setForm({ name: "", role: "", phone: "", email: "", hire_date: "" });
      setError(null);
    } catch (err) {
      setError("Failed to add worker");
    }
  };

  const handleEdit = (worker) => {
    setEditingId(worker.id);
    setForm({
      name: worker.name,
      role: worker.role,
      phone: worker.phone || "",
      email: worker.email || "",
      hire_date: worker.hire_date || ""
    });
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/workers/${editingId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWorkers();
      setEditingId(null);
      setForm({ name: "", role: "", phone: "", email: "", hire_date: "" });
      setError(null);
    } catch (err) {
      setError("Failed to update worker");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", role: "", phone: "", email: "", hire_date: "" });
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this worker?")) return;
    try {
      await API.delete(`/workers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWorkers();
    } catch (err) {
      setError("Failed to delete worker");
    }
  };

  const inputStyle = {
    padding: "8px",
    margin: "5px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    width: "150px"
  };

  const buttonStyle = {
    padding: "8px 16px",
    margin: "5px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  };

  const editButtonStyle = {
    padding: "5px 10px",
    marginRight: "5px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  };

  const deleteButtonStyle = {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  };

  const cancelButtonStyle = {
    padding: "8px 16px",
    margin: "5px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  };

  return (
    <div>
      <h1>Workers</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ 
        padding: "20px", 
        border: "1px solid #ddd", 
        borderRadius: "8px",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9"
      }}>
        <h3>{editingId ? "Edit Worker" : "Add New Worker"}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
          <input 
            placeholder="Name *" 
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            style={inputStyle}
          />
          <input 
            placeholder="Role *" 
            value={form.role}
            onChange={(e) => setForm({...form, role: e.target.value})}
            style={inputStyle}
          />
          <input 
            placeholder="Phone" 
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
            style={inputStyle}
          />
          <input 
            type="email"
            placeholder="Email" 
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            style={inputStyle}
          />
          <input 
            type="date"
            placeholder="Hire Date" 
            value={form.hire_date}
            onChange={(e) => setForm({...form, hire_date: e.target.value})}
            style={inputStyle}
          />
          {editingId ? (
            <>
              <button onClick={handleUpdate} style={buttonStyle}>Update</button>
              <button onClick={handleCancel} style={cancelButtonStyle}>Cancel</button>
            </>
          ) : (
            <button onClick={handleAdd} style={buttonStyle}>Add Worker</button>
          )}
        </div>
      </div>

      {workers.length === 0 ? (
        <p>No workers found. Please add some workers first.</p>
      ) : (
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Hire Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {workers.map(worker => (
            <tr key={worker.id}>
              <td>{worker.id}</td>
              <td>{worker.name}</td>
              <td>{worker.role}</td>
              <td>{worker.phone}</td>
              <td>{worker.email}</td>
              <td>{worker.hire_date}</td>
              <td>
                <button 
                  onClick={() => handleEdit(worker)}
                  style={editButtonStyle}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(worker.id)}
                  style={deleteButtonStyle}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
}

export default Workers;
