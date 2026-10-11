import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function StoreLayout() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>🥥 Pure Farm Products — Cold-pressed oils, delivered fresh.</p>
        </div>
      </footer>

      <style>{`
        .site-footer {
          background: var(--forest-dark);
          color: rgba(255,255,255,0.7);
          padding: 26px 0;
          text-align: center;
          font-size: 0.85rem;
          margin-top: auto;
        }
      `}</style>
    </>
  );
}
