import { useEffect, useState } from "react";
import API from "./api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { 
  Beef, 
  Wheat, 
  Users, 
  Package, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Activity,
  Leaf
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function Dashboard({ token, handleLogout }) {
  const [data, setData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/dashboard", { headers: { Authorization: `Bearer ${token}` } }),
      API.get("/inventories", { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(([dashboardRes, inventoryRes]) => {
        setData(dashboardRes.data);
        setInventoryData(inventoryRes.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <Activity size={32} />
        <span style={{ marginLeft: 12 }}>Loading dashboard...</span>
      </div>
    );
  }

  const stats = [
    { 
      label: "Total Animals", 
      value: data?.total_animals || 0, 
      icon: Beef, 
      color: "primary",
      change: "+12%"
    },
    { 
      label: "Active Fields", 
      value: data?.total_fields || 0, 
      icon: Wheat, 
      color: "success",
      change: "+3%"
    },
    { 
      label: "Workers", 
      value: data?.total_workers || 0, 
      icon: Users, 
      color: "info",
      change: "+5%"
    },
    { 
      label: "Stock Items", 
      value: data?.total_stock || 0, 
      icon: Package, 
      color: "warning",
      change: "-2%"
    },
  ];

  const lowStockItems = data?.low_stock_items || 0;
  const totalYield = data?.total_yield || 0;
  const revenue = data?.total_revenue || 0;
  const profit = data?.profit || 0;

  const chartData = {
    overview: {
      labels: ["Animals", "Fields", "Workers", "Stock"],
      datasets: [{
        label: "Farm Overview",
        data: [
          data?.total_animals || 0,
          data?.total_fields || 0,
          data?.total_workers || 0,
          data?.total_stock || 0
        ],
        backgroundColor: [
          "rgba(22, 163, 74, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)"
        ],
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    financial: {
      labels: ["Revenue", "Cost", "Profit"],
      datasets: [{
        data: [revenue, data?.total_cost || 0, profit],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(59, 130, 246, 0.8)"
        ],
        borderWidth: 0,
        cutout: "65%",
      }]
    }
  };

  const inventoryChartData = {
    labels: inventoryData?.map(item => item.input?.name || `Item ${item.id}`) || [],
    datasets: [{
      label: "Stock Level",
      data: inventoryData?.map(item => item.quantity_available) || [],
      backgroundColor: inventoryData?.map(item => 
        item.quantity_available < 100 
          ? "rgba(239, 68, 68, 0.8)" 
          : "rgba(34, 197, 94, 0.8)"
      ),
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      x: {
        grid: { display: false },
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "bottom",
        labels: { padding: 20, usePointStyle: true }
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>
            Welcome back! Here's what's happening on your farm today.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ 
            padding: "8px 16px", 
            background: "var(--primary-light)", 
            borderRadius: "var(--radius)",
            color: "var(--primary-dark)",
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <Leaf size={16} />
            Farm Status: Active
          </span>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
                <p className={`stat-change ${stat.change.startsWith("+") ? "positive" : "negative"}`}>
                  {stat.change.startsWith("+") ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span style={{ marginLeft: 4 }}>{stat.change} from last month</span>
                </p>
              </div>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius)",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <stat.icon size={24} color="white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="stats-grid" style={{ marginBottom: 0 }}>
        <div className="stat-card danger">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p className="stat-label">Low Stock Alerts</p>
              <p className="stat-value">{lowStockItems}</p>
              <p className="stat-change negative" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <AlertTriangle size={14} />
                Items need restocking
              </p>
            </div>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius)",
              background: "rgba(239, 68, 68, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <AlertTriangle size={24} color="#ef4444" />
            </div>
          </div>
        </div>

        <div className="stat-card primary">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p className="stat-label">Total Yield</p>
              <p className="stat-value">{totalYield}</p>
              <p className="stat-change positive">
                <TrendingUp size={14} />
                <span style={{ marginLeft: 4 }}>kg harvested</span>
              </p>
            </div>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius)",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Wheat size={24} color="white" />
            </div>
          </div>
        </div>

        <div className="stat-card success">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p className="stat-label">Revenue</p>
              <p className="stat-value">${revenue.toLocaleString()}</p>
              <p className="stat-change positive">
                <DollarSign size={14} />
                <span style={{ marginLeft: 4 }}>Total income</span>
              </p>
            </div>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius)",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <DollarSign size={24} color="white" />
            </div>
          </div>
        </div>

        <div className="stat-card info">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p className="stat-label">Net Profit</p>
              <p className="stat-value">${profit.toLocaleString()}</p>
              <p className={`stat-change ${profit >= 0 ? "positive" : "negative"}`}>
                {profit >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span style={{ marginLeft: 4 }}>After costs</span>
              </p>
            </div>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius)",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Activity size={24} color="white" />
            </div>
          </div>
        </div>
      </div>

      <div className="chart-grid" style={{ marginTop: 24 }}>
        <div className="chart-card">
          <h3 className="chart-title">Farm Overview</h3>
          <div style={{ height: "280px" }}>
            <Bar data={chartData.overview} options={chartOptions} />
          </div>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Financial Summary</h3>
          <div style={{ height: "280px" }}>
            <Doughnut data={chartData.financial} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ marginTop: 24 }}>
        <h3 className="chart-title">Inventory Levels</h3>
        <div style={{ height: "300px" }}>
          <Bar 
            data={inventoryChartData} 
            options={{
              ...chartOptions,
              indexAxis: "y"
            }} 
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
