import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { getOrder, submitPayment } from "../api/api";

export default function Payment() {
  const { orderCode } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUtrForm, setShowUtrForm] = useState(false);
  const [utr, setUtr] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const load = () => {
    getOrder(orderCode).then(setData).finally(() => setLoading(false));
  };

  useEffect(load, [orderCode]);

  if (loading) return <div className="spinner" />;
  if (!data) return <p className="empty-state">Order not found.</p>;

  const { order, upiLink } = data;

  if (order.paymentStatus === "PAID" || order.paymentStatus === "VERIFICATION_PENDING") {
    // Already submitted / confirmed - send to confirmation/tracking page
    navigate(`/order-confirmation/${orderCode}`, { replace: true });
    return null;
  }

  const handleSubmitUtr = async () => {
    if (!utr.trim()) {
      setError("Please enter the UTR / Transaction ID");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await submitPayment({ orderCode, utrNumber: utr.trim(), screenshotUrl });
      setSubmitted(true);
      setTimeout(() => navigate(`/order-confirmation/${orderCode}`), 1200);
    } catch (err) {
      setError(err?.response?.data?.error || "Could not submit payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container payment-page">
      <div className="card payment-card">
        <p className="section-label">Order #{order.orderCode}</p>
        <h1 className="amount">₹{Number(order.totalAmount).toFixed(0)}</h1>

        <div className="qr-wrap">
          <QRCodeSVG value={upiLink} size={220} fgColor="#2f4b2f" />
        </div>

        <p className="scan-hint">Scan with any UPI app to pay</p>
        <p className="upi-id">UPI ID: <strong>6303250883@ybl</strong></p>

        {!showUtrForm && (
          <button className="btn btn-primary paid-btn" onClick={() => setShowUtrForm(true)}>
            I Have Paid
          </button>
        )}

        {showUtrForm && !submitted && (
          <div className="utr-form">
            <label>Enter UTR / Transaction ID</label>
            <input
              className="input-field"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              placeholder="e.g. 302512345678"
            />
            <label className="optional-label">Payment screenshot URL (optional)</label>
            <input
              className="input-field"
              value={screenshotUrl}
              onChange={(e) => setScreenshotUrl(e.target.value)}
              placeholder="https://..."
            />
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary submit-btn" onClick={handleSubmitUtr} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Payment"}
            </button>
          </div>
        )}

        {submitted && <p className="success-msg">✓ Submitted! Redirecting…</p>}
      </div>

      <style>{`
        .payment-page { display: flex; justify-content: center; padding: 50px 20px 90px; }
        .payment-card { max-width: 420px; width: 100%; padding: 34px; text-align: center; }
        .amount { font-size: 2.2rem; color: var(--terracotta); margin: 6px 0 24px; }
        .qr-wrap {
          background: #fff; padding: 18px; border-radius: var(--radius-md);
          display: inline-flex; border: 1.5px solid var(--line); margin-bottom: 16px;
        }
        .scan-hint { color: var(--ink-soft); font-size: 0.9rem; margin-bottom: 4px; }
        .upi-id { color: var(--ink-soft); font-size: 0.9rem; margin-bottom: 26px; }
        .paid-btn, .submit-btn { width: 100%; padding: 15px; }
        .utr-form { text-align: left; margin-top: 8px; }
        .utr-form label { display: block; font-size: 0.82rem; font-weight: 600; color: var(--ink-soft); margin-bottom: 6px; }
        .optional-label { margin-top: 14px; }
        .error { color: var(--danger); font-size: 0.85rem; margin: 10px 0 0; }
        .success-msg { color: var(--success); font-weight: 700; margin-top: 10px; }
      `}</style>
    </div>
  );
}
