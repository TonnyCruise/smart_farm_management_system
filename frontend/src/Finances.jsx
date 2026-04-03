import { useEffect, useState } from "react";
import API from "./api";
import { Plus, Trash2, Search, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

function Finances({ token, canEdit }) {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    description: "",
    type: "expense",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    category: ""
  });

  const fetchTransactions = () => {
    API.get("/transactions", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setTransactions(res.data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load transactions.");
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  const handleAdd = () => {
    if (!form.description || !form.type || !form.amount || !form.date) {
      setError("Please fill in all required fields (Description, Type, Amount, Date).");
      return;
    }
    
    API.post("/transactions", form, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        fetchTransactions();
        setForm({
          description: "",
          type: "expense",
          amount: "",
          date: new Date().toISOString().split('T')[0],
          category: ""
        });
        setIsAdding(false);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to add transaction.");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    
    API.delete(`/transactions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => fetchTransactions())
      .catch(err => {
        console.error(err);
        setError("Failed to delete transaction.");
      });
  };

  const filteredTransactions = transactions.filter(t =>
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Financial Ledgers</h1>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
            <Plus size={18} />
            Add Transaction
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card success">
          <p className="stat-label">Total Manual Income</p>
          <p className="stat-value">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="stat-card danger">
          <p className="stat-label">Total Manual Expenses</p>
          <p className="stat-value">${totalExpense.toLocaleString()}</p>
        </div>
        <div className={`stat-card ${totalIncome - totalExpense >= 0 ? 'primary' : 'danger'}`}>
          <p className="stat-label">Net Balance</p>
          <p className="stat-value">${(totalIncome - totalExpense).toLocaleString()}</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Transactions</h3>
          <div style={{ position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            <input
              type="text"
              placeholder="Search by description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 40, width: 240 }}
            />
          </div>
        </div>

        {canEdit && isAdding && (
          <div style={{ padding: 20, background: "var(--bg-main)", borderRadius: "var(--radius)", marginBottom: 20 }}>
            <h4 style={{ marginBottom: 16, fontWeight: 600 }}>New Transaction</h4>
            <div className="form-row">
              <div className="input-group">
                <label className="input-label">Description *</label>
                <input className="input-field" placeholder="e.g. Tractor Fuel" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Type *</label>
                <select className="input-field" value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Amount *</label>
                <input type="number" step="0.01" className="input-field" placeholder="0.00" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Category</label>
                <input className="input-field" placeholder="e.g. Maintenance" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Date *</label>
                <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: 8 }}>
              <button className="btn btn-primary" onClick={handleAdd}>Save</button>
              <button className="btn btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          </div>
        )}

        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><DollarSign size={48} /></div>
            <h3>No transactions</h3>
            <p>Your ledger is currently empty.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  {canEdit && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(t => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td style={{ fontWeight: 500 }}>{t.description}</td>
                    <td>{t.category || "-"}</td>
                    <td>
                      <span style={{ 
                        display: "flex", alignItems: "center", gap: 4,
                        color: t.type === 'income' ? '#16a34a' : '#ef4444',
                        fontWeight: 600
                      }}>
                        {t.type === 'income' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>${parseFloat(t.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    {canEdit && (
                      <td>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(t.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Finances;
