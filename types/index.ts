export type Role = "customer" | "seller" | "admin";
export type UserStatus = "active" | "banned";
export type OrderStatus =
  | "placed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Medicine {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  stock: number;
  image?: string;
  manufacturer?: string;
  sellerId: number;
  categoryId: number;
  category: { id: number; name: string };
  seller: { id: number; name: string };
  reviews?: Review[];
  createdAt: string;
}

export interface Review {
  id: number;
  customerId: number;
  medicineId: number;
  rating: number;
  comment?: string;
  customer: { id: number; name: string; avatar?: string };
  createdAt: string;
}

export interface OrderItem {
  id: number;
  medicineId: number;
  quantity: number;
  unitPrice: number | string;
  medicine: {
    id: number;
    name: string;
    image?: string;
    price?: number | string;
    sellerId?: number;
  };
}

export interface Order {
  id: number;
  customerId: number;
  totalAmount: number | string;
  status: OrderStatus;
  shippingAddress: string;
  shippingCity: string;
  shippingPhone: string;
  notes?: string;
  customer?: { id: number; name: string; email: string };
  orderItems: OrderItem[];
  createdAt: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  stock: number;
  sellerId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
