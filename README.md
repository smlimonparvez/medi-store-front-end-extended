# MediStore Frontend

A role-based medicine e-commerce marketplace built with **Next.js 16**, **React 19**, and **TypeScript**. Customers browse and order medicines, sellers manage their products, and admins oversee the entire platform.

**🔗 Live Demo:** [https://medi-store-front-end-extended.vercel.app](https://medi-store-front-end-extended.vercel.app)

**🔗 Backend API:** [https://medi-store-back-end-three.vercel.app](https://medi-store-back-end-three.vercel.app)

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16.2.9 | Framework (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3.4 | Styling |
| Axios | 1.9 | HTTP client |
| Zod | 4.0 | Form validation |
| Lucide React | 0.511 | Icons |
| React Hot Toast | 2.5 | Notifications |
| Stripe.js | 9.8 | Payment integration |

---

## Quick Start

**Prerequisites:** Node.js 18+, npm

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API base URL (must end with /api)
NEXT_PUBLIC_API_URL=https://medi-store-back-end-three.vercel.app/api

# Stripe publishable key (from your Stripe dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
```

> ⚠️ `.env.local` is never deployed to Vercel. Set these as Environment Variables in your Vercel project dashboard, then redeploy **without cache**.

---

## Authentication

Auth is handled via **JWT stored in `localStorage`**. After login the token is sent on every request as:

```
Authorization: Bearer <token>
```

The token is also stored as a plain (non-HttpOnly) cookie (`medistore_user`) so that `proxy.ts` (Next.js middleware) can read the user's role for server-side route protection — without exposing the actual token.

> This approach is required because the frontend and backend are on separate Vercel domains. Cross-site HttpOnly cookies are blocked by modern browsers (Chrome, Safari).

---

## Roles

| Role | Access |
|---|---|
| **Guest** | Home, shop, medicine detail, login, register |
| **Customer** | + Cart, checkout, orders, profile, wishlist |
| **Seller** | + Seller dashboard, manage medicines, view orders |
| **Admin** | + Admin dashboard, manage users, categories, all orders |

---

## API Endpoints

Base URL configured in `lib/axios.ts`: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000/api`)

All responses follow this shape:
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

---

### 🔓 Auth — Public

| Method | Endpoint | Request Body |
|---|---|---|
| `POST` | `/auth/register` | `{ name, email, password, phone?, role: "customer"\|"seller" }` |
| `POST` | `/auth/login` | `{ email, password }` → returns `data: { user, token }` |
| `POST` | `/auth/logout` | none |

---

### 🔑 Auth — Protected (any logged-in user)

| Method | Endpoint | Request Body |
|---|---|---|
| `GET` | `/auth/me` | — |
| `PATCH` | `/auth/profile` | `{ name?, phone?, address?, avatar? }` |

---

### 🔓 Categories — Public

| Method | Endpoint | Notes |
|---|---|---|
| `GET` | `/categories` | Returns full category list |

### 🔑 Categories — Admin only

| Method | Endpoint | Request Body |
|---|---|---|
| `POST` | `/categories` | `{ name }` |
| `PUT` | `/categories/:id` | `{ name }` |
| `DELETE` | `/categories/:id` | — |

---

### 🔓 Medicines — Public

| Method | Endpoint | Query Params |
|---|---|---|
| `GET` | `/medicines` | `page`, `limit`, `search`, `categoryId`, `minPrice`, `maxPrice`, `manufacturer` |
| `GET` | `/medicines/:id` | — includes reviews |

### 🔑 Medicines — Seller or Admin

| Method | Endpoint | Request Body |
|---|---|---|
| `POST` | `/medicines` | `{ name, description?, price, stock, image?, manufacturer?, categoryId }` |
| `PUT` | `/medicines/:id` | same fields, all optional |
| `DELETE` | `/medicines/:id` | — |

---

### 🔑 Orders — Customer only

| Method | Endpoint | Request Body / Params |
|---|---|---|
| `POST` | `/orders` | `{ shippingAddress, shippingCity, shippingPhone, notes?, items: [{ medicineId, quantity }] }` |
| `GET` | `/orders/my-orders` | — |
| `GET` | `/orders/:id` | — |
| `PATCH` | `/orders/:id/cancel` | — |

---

### 🔑 Payments — Customer only

| Method | Endpoint | Request Body |
|---|---|---|
| `POST` | `/payments/create-checkout-session` | Same as order body → returns `data: { sessionUrl }` (Stripe redirect) |
| `DELETE` | `/payments/cancel/:orderId` | — restores stock after Stripe cancel |

---

### 🔑 Reviews — Customer only

| Method | Endpoint | Request Body |
|---|---|---|
| `POST` | `/reviews` | `{ medicineId, rating: 1–5, comment? }` |

### 🔓 Reviews — Public

| Method | Endpoint | Notes |
|---|---|---|
| `GET` | `/reviews/medicine/:medicineId` | All reviews for a medicine |

---

### 🔑 Seller — Seller only

| Method | Endpoint | Request Body / Params |
|---|---|---|
| `GET` | `/seller/dashboard` | — stats |
| `GET` | `/seller/medicines` | — |
| `GET` | `/seller/medicines/:id` | — |
| `POST` | `/seller/medicines` | `{ name, description?, price, stock, image?, manufacturer?, categoryId }` |
| `PUT` | `/seller/medicines/:id` | same fields, all optional |
| `DELETE` | `/seller/medicines/:id` | — |
| `GET` | `/seller/orders` | `?page=&limit=` |
| `PATCH` | `/seller/orders/:id` | `{ status: "processing"\|"shipped"\|"delivered" }` |

---

### 🔑 Admin — Admin only

| Method | Endpoint | Request Body / Params |
|---|---|---|
| `GET` | `/admin/dashboard` | — stats |
| `GET` | `/admin/users` | `?role=customer\|seller&page=&limit=` |
| `PATCH` | `/admin/users/:id` | `{ status: "active"\|"banned" }` |
| `GET` | `/admin/orders` | `?page=&limit=` |

---

## Folder Structure

```
medi-store-front-end-extended/
│
├── app/                              # Next.js App Router pages
│   ├── page.tsx                      # Public homepage
│   ├── layout.tsx                    # Root layout (providers, fonts)
│   ├── globals.css                   # Global styles + Tailwind v4 theme
│   ├── not-found.tsx                 # 404 page
│   ├── 403/page.tsx                  # Forbidden page
│   │
│   ├── (customer)/                   # Customer route group
│   │   ├── cart/page.tsx             # Shopping cart
│   │   ├── checkout/page.tsx         # COD + Stripe checkout flow
│   │   └── orders/
│   │       ├── page.tsx              # Order history
│   │       └── [id]/page.tsx         # Order detail
│   │
│   ├── checkout/                     # Stripe redirect landing pages
│   │   ├── success/page.tsx          # Payment success
│   │   └── cancel/page.tsx           # Payment cancelled
│   │
│   ├── shop/
│   │   ├── page.tsx                  # Medicine listing with filters
│   │   └── [id]/page.tsx             # Medicine detail + reviews
│   │
│   ├── wishlist/page.tsx             # Saved medicines
│   ├── profile/page.tsx              # User profile + edit
│   ├── login/page.tsx                # Login (Suspense-wrapped for Next.js 16)
│   ├── register/page.tsx             # Registration
│   ├── about/page.tsx                # About page
│   ├── contact/page.tsx              # Contact page
│   ├── faq/page.tsx                  # FAQ page
│   │
│   ├── seller/                       # Seller dashboard (role-protected)
│   │   ├── dashboard/page.tsx        # Stats overview
│   │   ├── medicines/page.tsx        # Manage products (CRUD)
│   │   └── orders/page.tsx           # Incoming orders
│   │
│   └── admin/                        # Admin dashboard (role-protected)
│       ├── page.tsx                  # Stats overview → /admin
│       ├── users/page.tsx            # User management (ban/unban)
│       ├── categories/page.tsx       # Category management (CRUD)
│       └── orders/page.tsx           # All orders
│
├── components/
│   ├── home/                         # Homepage sections
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedMedicines.tsx
│   │   ├── CategoriesSection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── StatsSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── TrustBanner.tsx
│   ├── medicine/
│   │   └── MedicineCard.tsx          # Reusable medicine card
│   ├── order/
│   │   └── OrderStatusBadge.tsx      # Colour-coded status badge
│   ├── shared/
│   │   ├── Navbar.tsx                # Top navigation (role-aware)
│   │   └── Footer.tsx
│   └── ui/
│       └── Skeleton.tsx              # Loading skeleton component
│
├── context/
│   ├── AuthContext.tsx               # Auth state — localStorage + JWT
│   ├── CartContext.tsx               # Cart state — localStorage
│   └── WishlistContext.tsx           # Wishlist state — localStorage
│
├── lib/
│   ├── axios.ts                      # Axios instance + auth interceptor
│   └── utils.ts                      # cn(), formatPrice(), getErrorMessage()
│
├── types/
│   └── index.ts                      # Shared TypeScript types
│                                     # (User, Medicine, Order, Category, etc.)
│
├── public/                           # Static assets
├── proxy.ts                          # Next.js middleware — route protection
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
└── package.json
```

---

## Route Protection (`proxy.ts`)

Next.js middleware runs on every request before the page renders:

| Route pattern | Rule |
|---|---|
| `/login`, `/register` | Redirect to dashboard if already logged in |
| `/cart`, `/checkout`, `/orders`, `/profile`, `/wishlist` | Redirect to `/login` if not logged in |
| `/seller/*` | Redirect to `/403` if not a seller |
| `/admin/*` | Redirect to `/403` if not an admin |

The middleware reads a lightweight `medistore_user` cookie (set by `AuthContext` after login) to determine the user's role — without needing to call the API on every request.

---

## Deployment (Vercel)

1. Push the repository to GitHub
2. Import the project in [vercel.com](https://vercel.com)
3. Add environment variables in **Settings → Environment Variables**:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Deploy — **uncheck "Use existing Build Cache"** on the first deploy after adding env vars
5. For subsequent deploys: `vercel --prod` from the terminal

> The backend must also have `FRONTEND_URL` set to this frontend's Vercel URL to allow CORS requests.

---

## Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@medistore.com | admin123 |
| Seller | Register via `/register` with role `seller` | — |
| Customer | Register via `/register` with role `customer` | — |