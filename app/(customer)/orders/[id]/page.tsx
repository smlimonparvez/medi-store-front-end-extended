"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import api from "@/lib/axios";
import { Order } from "@/types";
import { formatPrice, formatDate, getErrorMessage } from "@/lib/utils";
import { ArrowLeft, MapPin, Phone, Package, Loader2, X } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";

const STATUS_STEPS = ["placed", "processing", "shipped", "delivered"] as const;

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder]       = useState<Order | null>(null);
  const [loading, setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((r) => setOrder(r.data.data))
      .catch(() => router.push("/orders"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      await api.patch(`/orders/${id}/cancel`);
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.data);
      toast.success("Order cancelled successfully");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50/50">
          <div className="page-container py-8 max-w-3xl space-y-5">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!order) return null;

  const currentStep = STATUS_STEPS.indexOf(order.status as typeof STATUS_STEPS[number]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="page-container py-8 max-w-3xl">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-brand-700 font-medium text-sm mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Orders
          </button>

          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h1 className="font-bold text-2xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>Order #{order.id}</h1>
                <p className="text-gray-400 text-sm mt-1">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Status stepper */}
            {order.status !== "cancelled" && (
              <div className="mt-6 flex items-center gap-0">
                {STATUS_STEPS.map((step, idx) => (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${idx <= currentStep ? "bg-brand-600 text-white shadow-sm" : "bg-gray-100 text-gray-400"} ${idx === currentStep ? "ring-4 ring-brand-100" : ""}`}>
                        {idx < currentStep ? "✓" : idx + 1}
                      </div>
                      <span className="text-xs font-medium capitalize hidden sm:block text-gray-500">{step}</span>
                    </div>
                    {idx < STATUS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${idx < currentStep ? "bg-brand-400" : "bg-gray-100"}`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {order.status === "placed" && (
              <div className="mt-5 pt-5 border-t border-gray-50">
                <button onClick={handleCancel} disabled={cancelling}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium text-sm transition-colors">
                  {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                  Cancel Order
                </button>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
            <h2 className="font-semibold text-gray-900 mb-5" style={{ fontFamily: "var(--font-sora)" }}>Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-14 h-14 rounded-xl bg-brand-50 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.medicine.image
                      ? <Image src={item.medicine.image} alt={item.medicine.name} width={56} height={56} className="w-full h-full object-cover" />
                      : <Package className="w-6 h-6 text-brand-200" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{item.medicine.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">Qty: {item.quantity} × {formatPrice(item.unitPrice)}</p>
                  </div>
                  <p className="font-bold text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>
                    {formatPrice(Number(item.unitPrice) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-gray-100 mt-5 pt-4 flex justify-between">
              <span className="font-bold text-lg text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>Total</span>
              <span className="font-bold text-xl text-brand-700" style={{ fontFamily: "var(--font-sora)" }}>
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: "var(--font-sora)" }}>Delivery Details</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />{order.shippingAddress}, {order.shippingCity}</div>
              <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-brand-500 shrink-0" />{order.shippingPhone}</div>
              {order.notes && <div className="flex items-start gap-3"><span className="text-brand-500 shrink-0">📝</span>{order.notes}</div>}
              <div className="flex items-center gap-3"><span className="text-brand-500 shrink-0">💵</span>Payment: Cash on Delivery</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
