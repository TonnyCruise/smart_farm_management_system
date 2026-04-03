import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";
import { Plus, Pencil, Trash2, Search, MapPin, Maximize2, Waves } from "lucide-react";

function Fields({ token, canEdit }) {
  const [fields, setFields] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredFields = fields.filter(field =>
    field.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.soil_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Field Management</h1>
        {canEdit && (
          <Link to="/fields/create" className="btn btn-primary">
            <Plus size={18} />
            Add Field
          </Link>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Farm Fields</h3>
          <div style={{ position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            <input
              type="text"
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 40, width: 240 }}
            />
          </div>
        </div>

        {filteredFields.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><MapPin size={48} /></div>
            <h3>No fields found</h3>
            <p>Start by adding your first field to the registry</p>
            <Link to="/fields/create" className="btn btn-primary" style={{ marginTop: 16 }}>
              <Plus size={18} />
              Add Field
            </Link>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
            gap: 20 
          }}>
            {filteredFields.map(field => (
              <div key={field.id} style={fieldCardStyle}>
                <div style={fieldCardHeader}>
                  <div style={fieldIcon}>
                    <Waves size={24} color="white" />
                  </div>
                  <div>
                    <h3 style={fieldTitle}>{field.name}</h3>
                    <span style={fieldSizeBadge}>
                      <Maximize2 size={12} />
                      {field.size} acres
                    </span>
                  </div>
                </div>
                
                <div style={fieldCardBody}>
                  <div style={fieldInfoItem}>
                    <MapPin size={16} color="var(--text-secondary)" />
                    <span>{field.location || "No location"}</span>
                  </div>
                  <div style={fieldInfoItem}>
                    <Waves size={16} color="var(--text-secondary)" />
                    <span>{field.soil_type || "No soil type"}</span>
                  </div>
                </div>

                <div style={fieldCardFooter}>
                  {canEdit && (
                    <>
                      <Link to={`/fields/edit/${field.id}`} className="btn btn-secondary btn-sm">
                        <Pencil size={16} />
                        Edit
                      </Link>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(field.id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const fieldCardStyle = {
  background: "var(--bg-card)",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border)",
  overflow: "hidden",
  transition: "all 0.2s ease",
};

const fieldCardHeader = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: 20,
  background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
  color: "white",
};

const fieldIcon = {
  width: 48,
  height: 48,
  borderRadius: "var(--radius)",
  background: "rgba(255,255,255,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const fieldTitle = {
  fontSize: 18,
  fontWeight: 600,
  margin: "0 0 4px",
};

const fieldSizeBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 12,
  background: "rgba(255,255,255,0.2)",
  padding: "4px 10px",
  borderRadius: 20,
};

const fieldCardBody = {
  padding: 20,
};

const fieldInfoItem = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "var(--text-secondary)",
  fontSize: 14,
  marginBottom: 10,
};

const fieldCardFooter = {
  padding: "16px 20px",
  borderTop: "1px solid var(--border-light)",
  display: "flex",
  gap: 12,
};

export default Fields;
