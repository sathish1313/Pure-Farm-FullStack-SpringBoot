import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <h2>Your cart is empty</h2>
        <p>Browse our products and add something to your cart.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1>Your Cart</h1>

      <div className="cart-list card">
        {items.map((item) => (
          <div className="cart-row" key={item.id}>
            <div className="cart-row-info">
              <h3>{item.name}</h3>
              <p>₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
            </div>
            <div className="qty-control">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary card">
        <div className="summary-row total-row">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <button className="btn btn-primary checkout-btn" onClick={() => navigate("/checkout")}>
          Checkout
        </button>
      </div>

      <style>{`
        .cart-page { padding: 40px 0 80px; max-width: 720px; }
        .cart-list { margin-bottom: 24px; overflow: hidden; }
        .cart-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 22px; border-bottom: 1px solid var(--line); gap: 16px;
        }
        .cart-row:last-child { border-bottom: none; }
        .cart-row-info h3 { font-size: 1.02rem; margin-bottom: 2px; }
        .cart-row-info p { color: var(--ink-soft); font-size: 0.88rem; margin: 0; }
        .qty-control {
          display: inline-flex; align-items: center;
          border: 1.5px solid var(--line); border-radius: 999px; overflow: hidden; flex-shrink: 0;
        }
        .qty-control button { background: var(--cream-dark); width: 32px; height: 32px; font-size: 1rem; }
        .qty-control span { width: 32px; text-align: center; font-weight: 700; font-size: 0.9rem; }
        .remove-btn { background: none; color: var(--danger); font-size: 0.82rem; font-weight: 600; }
        .cart-summary { padding: 22px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .total-row { font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; color: var(--forest-dark); margin: 8px 0 20px; }
        .checkout-btn { width: 100%; padding: 15px; font-size: 1rem; }
      `}</style>
    </div>
  );
}
