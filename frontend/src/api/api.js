import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ---------- Products ----------
export const getProducts = () => api.get("/products").then((r) => r.data);
export const getProduct = (id) => api.get(`/products/${id}`).then((r) => r.data);

// ---------- Orders ----------
export const createOrder = (payload) => api.post("/orders", payload).then((r) => r.data);
export const getOrder = (orderCode) => api.get(`/orders/${orderCode}`).then((r) => r.data);
export const getOrdersByPhone = (phone) => api.get(`/orders/by-phone/${phone}`).then((r) => r.data);

// ---------- Payments ----------
export const submitPayment = (payload) => api.post("/payments", payload).then((r) => r.data);

// ---------- Auth ----------
export const registerUser = (payload) => api.post("/auth/register", payload).then((r) => r.data);
export const loginUser = (payload) => api.post("/auth/login", payload).then((r) => r.data);

// ---------- Admin ----------
export const getAdminDashboard = () => api.get("/admin/dashboard").then((r) => r.data);
export const getAdminOrders = () => api.get("/admin/orders").then((r) => r.data);
export const updateOrderStatus = (orderCode, status) =>
  api.put(`/admin/orders/${orderCode}/status`, { status }).then((r) => r.data);
export const verifyPayment = (paymentId, approve) =>
  api.put(`/admin/payments/${paymentId}/verify`, { approve }).then((r) => r.data);
export const getAdminProducts = () => api.get("/admin/products").then((r) => r.data);
export const createProduct = (payload) => api.post("/admin/products", payload).then((r) => r.data);
export const updateProduct = (id, payload) => api.put(`/admin/products/${id}`, payload).then((r) => r.data);
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`).then((r) => r.data);

export default api;
