import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/api";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ customerName: "", customerPhone: "", address: "", city: "", pincode: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = "Name is required";
    if (!/^[0-9]{10}$/.test(form.customerPhone.trim())) errs.customerPhone = "Enter a valid 10-digit mobile number";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.pincode.trim()) errs.pincode = "Pincode is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");
    try {
      const payload = {
        ...form,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      };
      const order = await createOrder(payload);
      clearCart();
      navigate(`/payment/${order.orderCode}`);
    } catch (err) {
      setServerError(err?.response?.data?.error || "Could not place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-grid">
        <div className="card form-card">
          <h3>Delivery Details</h3>

          <div className="field">
            <label>Name</label>
            <input className="input-field" name="customerName" value={form.customerName} onChange={handleChange} />
            {errors.customerName && <span className="error">{errors.customerName}</span>}
          </div>

          <div className="field">
            <label>Mobile Number</label>
            <input className="input-field" name="customerPhone" value={form.customerPhone} onChange={handleChange} placeholder="10-digit number" />
            {errors.customerPhone && <span className="error">{errors.customerPhone}</span>}
          </div>

          <div className="field">
            <label>Address</label>
            <textarea className="input-field" rows={3} name="address" value={form.address} onChange={handleChange} />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          <div className="field-row">
            <div className="field">
              <label>City</label>
              <input className="input-field" name="city" value={form.city} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Pincode</label>
              <input className="input-field" name="pincode" value={form.pincode} onChange={handleChange} />
              {errors.pincode && <span className="error">{errors.pincode}</span>}
            </div>
          </div>
        </div>

        <div className="card summary-card">
          <h3>Order Summary</h3>
          {items.map((i) => (
            <div className="summary-line" key={i.id}>
              <span>{i.name} × {i.quantity}</span>
              <span>₹{i.price * i.quantity}</span>
            </div>
          ))}
          <div className="summary-line total-line">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          {serverError && <p className="error server-error">{serverError}</p>}
          <button className="btn btn-primary place-order-btn" onClick={handlePlaceOrder} disabled={submitting}>
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>

      <style>{`
        .checkout-page { padding: 40px 0 80px; }
        .checkout-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; align-items: start; }
        .form-card, .summary-card { padding: 26px; }
        .field { margin-bottom: 16px; }
        .field label { display: block; font-size: 0.82rem; font-weight: 600; color: var(--ink-soft); margin-bottom: 6px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .error { color: var(--danger); font-size: 0.78rem; margin-top: 4px; display: block; }
        .server-error { margin: 10px 0; }
        .summary-line { display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.92rem; border-bottom: 1px solid var(--line); }
        .total-line { border-bottom: none; font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; color: var(--forest-dark); padding-top: 14px; }
        .place-order-btn { width: 100%; padding: 15px; margin-top: 16px; }
        @media (max-width: 780px) {
          .checkout-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
