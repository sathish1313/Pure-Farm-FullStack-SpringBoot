import React, { useEffect, useState } from "react";
import { getAdminDashboard } from "../api/api";

const CARDS = [
  { key: "totalOrders", label: "Orders", icon: "📦" },
  { key: "pendingPayments", label: "Pending Payments", icon: "⏳" },
  { key: "totalProducts", label: "Products", icon: "🛒" },
  { key: "lowStock", label: "Low Stock", icon: "⚠️" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminDashboard().then(setStats);
  }, []);

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      {!stats && <div className="spinner" />}
      {stats && (
        <div className="stats-grid">
          {CARDS.map((c) => (
            <div className="card stat-card" key={c.key}>
              <span className="stat-icon">{c.icon}</span>
              <span className="stat-value">{stats[c.key]}</span>
              <span className="stat-label">{c.label}</span>
            </div>
          ))}
          <div className="card stat-card sales-card">
            <span className="stat-icon">💰</span>
            <span className="stat-value">₹{Number(stats.totalSales).toFixed(0)}</span>
            <span className="stat-label">Total Sales</span>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-page h1 { margin-bottom: 26px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 18px; }
        .stat-card { padding: 22px; display: flex; flex-direction: column; gap: 6px; }
        .stat-icon { font-size: 1.6rem; }
        .stat-value { font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; color: var(--forest-dark); }
        .stat-label { color: var(--ink-soft); font-size: 0.85rem; }
        .sales-card { background: var(--forest); }
        .sales-card .stat-value, .sales-card .stat-label { color: #fff; }
      `}</style>
    </div>
  );
}
