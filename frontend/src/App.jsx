import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import API from "./api";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Sidebar from "./Sidebar";
import Animals from "./Animals";
import Fields from "./Fields";
import FieldForm from "./FieldForm";
import Crops from "./Crops";
import CropForm from "./CropForm";
import Tasks from "./Tasks";
import TaskForm from "./TaskForm";
import Inputs from "./Inputs";
import InputForm from "./InputForm";
import Inventories from "./Inventories";
import InventoryForm from "./InventoryForm";
import Plantings from "./Plantings";
import PlantingForm from "./PlantingForm";
import Harvests from "./Harvests";
import HarvestForm from "./HarvestForm";
import Workers from "./Workers";
import Equipment from "./Equipment";
import Finances from "./Finances";
import Storefront from "./Storefront";
import StaffDashboard from "./StaffDashboard";
import Mailbox from "./Mailbox";
import Register from "./Register";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workerCategory, setWorkerCategory] = useState(localStorage.getItem("workerCategory"));

  useEffect(() => {
    if (token) {
      API.get("/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleSetToken = (t, userData) => {
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(t);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("workerCategory");
    setToken(null);
    setUser(null);
    setWorkerCategory(null);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!token) {
    return (
      <Routes>
        <Route path="/register" element={<Register setToken={handleSetToken} />} />
        <Route path="*" element={<Login setToken={handleSetToken} />} />
      </Routes>
    );
  }

  const isCustomer = user?.role === "customer";
  const isWorker = user?.role === "worker";
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";

  const handleCategorySelect = (cat) => {
    localStorage.setItem("workerCategory", cat);
    setWorkerCategory(cat);
  };

  if (isCustomer) {
    return <Storefront token={token} user={user} onLogout={handleLogout} />;
  }

  if (isWorker && !workerCategory) {
    return (
      <div style={{ padding: "80px 40px", textAlign: "center", background: "#f1f5f9", minHeight: "100vh" }}>
        <h2 style={{ fontSize: 32, color: "#1e293b", marginBottom: 32 }}>Select Your Department for Today</h2>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginBottom: 40 }}>
          {["Sheep", "Cattle", "Fish", "Crops"].map(cat => (
             <button key={cat} onClick={() => handleCategorySelect(cat)} style={{ padding: "20px 40px", fontSize: 24, borderRadius: 16, background: "white", border: "2px solid #e2e8f0", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
               <span style={{ fontSize: 48 }}>{cat === "Sheep" ? "🐑" : cat === "Cattle" ? "🐄" : cat === "Fish" ? "🐟" : "🌾"}</span>
               <span style={{ fontWeight: 600, color: "#334155" }}>{cat}</span>
             </button>
          ))}
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <>
      <div className="app-layout">
        <Sidebar onLogout={handleLogout} user={user} />
        
        <div className="main-content">
          <Routes>
            {isWorker ? (
               <Route path="/dashboard" element={<StaffDashboard token={token} category={workerCategory} user={user} onSwitchCategory={() => handleCategorySelect(null)} />} />
            ) : (
               <Route path="/dashboard" element={<Dashboard token={token} handleLogout={handleLogout} />} />
            )}
            <Route path="/animals" element={<Animals token={token} canEdit={isAdmin || isManager} />} />
            
            <Route path="/fields" element={<Fields token={token} canEdit={isAdmin || isManager} />} />
            <Route path="/fields/create" element={isAdmin || isManager ? <FieldForm /> : <Navigate to="/fields" />} />
            <Route path="/fields/edit/:id" element={isAdmin || isManager ? <FieldForm /> : <Navigate to="/fields" />} />
            
            <Route path="/crops" element={<Crops token={token} canEdit={isAdmin || isManager} />} />
            <Route path="/crops/create" element={isAdmin || isManager ? <CropForm /> : <Navigate to="/crops" />} />
            <Route path="/crops/edit/:id" element={isAdmin || isManager ? <CropForm /> : <Navigate to="/crops" />} />
            
            <Route path="/plantings" element={<Plantings token={token} canEdit={isAdmin || isManager} />} />
            <Route path="/plantings/create" element={isAdmin || isManager ? <PlantingForm /> : <Navigate to="/plantings" />} />
            <Route path="/plantings/edit/:id" element={isAdmin || isManager ? <PlantingForm /> : <Navigate to="/plantings" />} />
            
            <Route path="/harvests" element={<Harvests token={token} canEdit={isAdmin || isManager} />} />
            <Route path="/harvests/create" element={isAdmin || isManager ? <HarvestForm /> : <Navigate to="/harvests" />} />
            <Route path="/harvests/edit/:id" element={isAdmin || isManager ? <HarvestForm /> : <Navigate to="/harvests" />} />
            
            <Route path="/inputs" element={<Inputs token={token} canEdit={isAdmin || isManager} />} />
            <Route path="/inputs/create" element={isAdmin || isManager ? <InputForm /> : <Navigate to="/inputs" />} />
            <Route path="/inputs/edit/:id" element={isAdmin || isManager ? <InputForm /> : <Navigate to="/inputs" />} />
            
            <Route path="/inventories" element={<Inventories token={token} canEdit={isAdmin || isManager} />} />
            <Route path="/inventories/create" element={isAdmin || isManager ? <InventoryForm /> : <Navigate to="/inventories" />} />
            <Route path="/inventories/edit/:id" element={isAdmin || isManager ? <InventoryForm /> : <Navigate to="/inventories" />} />
            
            <Route path="/tasks" element={<Tasks token={token} canEdit={isAdmin || isManager} />} />
            <Route path="/tasks/create" element={<TaskForm />} />
            <Route path="/tasks/edit/:id" element={isAdmin || isManager ? <TaskForm /> : <Navigate to="/tasks" />} />
            
            <Route path="/equipment" element={<Equipment token={token} canEdit={isAdmin || isManager} />} />
            <Route path="/finances" element={isAdmin || isManager ? <Finances token={token} canEdit={isAdmin || isManager} /> : <Navigate to="/dashboard" />} />
            <Route path="/mailbox" element={<Mailbox token={token} user={user} />} />
            <Route path="/workers" element={isAdmin || isManager ? <Workers token={token} /> : <Navigate to="/dashboard" />} />
            
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
