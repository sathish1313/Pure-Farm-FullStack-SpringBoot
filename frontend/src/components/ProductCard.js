import React from "react";
import { Link } from "react-router-dom";

const FALLBACK_EMOJI = { "coconut oil": "🥥", "groundnut oil": "🥜", rice: "🌾" };

function emojiFor(name) {
  const key = (name || "").toLowerCase();
  return FALLBACK_EMOJI[key] || "🫙";
}

export default function ProductCard({ product }) {
  const outOfStock = product.stock <= 0;

  return (
    <Link to={`/product/${product.id}`} className="product-card card">
      <div className="product-thumb">
        <span>{emojiFor(product.name)}</span>
        {outOfStock && <span className="out-badge">Out of stock</span>}
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p className="unit">{product.unit}</p>
        <div className="price-row">
          <span className="price">₹{Number(product.price).toFixed(0)}</span>
          <span className="btn btn-ghost view-btn">View →</span>
        </div>
      </div>

      <style>{`
        .product-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lift); }
        .product-thumb {
          background: linear-gradient(160deg, var(--cream-dark), var(--line));
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          position: relative;
        }
        .out-badge {
          position: absolute;
          top: 10px; right: 10px;
          background: var(--danger);
          color: #fff;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 999px;
        }
        .product-body { padding: 18px 20px 20px; }
        .product-body h3 { font-size: 1.15rem; margin-bottom: 2px; }
        .unit { color: var(--ink-soft); font-size: 0.85rem; margin: 0 0 14px; }
        .price-row { display: flex; align-items: center; justify-content: space-between; }
        .price { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; color: var(--terracotta); }
        .view-btn { padding: 8px 16px; font-size: 0.8rem; }
      `}</style>
    </Link>
  );
}
