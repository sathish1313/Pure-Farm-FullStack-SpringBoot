import React from "react";

const STEPS = ["CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED"];
const LABELS = {
  CONFIRMED: "Order Placed",
  PROCESSING: "Processing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
};

export default function OrderStatusTracker({ status }) {
  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="tracker">
      {STEPS.map((step, idx) => {
        const done = currentIndex >= idx;
        return (
          <div className="step" key={step}>
            <div className={`dot ${done ? "done" : ""}`}>{done ? "✓" : "○"}</div>
            <span className={done ? "label done" : "label"}>{LABELS[step]}</span>
            {idx < STEPS.length - 1 && <div className={`bar ${currentIndex > idx ? "done" : ""}`} />}
          </div>
        );
      })}
      <style>{`
        .tracker { display: flex; align-items: flex-start; padding: 10px 0; flex-wrap: wrap; gap: 6px 0; }
        .step { display: flex; align-items: center; }
        .dot {
          width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: var(--cream-dark); color: var(--ink-soft);
          font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
        }
        .dot.done { background: var(--success); color: #fff; }
        .label { margin: 0 10px; font-size: 0.82rem; color: var(--ink-soft); white-space: nowrap; }
        .label.done { color: var(--forest-dark); font-weight: 600; }
        .bar { width: 34px; height: 2px; background: var(--line); margin-right: 10px; }
        .bar.done { background: var(--success); }
      `}</style>
    </div>
  );
}
