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
  ArcElement
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard({ token, handleLogout }) {
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = API.get("/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const fetchInventoryData = API.get("/inventories", {
      headers: { Authorization: `Bearer ${token}` }
    });

    Promise.all([fetchDashboardData, fetchInventoryData])
      .then(([dashboardRes, inventoryRes]) => {
        setData(dashboardRes.data);
        prepareChartData(dashboardRes.data);
        prepareInventoryChartData(inventoryRes.data);
      })
      .catch(() => handleLogout());
  }, [token]);

  const prepareInventoryChartData = (inventory) => {
    const healthyStock = inventory.filter(item => item.quantity_available >= 100).length;
    const lowStock = inventory.filter(item => item.quantity_available < 100).length;

    setInventoryData({
      bar: {
        labels: inventory.map(item => item.input?.name || `Item ${item.id}`),
        datasets: [{
          label: "Quantity Available",
          data: inventory.map(item => item.quantity_available),
          backgroundColor: inventory.map(item => 
            item.quantity_available < 100 
              ? "rgba(255, 99, 132, 0.6)" 
              : "rgba(75, 192, 192, 0.6)"
          ),
          borderColor: inventory.map(item => 
            item.quantity_available < 100 
              ? "rgba(255, 99, 132, 1)" 
              : "rgba(75, 192, 192, 1)"
          ),
          borderWidth: 1
        }]
      },
      doughnut: {
        labels: ["Healthy Stock", "Low Stock"],
        datasets: [{
          data: [healthyStock, lowStock],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)"
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 99, 132, 1)"
          ],
          borderWidth: 1
        }]
      }
    });
  };

  const prepareChartData = (dashboardData) => {
    setChartData({
      overview: {
        labels: ["Animals", "Fields", "Workers", "Stock"],
        datasets: [{
          label: "Farm Overview",
          data: [
            dashboardData.total_animals,
            dashboardData.total_fields,
            dashboardData.total_workers,
            dashboardData.total_stock
          ],
          backgroundColor: [
            "rgba(54, 162, 235, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(153, 102, 255, 0.6)"
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(153, 102, 255, 1)"
          ],
          borderWidth: 1
        }]
      },
      financial: {
        labels: ["Revenue", "Cost", "Profit"],
        datasets: [{
          label: "Financial Overview",
          data: [
            dashboardData.total_revenue || 0,
            dashboardData.total_cost || 0,
            dashboardData.profit || 0
          ],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)"
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)"
          ],
          borderWidth: 1
        }]
      }
    });
  };

  if (!data) return <p>Loading...</p>;

  const cardStyle = {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  };

  const chartContainerStyle = {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <button onClick={handleLogout} style={{ marginBottom: "20px", padding: "10px 20px" }}>Logout</button>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        marginBottom: "20px"
      }}>
        <div style={cardStyle}><h3>Animals</h3><p>{data.total_animals}</p></div>
        <div style={cardStyle}><h3>Fields</h3><p>{data.total_fields}</p></div>
        <div style={cardStyle}><h3>Workers</h3><p>{data.total_workers}</p></div>
        <div style={cardStyle}><h3>Stock</h3><p>{data.total_stock}</p></div>
        <div style={cardStyle}><h3>Low Stock</h3><p>{data.low_stock_items}</p></div>
        <div style={cardStyle}><h3>Yield</h3><p>{data.total_yield}</p></div>
      </div>

      {chartData && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px"
        }}>
          <div style={chartContainerStyle}>
            <h3 style={{ textAlign: "center" }}>Farm Overview</h3>
            <Bar
              data={chartData.overview}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" }
                }
              }}
            />
          </div>
          <div style={chartContainerStyle}>
            <h3 style={{ textAlign: "center" }}>Financial Overview</h3>
            <Doughnut
              data={chartData.financial}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" }
                }
              }}
            />
          </div>
        </div>
      )}

      {inventoryData && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px"
        }}>
          <div style={chartContainerStyle}>
            <h3 style={{ textAlign: "center" }}>Inventory Status by Item</h3>
            <Bar
              data={inventoryData.bar}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
          <div style={chartContainerStyle}>
            <h3 style={{ textAlign: "center" }}>Stock Health Overview</h3>
            <Doughnut
              data={inventoryData.doughnut}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;