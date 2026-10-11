import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getOrdersByPhone } from "../api/api";
import OrderStatusTracker from "../components/OrderStatusTracker";

export default function MyOrders() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!/^[0-9]{10}$/.test(phone.trim())) return;
    setLoading(true);
    try {
      const result = await getOrdersByPhone(phone.trim());
      setOrders(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container myorders-page">
      <h1>My Orders</h1>
      <p className="subtitle">Enter the mobile number you used at checkout</p>

      <div className="search-row">
        <input
          className="input-field"
          placeholder="10-digit mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading && <div className="spinner" />}

      {orders && orders.length === 0 && (
        <p className="empty-state">No orders found for this number.</p>
      )}

      {orders && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <Link to={`/order-confirmation/${order.orderCode}`} className="card order-item" key={order.id}>
              <div className="order-item-top">
                <strong>#{order.orderCode}</strong>
                <span>₹{Number(order.totalAmount).toFixed(0)}</span>
              </div>
              {order.paymentStatus === "PAID" ? (
                <OrderStatusTracker status={order.orderStatus} />
              ) : (
                <span className="badge badge-pending">
                  {order.paymentStatus === "VERIFICATION_PENDING" ? "Verification Pending" : "Payment Pending"}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .myorders-page { padding: 40px 0 80px; max-width: 640px; }
        .subtitle { color: var(--ink-soft); margin-bottom: 20px; }
        .search-row { display: flex; gap: 10px; margin-bottom: 30px; }
        .search-row .input-field { flex: 1; }
        .orders-list { display: flex; flex-direction: column; gap: 14px; }
        .order-item { display: block; padding: 18px 20px; }
        .order-item-top { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 1rem; }
      `}</style>
    </div>
  );
}
