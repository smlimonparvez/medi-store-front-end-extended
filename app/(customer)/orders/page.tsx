"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import { OrderRowSkeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my-orders")
      .then((r) => setOrders(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="page-container py-8">
          <h1 className="font-bold text-3xl text-gray-900 mb-8" style={{ fontFamily: "var(--font-sora)" }}>My Orders</h1>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => <OrderRowSkeleton key={i} />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-brand-200" />
              </div>
              <h3 className="font-bold text-xl text-gray-700 mb-2" style={{ fontFamily: "var(--font-sora)" }}>No orders yet</h3>
              <p className="text-gray-400 mb-6">Your order history will appear here</p>
              <Link href="/shop" className="btn-primary">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order.id} href={`/orders/${order.id}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-brand-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>Order #{order.id}</h3>
                            <OrderStatusBadge status={order.status} />
                          </div>
                          <p className="text-sm text-gray-400">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-brand-700 text-lg" style={{ fontFamily: "var(--font-sora)" }}>
                          {formatPrice(order.totalAmount)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">
                        📍 {order.shippingCity} &nbsp;·&nbsp;
                        {order.orderItems.slice(0, 2).map((i) => i.medicine.name).join(", ")}
                        {order.orderItems.length > 2 && ` +${order.orderItems.length - 2} more`}
                      </p>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
