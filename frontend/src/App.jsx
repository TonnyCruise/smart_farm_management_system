import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleSetToken = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) return <Login setToken={handleSetToken} />;

  return (
    <Router>
      <div style={containerStyle}>
        <Sidebar />

        <div style={mainContentStyle}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard token={token} handleLogout={handleLogout} />} />
            <Route path="/animals" element={<Animals token={token}/>} />
            
            {/* Fields */}
            <Route path="/fields" element={<Fields token={token} />} />
            <Route path="/fields/create" element={<FieldForm />} />
            <Route path="/fields/edit/:id" element={<FieldForm />} />
            
            {/* Crops */}
            <Route path="/crops" element={<Crops token={token} />} />
            <Route path="/crops/create" element={<CropForm />} />
            <Route path="/crops/edit/:id" element={<CropForm />} />
            
            {/* Plantings */}
            <Route path="/plantings" element={<Plantings token={token} />} />
            <Route path="/plantings/create" element={<PlantingForm />} />
            <Route path="/plantings/edit/:id" element={<PlantingForm />} />
            
            {/* Harvests */}
            <Route path="/harvests" element={<Harvests token={token} />} />
            <Route path="/harvests/create" element={<HarvestForm />} />
            <Route path="/harvests/edit/:id" element={<HarvestForm />} />
            
            {/* Inputs */}
            <Route path="/inputs" element={<Inputs token={token} />} />
            <Route path="/inputs/create" element={<InputForm />} />
            <Route path="/inputs/edit/:id" element={<InputForm />} />
            
            {/* Inventories */}
            <Route path="/inventories" element={<Inventories token={token} />} />
            <Route path="/inventories/create" element={<InventoryForm />} />
            <Route path="/inventories/edit/:id" element={<InventoryForm />} />
            
            {/* Tasks */}
            <Route path="/tasks" element={<Tasks token={token} />} />
            <Route path="/tasks/create" element={<TaskForm />} />
            <Route path="/tasks/edit/:id" element={<TaskForm />} />
            
            {/* Workers */}
            <Route path="/workers" element={<Workers token={token} />} />
            
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const containerStyle = {
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "#f5f5f5"
};

const mainContentStyle = {
  flex: 1,
  padding: "20px",
  overflowY: "auto"
};

export default App;
