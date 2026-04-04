import { useEffect, useState } from "react";
import API from "./api";
import { Mail, Calendar, LogOut, MessageCircle, Send, CheckCircle, X } from "lucide-react";

export default function Storefront({ token, user, onLogout }) {
  const [currentTab, setCurrentTab] = useState("home");
  
  // Shopping State
  const [selectedProduct, setSelectedProduct] = useState("Sheep");
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // My Orders State
  const [orders, setOrders] = useState([]);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactBody, setContactBody] = useState("");

  const products = [
    { name: "Sheep", price: 150, emoji: "🐑", color: "#f8fafc" },
    { name: "Cattle", price: 800, emoji: "🐄", color: "#fff7ed" },
    { name: "Fish", price: 5, emoji: "🐟", color: "#f0fdfa" }
  ];

  const fetchOrders = () => {
    API.get("/orders", { headers: { Authorization: `Bearer ${token}` } }).then(res => setOrders(res.data));
  };
  const fetchMessages = () => {
    API.get("/messages", { headers: { Authorization: `Bearer ${token}` } }).then(res => setChatMessages(res.data));
  };

  useEffect(() => {
    if (currentTab === "orders") fetchOrders();
    if (currentTab === "contact" || isChatOpen) fetchMessages();
  }, [currentTab, isChatOpen]);

  const handleOrder = async () => {
    if (!deliveryDate) return setError("Please select a delivery date.");
    const product = products.find(p => p.name === selectedProduct);
    try {
      await API.post("/orders", {
        total_amount: product.price * quantity,
        items: [{ category: selectedProduct, product_name: `Store ${selectedProduct}`, quantity, price: product.price }]
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess(true);
      setError(null);
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError("Failed to place order.");
    }
  };

  const handleSendMessage = async (isChat) => {
    const payload = isChat ? { subject: "Chat Inquiry", body: chatInput, receiver_id: null } : { subject: contactSubject, body: contactBody, receiver_id: null };
    if (!payload.body) return;
    await API.post("/messages", payload, { headers: { Authorization: `Bearer ${token}` } });
    if (isChat) { setChatInput(""); fetchMessages(); }
    else { setContactSubject(""); setContactBody(""); setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
  };

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px", position: "relative" }}>
      <div style={{ width: "100%", maxWidth: 1000, background: "white", borderRadius: 16, boxShadow: "0 10px 25px rgba(0,0,0,0.05)", overflow: "hidden", alignSelf: "flex-start" }}>
        
        {/* Navigation */}
        <div style={{ padding: "24px 32px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(90deg, #16a34a, #15803d)", color: "white" }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Farm Storefront</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 16, fontWeight: 600 }}>
            <span style={{ cursor: "pointer", opacity: currentTab === "home" ? 1 : 0.7 }} onClick={() => setCurrentTab("home")}>Home</span>
            <span style={{ cursor: "pointer", opacity: currentTab === "orders" ? 1 : 0.7 }} onClick={() => setCurrentTab("orders")}>My Orders</span>
            <span style={{ cursor: "pointer", opacity: currentTab === "contact" ? 1 : 0.7 }} onClick={() => setCurrentTab("contact")}>Contact Us</span>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span>{user?.name}</span>
              <button 
                onClick={onLogout} 
                style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "white", padding: "6px 16px", borderRadius: 20, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Content Router */}
        <div style={{ padding: 40 }}>
          
          {currentTab === "home" && (
            <div>
              <h2 style={{ textAlign: "center", marginBottom: 32, color: "#334155", fontSize: 32 }}>Place Your Order</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
                {products.map(p => (
                  <div key={p.name} onClick={() => setSelectedProduct(p.name)}
                    style={{ border: selectedProduct === p.name ? "2px solid #16a34a" : "1px solid #e2e8f0", borderRadius: 16, padding: 32, textAlign: "center", cursor: "pointer", background: p.color, transform: selectedProduct === p.name ? "scale(1.02)" : "none", transition: "all 0.2s", boxShadow: selectedProduct === p.name ? "0 10px 15px rgba(22,163,74,0.2)" : "none" }}
                  >
                    <div style={{ fontSize: 64, marginBottom: 16 }}>{p.emoji}</div>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: 24, color: "#1e293b" }}>{p.name}</h3>
                    <p style={{ margin: "0 0 16px 0", color: "#64748b", fontWeight: 600 }}>From ${p.price} each</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: 32 }}>
                <h3 style={{ margin: "0 0 24px 0", fontSize: 24 }}>Order Details</h3>
                {error && <div className="alert alert-danger" style={{ marginBottom: 16 }}>{error}</div>}
                {success && <div className="alert alert-success" style={{ marginBottom: 16 }}>Order Placed! Check the My Orders tab.</div>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, alignItems: "end" }}>
                  <div className="input-group" style={{ margin: 0 }}><label className="input-label">Quantity</label><input type="number" min="1" className="input-field" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /></div>
                  <div className="input-group" style={{ margin: 0 }}><label className="input-label">Delivery Date</label><input type="date" className="input-field" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} /></div>
                  <button className="btn btn-primary" onClick={handleOrder} style={{ padding: "14px", height: 46 }}>Buy ${products.find(p => p.name === selectedProduct)?.price * quantity}</button>
                </div>
              </div>
            </div>
          )}

          {currentTab === "orders" && (
            <div>
              <h2 style={{ marginBottom: 24, color: "#1e293b" }}>My Order History</h2>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#f1f5f9", textAlign: "left" }}><th style={{ padding: 16 }}>ID</th><th style={{ padding: 16 }}>Product</th><th style={{ padding: 16 }}>Cost</th><th style={{ padding: 16 }}>Status</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: 16, fontWeight: "bold" }}>#{o.id}</td>
                      <td style={{ padding: 16 }}>{o.items?.[0]?.quantity}x {o.items?.[0]?.category}</td>
                      <td style={{ padding: 16, fontWeight: "bold", color: "#16a34a" }}>${o.total_amount}</td>
                      <td style={{ padding: 16 }}>
                        {o.status === "completed" ? <span style={{ color: "#16a34a", fontWeight: "bold" }}><CheckCircle size={16} style={{ verticalAlign: "middle" }}/> Shipped</span> 
                        : o.status === 'confirmed' ? <span style={{ color: "#ca8a04", fontWeight: "bold" }}>Processing Phase</span> 
                        : "Pending Approval"}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan="4" style={{ padding: 24, textAlign: "center" }}>No orders placed yet.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {currentTab === "contact" && (
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
              <h2 style={{ marginBottom: 24, textAlign: "center" }}>Contact the Farm</h2>
              {success && <div className="alert alert-success" style={{ marginBottom: 16 }}>Message sent successfully!</div>}
              <div className="input-group">
                <label className="input-label">Subject</label>
                <input className="input-field" value={contactSubject} onChange={e => setContactSubject(e.target.value)} placeholder="What's this regarding?" />
              </div>
              <div className="input-group">
                <label className="input-label">Message</label>
                <textarea className="input-field" rows={6} value={contactBody} onChange={e => setContactBody(e.target.value)}></textarea>
              </div>
              <button className="btn btn-primary" style={{ width: "100%", padding: 14 }} onClick={() => handleSendMessage(false)}>Send Message</button>
            </div>
          )}

        </div>
      </div>

      {/* Floating Chat Widget */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
         {isChatOpen && (
           <div style={{ background: "white", width: 340, height: 450, borderRadius: 16, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden", display: "flex", flexDirection: "column", marginBottom: 16 }}>
             <div style={{ background: "#16a34a", color: "white", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <span style={{ fontWeight: 600 }}>Farm Support Chat</span>
               <X style={{ cursor: "pointer" }} size={20} onClick={() => setIsChatOpen(false)} />
             </div>
             <div style={{ flex: 1, padding: 16, overflowY: "auto", background: "#f8fafc", display: "flex", flexDirection: "column", gap: 12 }}>
                {chatMessages.length === 0 ? <p style={{ textAlign: "center", color: "#64748b", marginTop: 20 }}>No messages. Drop a hello!</p> : chatMessages.map(m => (
                  <div key={m.id} style={{ background: m.sender_id === user.id ? "#dcfce7" : "white", padding: 12, borderRadius: 12, border: "1px solid #e2e8f0", alignSelf: m.sender_id === user.id ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: m.sender_id === user.id ? "#166534" : "#475569", display: "block", marginBottom: 4 }}>{m.sender?.name || "Support Team"}</span>
                    <span>{m.body}</span>
                  </div>
                ))}
             </div>
             <div style={{ padding: 12, background: "white", borderTop: "1px solid #e2e8f0", display: "flex", gap: 8 }}>
               <input 
                 value={chatInput} 
                 onChange={e => setChatInput(e.target.value)}
                 onKeyDown={e => e.key === "Enter" && handleSendMessage(true)}
                 placeholder="Type your message..." 
                 style={{ flex: 1, border: "none", background: "#f1f5f9", padding: "10px 16px", borderRadius: 20, outline: "none" }}
               />
               <div style={{ background: "#16a34a", borderRadius: "50%", width: 38, height: 38, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }} onClick={() => handleSendMessage(true)}>
                 <Send size={18} color="white" style={{ marginLeft: -2 }} />
               </div>
             </div>
           </div>
         )}
         <div 
           onClick={() => setIsChatOpen(!isChatOpen)}
           style={{ background: "#16a34a", width: 64, height: 64, borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(22,163,74,0.4)", transition: "all 0.2s" }}
         >
           <MessageCircle color="white" size={28} />
         </div>
      </div>
    </div>
  );
}
