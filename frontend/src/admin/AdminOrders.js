import React, { useEffect, useState } from "react";
import { getAdminOrders, verifyPayment, updateOrderStatus } from "../api/api";

const STATUS_FLOW = ["CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED"];

const PAYMENT_BADGE = {
  PENDING: "badge-pending",
  VERIFICATION_PENDING: "badge-pending",
  PAID: "badge-paid",
  REJECTED: "badge-rejected",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => getAdminOrders().then(setOrders).finally(() => setLoading(false));

  useEffect(load, []);

  const handleVerify = async (paymentId, approve) => {
    setBusyId(paymentId);
    try {
      await verifyPayment(paymentId, approve);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const handleStatusChange = async (orderCode, status) => {
    setBusyId(orderCode);
    try {
      await updateOrderStatus(orderCode, status);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="admin-orders-page">
      <h1>Orders</h1>

      <div className="orders-table-wrap card">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="mono">{order.orderCode}</td>
                <td>
                  {order.customerName}
                  <div className="sub">{order.customerPhone}</div>
                </td>
                <td>₹{Number(order.totalAmount).toFixed(0)}</td>
                <td>
                  <span className={`badge ${PAYMENT_BADGE[order.paymentStatus]}`}>
                    {order.paymentStatus.replace("_", " ")}
                  </span>
                  {order.payment?.utrNumber && (
                    <div className="sub">UTR: {order.payment.utrNumber}</div>
                  )}
                </td>
                <td>
                  {order.paymentStatus === "PAID" ? (
                    <span className="badge badge-processing">{order.orderStatus.replace(/_/g, " ")}</span>
                  ) : (
                    <span className="sub">—</span>
                  )}
                </td>
                <td className="action-cell">
                  {order.paymentStatus === "VERIFICATION_PENDING" && order.payment && (
                    <div className="action-group">
                      <button
                        className="btn btn-success sm-btn"
                        disabled={busyId === order.payment.id}
                        onClick={() => handleVerify(order.payment.id, true)}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn btn-danger sm-btn"
                        disabled={busyId === order.payment.id}
                        onClick={() => handleVerify(order.payment.id, false)}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {order.paymentStatus === "PAID" && order.orderStatus !== "DELIVERED" && (
                    <select
                      className="input-field sm-select"
                      value={order.orderStatus}
                      disabled={busyId === order.orderCode}
                      onChange={(e) => handleStatusChange(order.orderCode, e.target.value)}
                    >
                      {STATUS_FLOW.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="empty-state">No orders yet.</p>}
      </div>

      <style>{`
        .admin-orders-page h1 { margin-bottom: 22px; }
        .orders-table-wrap { padding: 10px; overflow-x: auto; }
        .orders-table { width: 100%; border-collapse: collapse; min-width: 720px; }
        .orders-table th {
          text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em;
          color: var(--ink-soft); padding: 12px 14px; border-bottom: 2px solid var(--line);
        }
        .orders-table td { padding: 14px; border-bottom: 1px solid var(--line); font-size: 0.9rem; vertical-align: top; }
        .mono { font-family: monospace; font-weight: 700; color: var(--forest-dark); }
        .sub { color: var(--ink-soft); font-size: 0.78rem; margin-top: 3px; }
        .action-group { display: flex; gap: 8px; }
        .sm-btn { padding: 8px 14px; font-size: 0.78rem; }
        .sm-select { padding: 8px 10px; font-size: 0.8rem; width: auto; }
      `}</style>
    </div>
  );
}
