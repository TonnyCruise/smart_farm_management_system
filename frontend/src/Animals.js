import { useEffect, useState } from "react";
import API from "./api";

function Animals({ token }) {
  const [animals, setAnimals] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    animal_tag: "",
    species: "",
    breed: "",
    gender: "",
    birth_date: "",
    health_status: "Healthy"
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

  const handleAdd = () => {
    if (!form.animal_tag || !form.species || !form.gender || !form.birth_date) {
      setError("Please fill in all required fields");
      return;
    }
    
    API.post("/animals", form, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        fetchAnimals();
        setForm({ animal_tag: "", species: "", breed: "", gender: "", birth_date: "", health_status: "Healthy" });
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

  useEffect(() => {
    fetchAnimals();
  }, [token]);

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

  const deleteButtonStyle = {
    padding: "5px 10px",
    marginRight: "5px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  };

  const editButtonStyle = {
    padding: "5px 10px",
    backgroundColor: "#007bff",
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
      <h1>Animals</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ 
        padding: "20px", 
        border: "1px solid #ddd", 
        borderRadius: "8px",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9"
      }}>
        <h3>{editingId ? "Edit Animal" : "Add New Animal"}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
          <input 
            placeholder="Animal Tag *" 
            value={form.animal_tag}
            onChange={(e) => setForm({...form, animal_tag: e.target.value})}
            style={inputStyle}
          />
          <input 
            placeholder="Species *" 
            value={form.species}
            onChange={(e) => setForm({...form, species: e.target.value})}
            style={inputStyle}
          />
          <input 
            placeholder="Breed" 
            value={form.breed}
            onChange={(e) => setForm({...form, breed: e.target.value})}
            style={inputStyle}
          />
          <select
            value={form.gender}
            onChange={(e) => setForm({...form, gender: e.target.value})}
            style={inputStyle}
          >
            <option value="">Select Gender *</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input 
            type="date"
            placeholder="Birth Date *" 
            value={form.birth_date}
            onChange={(e) => setForm({...form, birth_date: e.target.value})}
            style={inputStyle}
          />
          <select
            value={form.health_status}
            onChange={(e) => setForm({...form, health_status: e.target.value})}
            style={inputStyle}
          >
            <option value="Healthy">Healthy</option>
            <option value="Sick">Sick</option>
            <option value="Under Treatment">Under Treatment</option>
          </select>
          {editingId ? (
            <>
              <button onClick={handleUpdate} style={buttonStyle}>Update</button>
              <button onClick={handleCancel} style={cancelButtonStyle}>Cancel</button>
            </>
          ) : (
            <button onClick={handleAdd} style={buttonStyle}>Add Animal</button>
          )}
        </div>
      </div>

      {animals.length === 0 ? (
        <p>No animals found. Please add some animals first.</p>
      ) : (
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
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
          {animals.map(animal => (
            <tr key={animal.id}>
              <td>{animal.id}</td>
              <td>{animal.animal_tag}</td>
              <td>{animal.species}</td>
              <td>{animal.breed}</td>
              <td>{animal.gender}</td>
              <td>{animal.birth_date}</td>
              <td>{animal.health_status}</td>
              <td>
                <button 
                  onClick={() => handleEdit(animal)}
                  style={editButtonStyle}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(animal.id)}
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

export default Animals;