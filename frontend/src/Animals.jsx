import { useEffect, useState } from "react";
import API from "./api";
import { Plus, Pencil, Trash2, Search, Filter, Beef } from "lucide-react";

function Animals({ token, canEdit }) {
  const [animals, setAnimals] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    animal_tag: "",
    species: "",
    breed: "",
    gender: "",
    birth_date: "",
    health_status: "Healthy",
    quantity: 1
  });

  const fetchAnimals = () => {
    API.get("/animals", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setAnimals(res.data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load animals. Please try again.");
      });
  };

  useEffect(() => {
    fetchAnimals();
  }, [token]);

  const handleAdd = () => {
    if (!form.species || !form.gender || !form.birth_date) {
      setError("Please fill in all required fields (Animal Tag is optional)");
      return;
    }
    
    API.post("/animals", form, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        fetchAnimals();
        setForm({ animal_tag: "", species: "", breed: "", gender: "", birth_date: "", health_status: "Healthy", quantity: 1 });
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to add animal. Please try again.");
      });
  };

  const handleEdit = (animal) => {
    setEditingId(animal.id);
    setForm({
      animal_tag: animal.animal_tag,
      species: animal.species,
      breed: animal.breed || "",
      gender: animal.gender,
      birth_date: animal.birth_date,
      health_status: animal.health_status || "Healthy"
    });
  };

  const handleUpdate = () => {
    if (!form.animal_tag || !form.species || !form.gender || !form.birth_date) {
      setError("Please fill in all required fields");
      return;
    }

    API.put(`/animals/${editingId}`, form, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        fetchAnimals();
        setEditingId(null);
        setForm({ animal_tag: "", species: "", breed: "", gender: "", birth_date: "", health_status: "Healthy" });
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to update animal. Please try again.");
      });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ animal_tag: "", species: "", breed: "", gender: "", birth_date: "", health_status: "Healthy" });
    setError(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this animal?")) return;
    
    API.delete(`/animals/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => fetchAnimals())
      .catch(err => {
        console.error(err);
        setError("Failed to delete animal. Please try again.");
      });
  };

  const filteredAnimals = animals.filter(animal =>
    animal.animal_tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.breed?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getHealthBadgeClass = (status) => {
    switch(status) {
      case "Healthy": return "badge-success";
      case "Sick": return "badge-danger";
      case "Under Treatment": return "badge-warning";
      default: return "badge-info";
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Livestock Management</h1>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => setEditingId("new")}>
            <Plus size={18} />
            Add Animal
          </button>
        )}
      </div>

      {/* Interjected High-Level Analytics Banner */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 24 }}>
          <div style={{ background: "white", padding: "20px 24px", borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: "0 0 4px 0", color: "#475569", fontWeight: 600 }}>Sheep Enclosures</p>
              <h2 style={{ margin: 0, color: "#16a34a", fontSize: 28 }}>{animals.filter(a => a.species.toLowerCase().includes('sheep')).length}</h2>
            </div>
            <span style={{ fontSize: 42 }}>🐑</span>
          </div>
          <div style={{ background: "white", padding: "20px 24px", borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: "0 0 4px 0", color: "#475569", fontWeight: 600 }}>Cattle Enclosures</p>
              <h2 style={{ margin: 0, color: "#16a34a", fontSize: 28 }}>{animals.filter(a => a.species.toLowerCase().includes('cattle') || a.species.toLowerCase().includes('cow')).length}</h2>
            </div>
            <span style={{ fontSize: 42 }}>🐄</span>
          </div>
          <div style={{ background: "white", padding: "20px 24px", borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: "0 0 4px 0", color: "#475569", fontWeight: 600 }}>Aquaculture Tanks</p>
              <h2 style={{ margin: 0, color: "#16a34a", fontSize: 28 }}>{animals.filter(a => a.species.toLowerCase().includes('fish')).length}</h2>
            </div>
            <span style={{ fontSize: 42 }}>🐟</span>
          </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Animals Registry</h3>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <input
                type="text"
                placeholder="Search animals..."
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
              {editingId && editingId !== "new" ? "Edit Animal" : "Add New Animal"}
            </h4>
            <div className="form-row">
              <div className="input-group">
                <label className="input-label">Animal Tag (Optional)</label>
                <input
                  className="input-field"
                  placeholder="Auto-generated if blank"
                  value={form.animal_tag}
                  onChange={(e) => setForm({...form, animal_tag: e.target.value})}
                  disabled={form.quantity > 1}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Bulk Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="15000"
                  className="input-field"
                  value={form.quantity}
                  onChange={(e) => setForm({...form, quantity: parseInt(e.target.value) || 1})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Species *</label>
                <select
                  className="input-field"
                  value={form.species}
                  onChange={(e) => setForm({...form, species: e.target.value, breed: ""})}
                >
                  <option value="">Select Species</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Cattle">Cattle</option>
                  <option value="Fish">Fish</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Breed</label>
                <select
                  className="input-field"
                  value={form.breed}
                  onChange={(e) => setForm({...form, breed: e.target.value})}
                  disabled={!form.species}
                >
                  <option value="">Select Breed</option>
                  {(form.species === "Sheep" ? ["Merino", "Dorper", "Suffolk", "Dorset", "Other"] : 
                    form.species === "Cattle" ? ["Holstein", "Friesian", "Angus", "Hereford", "Jersey", "Other"] : 
                    form.species === "Fish" ? ["Tilapia", "Catfish", "Salmon", "Trout", "Other"] : 
                    ["Other"]).map(b => (
                      <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Gender *</label>
                <select
                  className="input-field"
                  value={form.gender}
                  onChange={(e) => setForm({...form, gender: e.target.value})}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Birth Date *</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.birth_date}
                  onChange={(e) => setForm({...form, birth_date: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Health Status</label>
                <select
                  className="input-field"
                  value={form.health_status}
                  onChange={(e) => setForm({...form, health_status: e.target.value})}
                >
                  <option value="Healthy">Healthy</option>
                  <option value="Sick">Sick</option>
                  <option value="Under Treatment">Under Treatment</option>
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
                <button className="btn btn-primary" onClick={handleAdd}>Add Animal</button>
              )}
            </div>
          </div>
        )}

        {filteredAnimals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Beef size={48} /></div>
            <h3>No animals found</h3>
            <p>Start by adding your first animal to the registry</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tag</th>
                  <th>Species</th>
                  <th>Breed</th>
                  <th>Gender</th>
                  <th>Birth Date</th>
                  <th>Health Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnimals.map(animal => (
                  <tr key={animal.id}>
                    <td style={{ fontWeight: 500 }}>{animal.animal_tag}</td>
                    <td>{animal.species}</td>
                    <td>{animal.breed || "-"}</td>
                    <td>{animal.gender}</td>
                    <td>{animal.birth_date}</td>
                    <td>
                      <span className={`badge ${getHealthBadgeClass(animal.health_status)}`}>
                        {animal.health_status}
                      </span>
                    </td>
                    <td>
                      {canEdit ? (
                        <div className="action-buttons">
                          <button 
                            className="btn btn-secondary btn-sm btn-icon"
                            onClick={() => handleEdit(animal)}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            className="btn btn-danger btn-sm btn-icon"
                            onClick={() => handleDelete(animal.id)}
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

export default Animals;
