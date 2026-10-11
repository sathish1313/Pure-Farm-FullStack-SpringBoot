import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">🥥 Admin</h2>
        <nav>
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? "active" : "")}>
            Orders
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => (isActive ? "active" : "")}>
            Products
          </NavLink>
        </nav>
        <NavLink to="/" className="exit-link">← Back to Store</NavLink>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>

      <style>{`
        .admin-shell { display: flex; min-height: 100vh; background: var(--cream); }
        .admin-sidebar {
          width: 220px; background: var(--forest-dark); color: #fff;
          padding: 28px 20px; display: flex; flex-direction: column; flex-shrink: 0;
        }
        .admin-logo { color: #fff; font-size: 1.2rem; margin-bottom: 30px; }
        .admin-sidebar nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .admin-sidebar nav a {
          padding: 11px 14px; border-radius: var(--radius-sm); font-weight: 600;
          font-size: 0.92rem; color: rgba(255,255,255,0.78);
        }
        .admin-sidebar nav a.active, .admin-sidebar nav a:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .exit-link { font-size: 0.82rem; color: var(--gold); padding: 10px 14px; }
        .admin-content { flex: 1; padding: 36px 40px; overflow-x: auto; }
        @media (max-width: 780px) {
          .admin-shell { flex-direction: column; }
          .admin-sidebar { width: 100%; flex-direction: row; align-items: center; padding: 14px 18px; }
          .admin-logo { margin-bottom: 0; margin-right: 20px; font-size: 1rem; }
          .admin-sidebar nav { flex-direction: row; }
          .exit-link { display: none; }
          .admin-content { padding: 20px; }
        }
      `}</style>
    </div>
  );
}
