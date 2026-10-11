import React, { useEffect, useState } from "react";
import { getProducts } from "../api/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Could not load products. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <p className="section-label">Farm to Doorstep</p>
          <h1>Pure, Cold-Pressed Oils.<br />Straight From the Farm.</h1>
          <p className="hero-sub">
            No preservatives. No shortcuts. Just honest coconut and groundnut oil,
            extracted the traditional way.
          </p>
        </div>
      </section>

      <section className="container products-section">
        <h2>Our Products</h2>
        {loading && <div className="spinner" />}
        {error && <p className="empty-state">{error}</p>}
        {!loading && !error && (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <style>{`
        .hero {
          background: radial-gradient(120% 140% at 20% 0%, #3c5c3a 0%, var(--forest) 55%, var(--forest-dark) 100%);
          color: #fff;
          padding: 70px 0 90px;
        }
        .hero-inner { max-width: 640px; }
        .hero h1 { color: #fff; font-size: 2.6rem; margin: 10px 0 16px; }
        .hero .section-label { color: var(--gold); }
        .hero-sub { color: rgba(255,255,255,0.85); font-size: 1.05rem; line-height: 1.6; }
        .products-section { padding: 50px 0 80px; }
        .products-section h2 { margin-bottom: 24px; }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 22px;
        }
        @media (max-width: 560px) {
          .hero { padding: 46px 0 60px; }
          .hero h1 { font-size: 1.9rem; }
        }
      `}</style>
    </div>
  );
}
