import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">🥥</span>
          <span className="brand-text">
            Pure Farm <em>Products</em>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Shop
          </NavLink>
          <NavLink to="/my-orders" className={({ isActive }) => (isActive ? "active" : "")}>
            My Orders
          </NavLink>
          <NavLink to="/cart" className="cart-link">
            🧺 Cart
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </NavLink>
        </nav>
      </div>

      <style>{`
        .navbar {
          background: var(--forest);
          color: #fff;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: var(--shadow-soft);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
        }
        .brand-mark { font-size: 1.6rem; }
        .brand-text em { color: var(--gold); font-style: normal; }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
          font-weight: 600;
          font-size: 0.92rem;
        }
        .nav-links a { color: rgba(255,255,255,0.82); transition: color 0.15s; }
        .nav-links a:hover, .nav-links a.active { color: var(--gold); }
        .cart-link { position: relative; display: flex; align-items: center; gap: 6px; }
        .cart-count {
          background: var(--terracotta);
          color: #fff;
          font-size: 0.7rem;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }
        @media (max-width: 560px) {
          .navbar-inner { height: 60px; }
          .brand-text { display: none; }
          .nav-links { gap: 16px; font-size: 0.85rem; }
        }
      `}</style>
    </header>
  );
}
