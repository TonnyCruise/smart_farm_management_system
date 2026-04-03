import { useEffect, useState } from "react";
import API from "./api";
import { Plus, Pencil, Trash2, Search, Wrench } from "lucide-react";

function Equipment({ token, canEdit }) {
  const [equipment, setEquipment] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    name: "",
    type: "",
    purchase_date: "",
    status: "active"
  });

  const fetchEquipment = () => {
    API.get("/equipment", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setEquipment(res.data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load equipment. Please try again.");
      });
  };

  useEffect(() => {
    fetchEquipment();
  }, [token]);

  const handleAdd = () => {
    if (!form.name || !form.type || !form.status) {
      setError("Please fill in all required fields (Name, Type, Status)");
      return;
    }
    
    API.post("/equipment", form, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        fetchEquipment();
        setForm({ name: "", type: "", purchase_date: "", status: "active" });
        setError(null);
        setEditingId(null);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to add equipment. Please try again.");
      });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      type: item.type,
      purchase_date: item.purchase_date || "",
      status: item.status || "active"
    });
  };

  const handleUpdate = () => {
    if (!form.name || !form.type || !form.status) {
      setError("Please fill in all required fields (Name, Type, Status)");
      return;
    }

    API.put(`/equipment/${editingId}`, form, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        fetchEquipment();
        setEditingId(null);
        setForm({ name: "", type: "", purchase_date: "", status: "active" });
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to update equipment. Please try again.");
      });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", type: "", purchase_date: "", status: "active" });
    setError(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;
    
    API.delete(`/equipment/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => fetchEquipment())
      .catch(err => {
        console.error(err);
        setError("Failed to delete equipment. Please try again.");
      });
  };

  const filteredEquipment = equipment.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "active": return "badge-success";
      case "retired": return "badge-danger";
      case "maintenance": return "badge-warning";
      default: return "badge-info";
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Equipment Management</h1>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => setEditingId("new")}>
            <Plus size={18} />
            Add Equipment
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Machinery & Tools</h3>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 40, width: 240 }}
              />
            </div>
          </div>
        </div>

        {(editingId === "new" || editingId) && (
          <div style={{ 
            padding: 20, 
            background: "var(--bg-main)", 
            borderRadius: "var(--radius)",
            marginBottom: 20 
          }}>
            <h4 style={{ marginBottom: 16, fontWeight: 600 }}>
              {editingId && editingId !== "new" ? "Edit Equipment" : "Add New Equipment"}
            </h4>
            <div className="form-row">
              <div className="input-group">
                <label className="input-label">Name *</label>
                <input
                  className="input-field"
                  placeholder="e.g., John Deere Tractor 5000"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Type *</label>
                <input
                  className="input-field"
                  placeholder="e.g., Tractor"
                  value={form.type}
                  onChange={(e) => setForm({...form, type: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Purchase Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.purchase_date}
                  onChange={(e) => setForm({...form, purchase_date: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Status *</label>
                <select
                  className="input-field"
                  value={form.status}
                  onChange={(e) => setForm({...form, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: 8 }}>
              {editingId && editingId !== "new" ? (
                <>
                  <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
                  <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                </>
              ) : (
                <button className="btn btn-primary" onClick={handleAdd}>Add Equipment</button>
              )}
            </div>
          </div>
        )}

        {filteredEquipment.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Wrench size={48} /></div>
            <h3>No equipment found</h3>
            <p>Start by adding your farm machinery and tools.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Purchase Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td>{item.type}</td>
                    <td>{item.purchase_date || "-"}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {canEdit ? (
                        <div className="action-buttons">
                          <button 
                            className="btn btn-secondary btn-sm btn-icon"
                            onClick={() => handleEdit(item)}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            className="btn btn-danger btn-sm btn-icon"
                            onClick={() => handleDelete(item.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>View only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Equipment;
