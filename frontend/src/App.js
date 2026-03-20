import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Sidebar from "./Sidebar";
import Animals from "./Animals";
import Fields from "./Fields";
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
      <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard token={token} handleLogout={handleLogout} />} />
            <Route path="/animals" element={<Animals token={token}/>} />
            <Route path="/fields" element={<Fields />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
