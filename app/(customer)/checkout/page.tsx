"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { formatPrice, getErrorMessage } from "@/lib/utils";
import { MapPin, Phone, FileText, Loader2, CheckCircle2, Package } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  shippingAddress: z.string().min(5, "Please enter a valid address"),
  shippingCity:    z.string().min(2, "Please enter a valid city"),
  shippingPhone:   z.string().min(10, "Please enter a valid phone number"),
  notes:           z.string().optional(),
});

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    shippingAddress: user?.address || "",
    shippingCity:    "",
    shippingPhone:   user?.phone  || "",
    notes:           "",
  });
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((e) => { if (e.path[0]) errs[e.path[0] as string] = e.message; });
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/orders", {
        ...form,
        items: items.map((i) => ({ medicineId: i.id, quantity: i.quantity })),
      });
      setOrderId(res.data.data.id);
      // Clear cart AFTER successful order
      clearCart();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (orderId) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50/50 flex items-center justify-center">
          <div className="text-center max-w-md px-4 animate-fade-in">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="font-bold text-2xl text-gray-900 mb-3" style={{ fontFamily: "var(--font-sora)" }}>Order Placed! 🎉</h2>
            <p className="text-gray-500 mb-2">
              Your order <span className="font-bold text-brand-700">#{orderId}</span> has been placed successfully.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              You'll receive updates on your order status. Pay cash on delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/orders" className="btn-primary gap-2">
                <Package className="w-4 h-4" /> Track My Order
              </Link>
              <Link href="/shop" className="btn-outline">Continue Shopping</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link href="/shop" className="btn-primary">Browse Shop</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="page-container py-8">
          <h1 className="font-bold text-3xl text-gray-900 mb-8" style={{ fontFamily: "var(--font-sora)" }}>Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5" noValidate>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-semibold text-lg text-gray-900 mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-sora)" }}>
                  <MapPin className="w-5 h-5 text-brand-600" /> Shipping Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                      Street Address <span className="text-red-400">*</span>
                    </label>
                    <input name="shippingAddress" type="text" placeholder="House #, Road #, Area"
                      value={form.shippingAddress} onChange={handleChange}
                      className={`input-field ${errors.shippingAddress ? "border-red-400" : ""}`} />
                    {errors.shippingAddress && <p className="text-red-500 text-xs mt-1">{errors.shippingAddress}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">City <span className="text-red-400">*</span></label>
                      <input name="shippingCity" type="text" placeholder="Dhaka"
                        value={form.shippingCity} onChange={handleChange}
                        className={`input-field ${errors.shippingCity ? "border-red-400" : ""}`} />
                      {errors.shippingCity && <p className="text-red-500 text-xs mt-1">{errors.shippingCity}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone <span className="text-red-400">*</span></label>
                      <input name="shippingPhone" type="tel" placeholder="01700000000"
                        value={form.shippingPhone} onChange={handleChange}
                        className={`input-field ${errors.shippingPhone ? "border-red-400" : ""}`} />
                      {errors.shippingPhone && <p className="text-red-500 text-xs mt-1">{errors.shippingPhone}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" /> Order Notes (optional)
                    </label>
                    <textarea name="notes" rows={3} placeholder="Preferred delivery time, special instructions..."
                      value={form.notes} onChange={handleChange} className="input-field resize-none" />
                  </div>
                </div>
              </div>

              <div className="bg-brand-50 rounded-xl border border-brand-100 p-4 flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div className="text-sm text-brand-800">
                  <p className="font-semibold">Cash on Delivery</p>
                  <p className="text-brand-600 mt-0.5">Pay in cash when your medicines arrive at your door.</p>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base gap-2" style={{ fontFamily: "var(--font-sora)" }}>
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                Place Order — {formatPrice(totalPrice)}
              </button>
            </form>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit sticky top-24">
              <h2 className="font-bold text-lg text-gray-900 mb-5" style={{ fontFamily: "var(--font-sora)" }}>
                Order Summary ({items.length} items)
              </h2>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                    <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-100 pt-4">
                <div className="flex justify-between font-bold text-xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>
                  <span>Total</span>
                  <span className="text-brand-700">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
