import { useEffect, useState } from "react";
import API from "./api";
import { Mail, Send } from "lucide-react";

export default function Mailbox({ token, user }) {
  const [messages, setMessages] = useState([]);
  const [isComposing, setIsComposing] = useState(false);
  const [form, setForm] = useState({ receiver_id: "", subject: "", body: "" });

  useEffect(() => {
    API.get("/messages", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setMessages(res.data));
  }, [token]);

  const handleSend = async () => {
    await API.post("/messages", form, { headers: { Authorization: `Bearer ${token}` } });
    setIsComposing(false);
    setForm({ receiver_id: "", subject: "", body: "" });
    const res = await API.get("/messages", { headers: { Authorization: `Bearer ${token}` } });
    setMessages(res.data);
  }

  return (
    <div style={{ padding: "32px 40px", background: "#f8fafc", minHeight: "100vh" }}>
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 32, color: "#1e293b", display: "flex", alignItems: "center", gap: 12 }}>
             <Mail size={32} color="#16a34a" /> Mailbox & Alerts
          </h1>
          <button className="btn btn-primary" onClick={() => setIsComposing(true)} style={{ padding: "12px 24px" }}><Send size={18} /> Compose</button>
       </div>

       {isComposing && (
         <div className="card" style={{ padding: 32, marginBottom: 32, background: "white", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginTop: 0 }}>New Broadcast Message</h3>
            <div className="input-group">
               <label className="input-label">To (User ID or empty for System Broadcast)</label>
               <input className="input-field" placeholder="Leave blank to send to all staff" value={form.receiver_id} onChange={e => setForm({...form, receiver_id: e.target.value})} />
            </div>
            <div className="input-group">
               <label className="input-label">Subject</label>
               <input className="input-field" placeholder="E.g. Urgent Order Update" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
            </div>
            <div className="input-group">
               <label className="input-label">Message Payload</label>
               <textarea className="input-field" rows="4" value={form.body} onChange={e => setForm({...form, body: e.target.value})}></textarea>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
               <button className="btn btn-primary" onClick={handleSend}>Dispatch Message</button>
               <button className="btn btn-secondary" onClick={() => setIsComposing(false)}>Cancel</button>
            </div>
         </div>
       )}

       <div className="card" style={{ padding: 0, overflow: "hidden", borderRadius: 12 }}>
         <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
           <thead>
             <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #e2e8f0" }}>
               <th style={{ padding: "16px 24px", color: "#475569" }}>From</th>
               <th style={{ padding: "16px 24px", color: "#475569" }}>To</th>
               <th style={{ padding: "16px 24px", color: "#475569" }}>Subject</th>
               <th style={{ padding: "16px 24px", color: "#475569" }}>Message Body</th>
               <th style={{ padding: "16px 24px", color: "#475569" }}>Time</th>
             </tr>
           </thead>
           <tbody>
             {messages.map(m => (
               <tr key={m.id} style={{ borderBottom: "1px solid #f1f5f9", background: "white" }}>
                 <td style={{ padding: "16px 24px", fontWeight: "600", color: "#0f172a" }}>{m.sender?.name || "System"}</td>
                 <td style={{ padding: "16px 24px", color: "#334155" }}>{m.receiver?.name || "Broadcast"}</td>
                 <td style={{ padding: "16px 24px", fontWeight: "500", color: "#1e293b" }}>{m.subject}</td>
                 <td style={{ padding: "16px 24px", color: "#64748b" }}>{m.body}</td>
                 <td style={{ padding: "16px 24px", color: "#94a3b8", fontSize: 13 }}>{new Date(m.created_at).toLocaleDateString()}</td>
               </tr>
             ))}
             {messages.length === 0 && (
                <tr><td colSpan="5" style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>No messages in your mailbox.</td></tr>
             )}
           </tbody>
         </table>
       </div>
    </div>
  );
}
