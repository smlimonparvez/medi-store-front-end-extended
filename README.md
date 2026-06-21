# Medi Store - Medicine E-commerce Platform

A modern, full-featured e-commerce platform for purchasing medicines online built with **Next.js**, **React**, and **TypeScript**.

## 🏥 Features

### For Customers
- Browse and search medicines by categories
- Add items to cart and wishlist
- Secure checkout with Stripe payment integration
- Order history and tracking
- User profile management

### For Sellers
- Dashboard to manage medicines inventory
- Add and update medicine listings
- Track and manage orders
- View sales analytics

### For Admins
- User management
- Category management
- Order monitoring
- Platform administration

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 16.2.9
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **HTTP Client**: Axios
- **Payments**: Stripe
- **Notifications**: React Hot Toast
- **Validation**: Zod
- **State Management**: React Context API

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (customer)/        # Customer routes (cart, checkout, orders)
│   ├── admin/             # Admin panel
│   ├── seller/            # Seller dashboard
│   └── shop/              # Product catalog
├── components/            # Reusable React components
├── context/               # React Context (Auth, Cart, Wishlist)
├── lib/                   # Utilities and helpers
└── public/                # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at ` https://medi-store-front-end-extended.vercel.app`

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create optimized production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks

## 🔐 Features Highlights

- **Multi-role access control** (Customer, Seller, Admin)
- **Secure payment processing** via Stripe
- **Responsive design** with Tailwind CSS
- **Real-time notifications** using React Hot Toast
- **Type-safe** development with TypeScript

## 📄 License

Private Project
