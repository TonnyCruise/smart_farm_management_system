import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "./api";

export default function Tasks({ token, canEdit }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await API.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks");
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffc107",
      in_progress: "#17a2b8",
      completed: "#28a745"
    };
    return colors[status?.toLowerCase().replace(" ", "_")] || "#6c757d";
  };

  return (
    <div>
      <div style={headerStyle}>
        <h1>Tasks</h1>
        <Link to="/tasks/create" style={addButtonStyle}>
          + Add New Task
        </Link>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {tasks.length === 0 ? (
        <div style={emptyStateStyle}>
          <p>No tasks found. Create your first task to get started.</p>
          <Link to="/tasks/create" style={addButtonStyle}>
            + Add New Task
          </Link>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Task Name</th>
                <th style={thStyle}>Worker</th>
                <th style={thStyle}>Field</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} style={trStyle}>
                  <td style={tdStyle}>{task.id}</td>
                  <td style={tdStyle}>{task.task_name}</td>
                  <td style={tdStyle}>{task.worker?.name || "N/A"}</td>
                  <td style={tdStyle}>{task.field?.name || "N/A"}</td>
                  <td style={tdStyle}>{task.task_date}</td>
                  <td style={tdStyle}>
                    <span style={{
                      ...badgeStyle, 
                      backgroundColor: getStatusColor(task.status)
                    }}>
                      {task.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <Link to={`/tasks/edit/${task.id}`} style={editLinkStyle}>
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(task.id)}
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
};

const addButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#28a745",
  color: "white",
  textDecoration: "none",
  borderRadius: "5px",
  fontWeight: "bold"
};

const errorStyle = {
  padding: "10px",
  backgroundColor: "#f8d7da",
  color: "#721c24",
  borderRadius: "5px",
  marginBottom: "15px"
};

const emptyStateStyle = {
  textAlign: "center",
  padding: "40px",
  backgroundColor: "#f9f9f9",
  borderRadius: "10px"
};

const tableContainerStyle = {
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  overflow: "hidden"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

const thStyle = {
  padding: "15px",
  textAlign: "left",
  backgroundColor: "#2c3e50",
  color: "white",
  fontWeight: "600"
};

const trStyle = {
  borderBottom: "1px solid #eee"
};

const tdStyle = {
  padding: "15px"
};

const badgeStyle = {
  padding: "5px 10px",
  borderRadius: "15px",
  fontSize: "12px",
  color: "white"
};

const editLinkStyle = {
  padding: "5px 15px",
  backgroundColor: "#007bff",
  color: "white",
  textDecoration: "none",
  borderRadius: "4px",
  marginRight: "5px"
};

const deleteButtonStyle = {
  padding: "5px 10px",
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};
