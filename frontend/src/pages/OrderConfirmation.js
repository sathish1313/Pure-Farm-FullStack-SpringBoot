import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrder } from "../api/api";
import OrderStatusTracker from "../components/OrderStatusTracker";

const PAYMENT_LABELS = {
  PENDING: { text: "Payment Pending", cls: "badge-pending" },
  VERIFICATION_PENDING: { text: "Verification Pending", cls: "badge-pending" },
  PAID: { text: "Payment Confirmed", cls: "badge-paid" },
  REJECTED: { text: "Payment Rejected", cls: "badge-rejected" },
};

export default function OrderConfirmation() {
  const { orderCode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => getOrder(orderCode).then(setData).finally(() => setLoading(false));

  useEffect(() => {
    load();
    const interval = setInterval(load, 8000); // poll for admin verification / status updates
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCode]);

  if (loading) return <div className="spinner" />;
  if (!data) return <p className="empty-state">Order not found.</p>;

  const { order } = data;
  const payment = PAYMENT_LABELS[order.paymentStatus] || PAYMENT_LABELS.PENDING;

  return (
    <div className="container confirmation-page">
      <div className="card confirmation-card">
        {order.paymentStatus === "PAID" && <div className="celebrate">🎉</div>}

        <h1>
          {order.paymentStatus === "PAID" ? "Payment Confirmed!" : "Order Received"}
        </h1>
        <p className="order-code">Order #{order.orderCode}</p>
        <span className={`badge ${payment.cls}`}>{payment.text}</span>

        <div className="amount-line">Total: ₹{Number(order.totalAmount).toFixed(0)}</div>

        {order.paymentStatus === "VERIFICATION_PENDING" && (
          <p className="hint">
            We've received your UTR and are verifying the payment. This page updates automatically.
          </p>
        )}
        {order.paymentStatus === "REJECTED" && (
          <p className="hint error-hint">
            We couldn't verify this payment. Please contact support or try paying again.
          </p>
        )}

        {order.paymentStatus === "PAID" && (
          <div className="tracker-wrap">
            <OrderStatusTracker status={order.orderStatus} />
          </div>
        )}

        <div className="items-list">
          <h3>Items</h3>
          {order.items?.map((item) => (
            <div className="item-row" key={item.id}>
              <span>{item.productName} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <Link to="/" className="btn btn-outline continue-btn">
          Continue Shopping
        </Link>
      </div>

      <style>{`
        .confirmation-page { display: flex; justify-content: center; padding: 50px 20px 90px; }
        .confirmation-card { max-width: 480px; width: 100%; padding: 36px; text-align: center; }
        .celebrate { font-size: 2.6rem; margin-bottom: 6px; }
        .order-code { color: var(--ink-soft); margin: 4px 0 14px; }
        .amount-line { font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; color: var(--forest-dark); margin: 18px 0; }
        .hint { color: var(--ink-soft); font-size: 0.9rem; margin: 14px 0 0; }
        .error-hint { color: var(--danger); }
        .tracker-wrap { margin: 24px 0; text-align: left; }
        .items-list { text-align: left; margin: 26px 0; border-top: 1px solid var(--line); padding-top: 18px; }
        .items-list h3 { font-size: 1rem; margin-bottom: 10px; }
        .item-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 0.9rem; color: var(--ink-soft); }
        .continue-btn { margin-top: 10px; }
      `}</style>
    </div>
  );
}
