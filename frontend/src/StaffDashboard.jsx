import { useEffect, useState } from "react";
import API from "./api";

export default function StaffDashboard({ token, category, user, onSwitchCategory }) {
  const [orders, setOrders] = useState([]);
  
  const fetchOrders = () => {
     API.get("/orders", { headers: { Authorization: `Bearer ${token}` } })
       .then(res => {
         // Filter for only this category orders
         const relevant = res.data.filter(o => o.items.some(i => i.category === category));
         setOrders(relevant);
       });
  }

  useEffect(() => {
    fetchOrders();
  }, [category, token]);

  const updateStatus = async (id, status) => {
    await API.put(`/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    fetchOrders(); // Refresh
  }

  const pending = orders.filter(o => o.status === 'confirmed');
  const completed = orders.filter(o => o.status === 'completed');

  return (
    <div style={{ background: "#d1fae5", minHeight: "100%", padding: 20 }}>
       <div style={{ background: "linear-gradient(90deg, #166534 0%, #15803d 100%)", borderRadius: 12, padding: "32px 40px", color: "white", marginBottom: 24, boxShadow: "0 10px 15px -3px rgba(22, 101, 52, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
         <h1 style={{ margin: 0, fontSize: 28 }}>Welcome, {user.name} - {category} Manager</h1>
         <button onClick={onSwitchCategory} style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}>Switch Department</button>
       </div>

       <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 }}>
          <div className="stat-card" style={{ background: "#f0fdf4" }}>
            <h3 style={{ color: "#166534", margin: "0 0 8px 0", fontSize: 16 }}>Pending Orders</h3>
            <div style={{ fontSize: 36, fontWeight: 700, color: "#16a34a" }}>{pending.length}</div>
          </div>
          <div className="stat-card" style={{ background: "#f8fafc" }}>
            <h3 style={{ color: "#475569", margin: "0 0 8px 0", fontSize: 16 }}>Orders Completed</h3>
            <div style={{ fontSize: 36, fontWeight: 700, color: "#1e293b" }}>{completed.length}</div>
          </div>
          <div className="stat-card" style={{ background: "#fff7ed" }}>
            <h3 style={{ color: "#9a3412", margin: "0 0 8px 0", fontSize: 16 }}>Stock Status</h3>
            <div style={{ fontSize: 36, fontWeight: 700, color: "#ea580c" }}>150</div>
          </div>
       </div>

       <div className="card" style={{ padding: 24, background: "white", borderTop: "4px solid #16a34a" }}>
         <h2 style={{ marginTop: 0, marginBottom: 20, borderBottom: "2px solid #e2e8f0", paddingBottom: 12, color: "#166534" }}>{category} Order List</h2>
         {orders.length === 0 ? <p style={{ color: "#64748b" }}>No orders assigned to {category}.</p> : (
           <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
             <thead>
               <tr style={{ background: "#bbf7d0" }}>
                 <th style={{ padding: 12, color: "#166534" }}>Order ID</th>
                 <th style={{ padding: 12, color: "#166534" }}>Customer</th>
                 <th style={{ padding: 12, color: "#166534" }}>Quantity</th>
                 <th style={{ padding: 12, color: "#166534" }}>Status</th>
               </tr>
             </thead>
             <tbody>
               {orders.map(o => {
                  const item = o.items.find(i => i.category === category);
                  return (
                    <tr key={o.id}>
                      <td style={{ padding: 16, borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#334155" }}>Order #{o.id}</td>
                      <td style={{ padding: 16, borderBottom: "1px solid #e2e8f0" }}>{o.user?.name || "Customer"}</td>
                      <td style={{ padding: 16, borderBottom: "1px solid #e2e8f0", fontWeight: 500 }}>- {item ? item.quantity : '-'} {category}</td>
                      <td style={{ padding: 16, borderBottom: "1px solid #e2e8f0" }}>
                        {o.status === 'confirmed' && <button className="btn btn-primary" style={{ padding: "6px 12px", background: "#166534", border: "none" }} onClick={() => updateStatus(o.id, 'completed')}>Mark Completed {'>'}</button>}
                        {o.status === 'completed' && <span style={{ color: "#16a34a", fontWeight: "bold", display: "inline-block", padding: "6px 12px", background: "#dcfce7", borderRadius: 4 }}>Completed</span>}
                        {o.status === 'pending' && <span style={{ color: "#64748b", fontWeight: 500 }}>Awaiting Admin</span>}
                      </td>
                    </tr>
                  )
               })}
             </tbody>
           </table>
         )}
       </div>

       <div className="card" style={{ padding: 24, marginTop: 24, background: "white", borderTop: "4px solid #16a34a" }}>
         <h2 style={{ marginTop: 0, marginBottom: 20, borderBottom: "2px solid #e2e8f0", paddingBottom: 12, color: "#166534" }}>Inventory Management</h2>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f0fdf4", padding: 20, borderRadius: 8, border: "1px solid #bbf7d0" }}>
            <span style={{ fontSize: 18, color: "#166534" }}>Current Stock: <strong style={{ fontSize: 24 }}>150</strong> {category}</span>
            <div style={{ display: "flex", gap: 12 }}>
               <button className="btn btn-primary" style={{ background: "#166534", border: "none" }}>Update Stock {'>'}</button>
               <button className="btn btn-danger" style={{ background: "#c2410c", border: "none" }}>Low Stock Alerts {'>'}</button>
            </div>
         </div>
       </div>

    </div>
  );
}
