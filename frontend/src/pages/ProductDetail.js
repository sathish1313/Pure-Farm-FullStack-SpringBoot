import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../api/api";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(id).then(setProduct).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!product) return <p className="empty-state">Product not found.</p>;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="container detail-page">
      <button className="btn btn-ghost back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-grid">
        <div className="detail-thumb">
          <span>🥥</span>
        </div>

        <div className="detail-info">
          <h1>{product.name}</h1>
          <p className="unit-line">₹{Number(product.price).toFixed(0)} / {product.unit}</p>
          <p className="description">{product.description}</p>
          <p className="stock-line">
            Available: <strong>{product.stock}</strong>
          </p>

          <div className="qty-row">
            <span className="section-label">Quantity</span>
            <div className="qty-control">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
            </div>
          </div>

          <button className="btn btn-primary add-btn" onClick={handleAdd} disabled={product.stock <= 0}>
            {product.stock <= 0 ? "Out of Stock" : added ? "✓ Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>

      <style>{`
        .detail-page { padding: 40px 0 80px; }
        .back-btn { margin-bottom: 24px; padding: 9px 18px; font-size: 0.85rem; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 46px; align-items: start; }
        .detail-thumb {
          background: linear-gradient(160deg, var(--cream-dark), var(--line));
          border-radius: var(--radius-lg);
          height: 340px;
          display: flex; align-items: center; justify-content: center;
          font-size: 7rem;
        }
        .detail-info h1 { font-size: 2rem; }
        .unit-line { font-family: var(--font-display); font-size: 1.5rem; color: var(--terracotta); font-weight: 700; margin-bottom: 18px; }
        .description { color: var(--ink-soft); line-height: 1.6; margin-bottom: 18px; }
        .stock-line { margin-bottom: 26px; color: var(--ink-soft); }
        .qty-row { margin-bottom: 26px; }
        .qty-row .section-label { display: block; margin-bottom: 10px; }
        .qty-control {
          display: inline-flex; align-items: center; gap: 0;
          border: 1.5px solid var(--line); border-radius: 999px; overflow: hidden;
        }
        .qty-control button {
          background: var(--cream-dark); width: 40px; height: 40px;
          font-size: 1.2rem; color: var(--forest-dark);
        }
        .qty-control span { width: 44px; text-align: center; font-weight: 700; }
        .add-btn { width: 100%; padding: 15px; font-size: 1rem; }
        @media (max-width: 720px) {
          .detail-grid { grid-template-columns: 1fr; }
          .detail-thumb { height: 220px; font-size: 5rem; }
        }
      `}</style>
    </div>
  );
}
