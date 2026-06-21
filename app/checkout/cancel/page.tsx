"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/utils";
import { XCircle, ShoppingCart, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

function CheckoutCancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const handleCancelOrder = async () => {
    if (!orderId) return;
    setCancelling(true);
    try {
      await api.delete(`/payments/cancel/${orderId}`);
      setCancelled(true);
      toast.success("Order cancelled and stock restored.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center max-w-md px-4 animate-fade-in">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>

          <h1
            className="font-bold text-3xl text-gray-900 mb-3"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Payment Cancelled
          </h1>

          {cancelled ? (
            <>
              <p className="text-gray-500 mb-8">
                Your order has been cancelled and stock has been restored. No payment was taken.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/shop" className="btn-primary gap-2">
                  <ShoppingCart className="w-4 h-4" /> Back to Shop
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-500 mb-2">
                You cancelled the payment. Your order is still pending.
              </p>
              <p className="text-gray-400 text-sm mb-8">
                You can go back and try again, or cancel the order to restore stock.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => router.back()}
                  className="btn-primary gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Try Again
                </button>

                {orderId && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="btn-outline gap-2 text-red-500 border-red-200 hover:bg-red-50"
                  >
                    {cancelling
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <XCircle className="w-4 h-4" />}
                    Cancel Order
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutCancelContent />
    </Suspense>
  );
}
