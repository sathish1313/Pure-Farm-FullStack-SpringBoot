import React, { useEffect, useState } from "react";
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from "../api/api";

const EMPTY_FORM = { name: "", description: "", price: "", unit: "", stock: "", imageUrl: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => getAdminProducts().then(setProducts).finally(() => setLoading(false));
  useEffect(load, []);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      unit: product.unit || "",
      stock: product.stock,
      imageUrl: product.imageUrl || "",
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock), active: true };
    if (editingId) {
      await updateProduct(editingId, payload);
    } else {
      await createProduct(payload);
    }
    setShowForm(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this product from the store?")) return;
    await deleteProduct(id);
    load();
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="admin-products-page">
      <div className="page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={openNew}>
          + Add Product
        </button>
      </div>

      <div className="products-table-wrap card">
        <table className="products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Unit</th>
              <th>Stock</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>₹{Number(p.price).toFixed(0)}</td>
                <td>{p.unit}</td>
                <td className={p.stock < 5 ? "low-stock" : ""}>{p.stock}</td>
                <td>
                  <span className={`badge ${p.active ? "badge-paid" : "badge-rejected"}`}>
                    {p.active ? "Active" : "Removed"}
                  </span>
                </td>
                <td className="action-cell">
                  <button className="btn btn-ghost sm-btn" onClick={() => openEdit(p)}>
                    Edit
                  </button>
                  {p.active && (
                    <button className="btn btn-danger sm-btn" onClick={() => handleDelete(p.id)}>
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="card modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Product" : "Add Product"}</h3>

            <div className="field">
              <label>Name</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea className="input-field" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Price (₹)</label>
                <input className="input-field" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="field">
                <label>Unit</label>
                <input className="input-field" placeholder="1 Litre" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>Stock</label>
              <input className="input-field" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="field">
              <label>Image URL</label>
              <input className="input-field" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
        .products-table-wrap { padding: 10px; overflow-x: auto; }
        .products-table { width: 100%; border-collapse: collapse; min-width: 600px; }
        .products-table th {
          text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em;
          color: var(--ink-soft); padding: 12px 14px; border-bottom: 2px solid var(--line);
        }
        .products-table td { padding: 14px; border-bottom: 1px solid var(--line); font-size: 0.9rem; }
        .low-stock { color: var(--danger); font-weight: 700; }
        .action-cell { display: flex; gap: 8px; }
        .sm-btn { padding: 7px 14px; font-size: 0.78rem; }
        .modal-backdrop {
          position: fixed; inset: 0; background: rgba(30,25,15,0.4);
          display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px;
        }
        .modal-card { width: 100%; max-width: 440px; padding: 28px; }
        .modal-card h3 { margin-bottom: 18px; }
        .field { margin-bottom: 14px; }
        .field label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--ink-soft); margin-bottom: 5px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
      `}</style>
    </div>
  );
}
