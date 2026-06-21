"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { CheckCircle2, Package, Loader2 } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Give Stripe webhook a moment to process before showing the page
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50/50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Confirming your payment...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center max-w-md px-4 animate-fade-in">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>

          <h1
            className="font-bold text-3xl text-gray-900 mb-3"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Payment Successful! 🎉
          </h1>

          <p className="text-gray-500 mb-2">
            Your payment was completed successfully via Stripe.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Your order has been confirmed and is now being processed by the seller.
          </p>

          {sessionId && (
            <p className="text-xs text-gray-300 font-mono mb-6 break-all">
              Session: {sessionId.slice(0, 24)}...
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/orders" className="btn-primary gap-2">
              <Package className="w-4 h-4" /> Track My Order
            </Link>
            <Link href="/shop" className="btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
