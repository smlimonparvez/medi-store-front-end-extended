"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import { OrderRowSkeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { formatPrice, formatDate, getErrorMessage } from "@/lib/utils";
import { Loader2, Package } from "lucide-react";
import { OrderStatus } from "@/types";
import toast from "react-hot-toast";

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  placed: "processing", processing: "shipped", shipped: "delivered",
};
const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  placed: "Mark Processing", processing: "Mark Shipped", shipped: "Mark Delivered",
};

export default function SellerOrdersPage() {
  const [orders,   setOrders]   = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    api.get("/seller/orders")
      .then((r) => setOrders(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (orderId: number, status: OrderStatus) => {
    setUpdating(orderId);
    try {
      await api.patch(`/seller/orders/${orderId}`, { status });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toast.success(`Order marked as ${status}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setUpdating(null); }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="page-container py-8">
          <h1 className="font-bold text-3xl text-gray-900 mb-2" style={{ fontFamily: "var(--font-sora)" }}>Incoming Orders</h1>
          <p className="text-gray-500 mb-8">Orders containing your medicines</p>

          {loading ? (
            <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <OrderRowSkeleton key={i} />)}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-32">
              <Package className="w-16 h-16 text-brand-100 mx-auto mb-4" />
              <h3 className="font-bold text-xl text-gray-700 mb-2" style={{ fontFamily: "var(--font-sora)" }}>No orders yet</h3>
              <p className="text-gray-400">Orders for your medicines will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>Order #{order.id}</h3>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-gray-400">
                        {formatDate(order.createdAt)} · Customer: <span className="font-medium text-gray-600">{order.customer?.name}</span>
                      </p>
                    </div>
                    <span className="font-bold text-brand-700 text-lg shrink-0" style={{ fontFamily: "var(--font-sora)" }}>
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm text-gray-600">
                        <span>{item.medicine.name} × {item.quantity}</span>
                        <span className="font-medium">{formatPrice(Number(item.unitPrice) * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <span>📍 {order.shippingCity}</span>
                    <span>📞 {order.shippingPhone}</span>
                    {order.notes && <span>📝 {order.notes}</span>}
                  </div>

                  {NEXT[order.status as OrderStatus] && (
                    <button
                      onClick={() => handleUpdate(order.id, NEXT[order.status as OrderStatus]!)}
                      disabled={updating === order.id}
                      className="btn-primary text-sm gap-2"
                    >
                      {updating === order.id && <Loader2 className="w-4 h-4 animate-spin" />}
                      {NEXT_LABEL[order.status as OrderStatus]}
                    </button>
                  )}

                  {order.status === "delivered" && (
                    <span className="text-sm text-green-600 font-medium">✓ Delivered</span>
                  )}
                  {order.status === "cancelled" && (
                    <span className="text-sm text-red-500 font-medium">✗ Cancelled</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
