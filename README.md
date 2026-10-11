# 🥥 Pure Farm Products — Full E-Commerce System

Coconut Oil / Groundnut Oil e-commerce site with QR-based UPI payments and an
admin dashboard, built exactly along the flow you specified:

```
Customer → React Website → Spring Boot Backend → MySQL Database → UPI Payment
→ Admin Verification → Notification → Order Processing → Delivery
```

This implements **Phases 1–6** of your roadmap end-to-end and leaves clear
extension points for **Phase 7** (payment gateway + WhatsApp/SMS).

---

## 📁 Project Structure

```
pure-farm-ecommerce/
├── backend/     Spring Boot 3 (Java 17) REST API + MySQL via JPA
└── frontend/    React 18 SPA (customer site + admin dashboard)
```

---

## 🚀 Running the Backend

**Requirements:** Java 17+, Maven, MySQL 8 running locally.

1. Create the database (or just let JPA auto-create it):
   ```sql
   CREATE DATABASE purefarm_db;
   ```
2. Edit `backend/src/main/resources/application.properties`:
   - Set `spring.datasource.username` / `spring.datasource.password`
   - Set `app.upi.id` to your real UPI ID (e.g. `yourname@okhdfcbank`)
   - (Optional, Phase 6) Fill in `spring.mail.*` and set
     `app.notifications.email.enabled=true` to turn on email notifications
3. Run it:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The API starts on **http://localhost:8080**. Three demo products
   (Coconut Oil, Groundnut Oil, Rice) are seeded automatically on first run.

### Key API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/products` | List products |
| POST | `/api/orders` | Create order (checkout) |
| GET | `/api/orders/{orderCode}` | Get order + UPI QR link |
| GET | `/api/orders/by-phone/{phone}` | "My Orders" lookup |
| POST | `/api/payments` | Submit UTR after paying |
| POST | `/api/auth/register` / `/login` | Basic auth (optional login) |
| GET | `/api/admin/dashboard` | Admin stats |
| GET | `/api/admin/orders` | All orders |
| PUT | `/api/admin/payments/{id}/verify` | Confirm/reject a payment |
| PUT | `/api/admin/orders/{code}/status` | Move order through delivery stages |
| GET/POST/PUT/DELETE | `/api/admin/products` | Product CRUD |

> ⚠️ The admin endpoints are **not yet secured** with authentication. Before
> going live, add Spring Security so `/api/admin/**` only accepts requests
> from a logged-in ADMIN user (JWT recommended).

---

## 🚀 Running the Frontend

**Requirements:** Node.js 18+.

```bash
cd frontend
npm install
npm start
```

Opens on **http://localhost:3000**. It talks to the backend at
`http://localhost:8080/api` by default — override with an `.env` file:

```
REACT_APP_API_URL=http://localhost:8080/api
```

### Customer flow
`/` → `/product/:id` → `/cart` → `/checkout` → `/payment/:orderCode`
(shows the UPI QR code, built live from your order's `upiLink`) →
`/order-confirmation/:orderCode` (auto-refreshes every 8s while awaiting
admin verification, then shows the delivery progress tracker) →
`/my-orders` (lookup by phone number).

### Admin dashboard
`/admin` — stats, `/admin/orders` — payment verification (Confirm/Reject)
and delivery status updates, `/admin/products` — full product CRUD.

---

## 🧭 How the QR payment works

The backend builds a standard UPI deep link:
```
upi://pay?pa=<your-upi-id>&pn=<payee-name>&am=<amount>&cu=INR&tn=Order+ORD1025
```
The frontend renders this as a scannable QR code using `qrcode.react` — no
external QR service needed. Since a plain UPI QR gives no payment webhook,
the customer manually submits their UTR/transaction ID, which lands in the
admin dashboard as **Verification Pending** until an admin confirms it
against their bank/UPI app. This matches your documented flow exactly.

**Phase 7 upgrade path:** replace the manual UTR step with Razorpay/Cashfree/
PhonePe PG, which gives you an instant server-to-server payment webhook —
at that point `PaymentService.verifyPayment` can be called automatically
instead of by an admin click.

---

## 🗄️ Database

Tables are auto-created by Hibernate (`spring.jpa.hibernate.ddl-auto=update`).
A reference schema is in `backend/src/main/resources/schema-reference.sql`
if you'd rather set it up by hand. Relationships:

```
users ──< orders ──< order_items >── products
                 └── payments (1:1)
```

---

## ✅ Roadmap status

| Phase | Status |
|---|---|
| 1. React UI → Products → Cart | ✅ Done |
| 2. Spring Boot → MySQL → Product APIs | ✅ Done |
| 3. Checkout → Orders (guest checkout; login optional) | ✅ Done |
| 4. QR payment → UTR → Admin verification | ✅ Done |
| 5. Admin dashboard → Order management | ✅ Done |
| 6. Email notifications | ✅ Scaffolded (set `app.notifications.email.enabled=true`) |
| 7. Payment gateway + WhatsApp/SMS | 🔜 Extension point ready in `PaymentService` / `NotificationService` |

## Before going to production

- Hash passwords with `BCryptPasswordEncoder` instead of plain text
- Add Spring Security + JWT to lock down `/api/admin/**`
- Move the UPI ID, DB password, and mail credentials into environment
  variables instead of `application.properties`
- Add image upload storage (S3 or similar) instead of raw `imageUrl` strings
- Replace the manual UTR flow with a real payment gateway for auto-verification
