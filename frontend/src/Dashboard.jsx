import { useEffect, useState } from "react";
import API from "./api";
import WeatherWidget from "./WeatherWidget";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Check, Mail as MailIcon, AlertTriangle, Users, Box, X } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

function Dashboard({ token, handleLogout }) {
  const [profit, setProfit] = useState(12540);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [staff, setStaff] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Modal State
  const [activeModal, setActiveModal] = useState(null); // 'message', 'orders', 'stock', 'add_staff', 'staff_tasks'
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockInput, setStockInput] = useState({}); // tracking quantities per ID
  const [workerForm, setWorkerForm] = useState({ name: "", role: "", phone: "" });

  useEffect(() => {
    API.get("/orders", { headers: { Authorization: `Bearer ${token}` } }).then(res => setOrders(res.data));
    API.get("/messages", { headers: { Authorization: `Bearer ${token}` } }).then(res => setMessages(res.data));
    API.get("/inventories", { headers: { Authorization: `Bearer ${token}` } }).then(res => setInventories(res.data));
    API.get("/workers", { headers: { Authorization: `Bearer ${token}` } }).then(res => setStaff(res.data));
    API.get("/tasks", { headers: { Authorization: `Bearer ${token}` } }).then(res => setTasks(res.data));
  }, [token]);

  const confirmOrder = async (id) => {
    await API.put(`/orders/${id}/status`, { status: "confirmed" }, { headers: { Authorization: `Bearer ${token}` } });
    API.get("/orders", { headers: { Authorization: `Bearer ${token}` } }).then(res => setOrders(res.data));
  };

  const updateInventoryStock = async (id) => {
    const qty = stockInput[id];
    if (!qty) return;
    await API.put(`/inventories/${id}`, { quantity_available: qty }, { headers: { Authorization: `Bearer ${token}` } });
    API.get("/inventories", { headers: { Authorization: `Bearer ${token}` } }).then(res => setInventories(res.data));
    setStockInput(prev => ({...prev, [id]: ""}));
  };

  const lineData = {
    labels: ['W1', 'W2', 'W3', 'W4'],
    datasets: [{
      label: 'Profits',
      data: [8000, 9500, 8500, 12540],
      borderColor: '#16a34a',
      backgroundColor: 'rgba(22, 163, 74, 0.2)',
      fill: true,
      tension: 0.4
    }]
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Sheep', data: [20, 30, 40, 30, 40, 50], backgroundColor: '#bbf7d0' },
      { label: 'Cattle', data: [15, 25, 20, 35, 45, 30], backgroundColor: '#86efac' },
      { label: 'Fish', data: [50, 40, 60, 55, 70, 80], backgroundColor: '#15803d' }
    ]
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  // Logic to simulate Low Stock if no backend data exists yet to keep demo looking good
  const lowStockItems = inventories.filter(i => i.quantity_available < 50);

  return (
    <div style={{ padding: "32px", background: "#f1f5f9", minHeight: "100vh", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 32, color: "#1e293b", fontWeight: 700 }}>Admin Dashboard</h1>
        <WeatherWidget />
      </div>

      {/* Modals */}
      {activeModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(4px)" }}>
           <div style={{ background: "white", padding: 32, borderRadius: 16, width: "100%", maxWidth: 640, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, borderBottom: "2px solid #f1f5f9", paddingBottom: 16 }}>
                <h2 style={{ margin: 0, color: "#1e293b" }}>
                  {activeModal === 'message' && "Message Details"}
                  {activeModal === 'orders' && "Confirm Pending Orders"}
                  {activeModal === 'stock' && "Low Stock Alert Management"}
                  {activeModal === 'add_staff' && "Register New Staff Member"}
                  {activeModal === 'staff_tasks' && selectedItem && `Tasks assigned to ${selectedItem.name}`}
                </h2>
                <X style={{ cursor: "pointer", color: "#64748b" }} onClick={() => setActiveModal(null)} />
             </div>

             {activeModal === 'message' && selectedItem && (
               <div>
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 13, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Subject</span>
                    <h3 style={{ margin: "4px 0 0 0", color: "#1e293b", fontSize: 20 }}>{selectedItem.subject}</h3>
                  </div>
                  <div style={{ background: "#f8fafc", padding: 20, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                    <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{selectedItem.body}</p>
                  </div>
               </div>
             )}

             {activeModal === 'orders' && (
               <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: "60vh", overflowY: "auto" }}>
                  {pendingOrders.length === 0 ? <p style={{ color: "#64748b" }}>No pending orders to confirm.</p> : pendingOrders.map(o => (
                     <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: 16, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                       <div>
                         <span style={{ fontWeight: 600, color: "#1e293b", display: "block" }}>Order #{o.id} - ${o.total_amount}</span>
                         <span style={{ color: "#64748b", fontSize: 14 }}>{o.items?.[0]?.quantity}x {o.items?.[0]?.category} ({o.user?.name || 'Customer'})</span>
                       </div>
                       <button className="btn btn-primary" onClick={() => confirmOrder(o.id)}>Authorize Request</button>
                     </div>
                  ))}
               </div>
             )}

             {activeModal === 'stock' && (
               <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: "60vh", overflowY: "auto" }}>
                  {lowStockItems.length === 0 ? <p style={{ color: "#16a34a", fontWeight: "bold" }}>All inventory streams are adequately supplied!</p> : lowStockItems.map(inv => (
                     <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff7ed", padding: 16, borderRadius: 12, border: "1px solid #ffedd5" }}>
                       <div>
                         <span style={{ fontWeight: 600, color: "#9a3412", display: "block" }}>{inv.input?.name || `Item #${inv.id}`}</span>
                         <span style={{ color: "#c2410c", fontSize: 14 }}>Current Stock: <strong style={{ fontSize: 16 }}>{inv.quantity_available}</strong></span>
                       </div>
                       <div style={{ display: "flex", gap: 8 }}>
                         <input type="number" placeholder="New Total..." value={stockInput[inv.id] || ""} onChange={e => setStockInput({...stockInput, [inv.id]: e.target.value})} style={{ width: 120, padding: "8px 12px", borderRadius: 8, border: "1px solid #fdba74" }} />
                         <button className="btn btn-primary" style={{ background: "#ea580c" }} onClick={() => updateInventoryStock(inv.id)}>Refill Stock</button>
                       </div>
                     </div>
                  ))}
               </div>
             )}

             {activeModal === 'add_staff' && (
               <div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                     <input placeholder="Full Name" value={workerForm.name} onChange={e => setWorkerForm({...workerForm, name: e.target.value})} style={{ width: "100%", padding: "12px 14px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 15 }} />
                     <input placeholder="Role Designation (e.g., Sheep Manager)" value={workerForm.role} onChange={e => setWorkerForm({...workerForm, role: e.target.value})} style={{ width: "100%", padding: "12px 14px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 15 }} />
                     <input placeholder="Phone Number" value={workerForm.phone} onChange={e => setWorkerForm({...workerForm, phone: e.target.value})} style={{ width: "100%", padding: "12px 14px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 15 }} />
                     <button className="btn btn-primary" style={{ padding: "14px", fontSize: 16 }} onClick={async () => {
                        await API.post("/workers", workerForm, { headers: { Authorization: `Bearer ${token}` } });
                        API.get("/workers", { headers: { Authorization: `Bearer ${token}` } }).then(res => setStaff(res.data));
                        setActiveModal(null);
                        setWorkerForm({name: "", role: "", phone: ""});
                     }}>Onboard Worker</button>
                  </div>
               </div>
             )}

             {activeModal === 'staff_tasks' && selectedItem && (
               <div style={{ maxHeight: "60vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
                  {tasks.filter(t => t.worker_id === selectedItem.id).length === 0 ? <p style={{ color: "#64748b" }}>There are no operations queued for this worker.</p> : tasks.filter(t => t.worker_id === selectedItem.id).map(t => (
                     <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: 16, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                       <div>
                         <span style={{ fontWeight: 600, color: "#1e293b", display: "block" }}>{t.task_name}</span>
                         <span style={{ color: "#64748b", fontSize: 14 }}>Field: {t.field?.name || 'Generic Location'} | Date Assigned: {t.task_date}</span>
                       </div>
                       <span style={{ 
                         background: t.status === 'completed' ? '#dcfce7' : t.status === 'in_progress' ? '#e0f2fe' : '#f1f5f9', 
                         color: t.status === 'completed' ? '#166534' : t.status === 'in_progress' ? '#0369a1' : '#475569', 
                         padding: "4px 12px", borderRadius: 20, fontWeight: "bold", fontSize: 12, border: "1px solid rgba(0,0,0,0.1)"
                       }}>{(t.status || 'pending').replace('_', ' ').toUpperCase()}</span>
                     </div>
                  ))}
               </div>
             )}
           </div>
        </div>
      )}

      {/* Grid Layouts Below */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gap: 24, marginBottom: 24 }}>
        <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
           <h3 style={{ margin: "0 0 16px 0", color: "#475569" }}>Total Profits</h3>
           <div style={{ fontSize: 42, fontWeight: 800, color: "#166534", textAlign: "center", marginBottom: 20 }}>${profit.toLocaleString()}</div>
           <div style={{ height: 120 }}><Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} /></div>
           <p style={{ textAlign: "center", margin: "12px 0 0 0", color: "#64748b", fontSize: 14 }}>Monthly Sales Report</p>
        </div>

        <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
           <h3 style={{ margin: "0 0 16px 0", color: "#475569" }}>Staff Management</h3>
           <button onClick={() => setActiveModal('add_staff')} style={{ width: "100%", padding: "12px", background: "#f8fafc", color: "#334155", borderRadius: 8, border: "2px dashed #cbd5e1", fontWeight: "bold", fontSize: 16, marginBottom: 16, cursor: "pointer", transition: "all 0.2s" }} className="hover-scale">+ Add Staff</button>
           <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 180, overflowY: "auto" }}>
              {staff.length === 0 ? <p style={{ color: "#94a3b8" }}>No staff configured yet.</p> : staff.map((s, idx) => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: idx !== staff.length - 1 ? "1px solid #f1f5f9" : "none", alignItems: "center" }}>
                  <div>
                    <span style={{ fontWeight: 500, color: "#1e293b", display: "block" }}>{s.name}</span>
                    <span style={{ fontSize: 13, color: "#64748b" }}>{s.role || "General Worker"}</span>
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ background: "#3b82f6", border: "none", padding: "6px 12px" }} onClick={() => { setActiveModal('staff_tasks'); setSelectedItem(s); }}>View Tasks</button>
                </div>
              ))}
           </div>
        </div>

        <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
           <h3 style={{ margin: "0 0 16px 0", color: "#475569" }}>Pending Orders</h3>
           <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              {pendingOrders.slice(0, 4).length === 0 ? <p style={{ color: "#94a3b8" }}>No pending orders.</p> : pendingOrders.slice(0, 4).map(o => (
                 <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
                   <Check size={18} color="#16a34a" />
                   <span style={{ fontWeight: 500, color: "#334155" }}>Order #{o.id} - {o.items?.[0]?.quantity} {o.items?.[0]?.category}</span>
                 </div>
              ))}
           </div>
           <button 
             style={{ width: "100%", padding: "14px", background: "#166534", color: "white", borderRadius: 8, border: "none", fontWeight: "bold", fontSize: 16, cursor: "pointer", marginTop: 16 }}
             onClick={() => setActiveModal('orders')}
           >
             Confirm Orders
           </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr", gap: 24, marginBottom: 24 }}>
        <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
           <h3 style={{ margin: "0 0 20px 0", color: "#475569", borderBottom: "1px solid #f1f5f9", paddingBottom: 16 }}>Sales Overview</h3>
           <div style={{ height: 260 }}><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} /></div>
           <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16, background: "#f8fafc", padding: "12px", borderRadius: 8 }}>
             <span style={{ fontWeight: "bold", color: "#475569" }}>🐑 Sheep</span><span style={{ fontWeight: "bold", color: "#475569" }}>🐄 Cattle</span><span style={{ fontWeight: "bold", color: "#475569" }}>🐟 Fish</span>
           </div>
        </div>

        <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
           <h3 style={{ margin: "0 0 20px 0", color: "#475569", borderBottom: "1px solid #f1f5f9", paddingBottom: 16 }}>Email Notifications</h3>
           <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {messages.slice(0, 4).map(m => (
                 <div key={m.id} onClick={() => { setActiveModal('message'); setSelectedItem(m); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", padding: "16px", borderRadius: 8, border: "1px solid #f1f5f9", cursor: "pointer", transition: "all 0.2s" }} className="hover-scale">
                   <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                     <MailIcon size={20} color="#64748b" />
                     <span style={{ color: "#334155", fontWeight: 500 }}>{m.subject.substring(0, 30)}{m.subject.length > 30 ? "..." : ""}</span>
                   </div>
                   <div style={{ background: "#166534", borderRadius: 4, padding: "4px 8px" }}><MailIcon size={14} color="white" /></div>
                 </div>
              ))}
              {messages.length === 0 && <p style={{ color: "#94a3b8" }}>No upcoming notifications.</p>}
           </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24 }}>
         <div onClick={() => setActiveModal('orders')} style={{ flex: 1, background: "white", padding: 20, borderRadius: 12, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 20, cursor: "pointer" }} className="hover-scale">
            <span style={{ fontSize: 48 }}>🐑</span>
            <div><p style={{ margin: "0 0 4px 0", color: "#475569", fontWeight: 600 }}>New Orders</p><h2 style={{ margin: 0, color: "#166534", fontSize: 28 }}>{pendingOrders.length}</h2></div>
         </div>
         <div onClick={() => setActiveModal('stock')} style={{ flex: 1, background: "white", padding: 20, borderRadius: 12, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 20, cursor: "pointer" }} className="hover-scale">
            <div style={{ background: "#f97316", padding: 12, borderRadius: "50%" }}><AlertTriangle size={32} color="white" /></div>
            <div>
               <p style={{ margin: "0 0 4px 0", color: "#475569", fontWeight: 600 }}>Out of Stock</p>
               <h2 style={{ margin: 0, color: "#c2410c", fontSize: 28 }}>{lowStockItems.length > 0 ? lowStockItems.length : 0} <span style={{ fontSize: 16, color: "#ea580c" }}>Items</span></h2>
            </div>
         </div>
         <div style={{ flex: 1, background: "white", padding: 20, borderRadius: 12, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 20 }}>
            <Users size={48} color="#94a3b8" />
            <div><p style={{ margin: "0 0 4px 0", color: "#475569", fontWeight: 600 }}>Total Customers</p><h2 style={{ margin: 0, color: "#0f172a", fontSize: 28 }}>321</h2></div>
         </div>
      </div>
    </div>
  );
}

export default Dashboard;
