"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Skeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { Package, ClipboardList, AlertCircle, ArrowRight, LayoutDashboard } from "lucide-react";

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats]   = useState({ totalMedicines: 0, totalOrders: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/seller/dashboard")
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "My Medicines", value: stats.totalMedicines, icon: Package,       color: "from-brand-50 to-brand-100 text-brand-700",    link: "/seller/medicines" },
    { label: "Total Orders",  value: stats.totalOrders,   icon: ClipboardList,  color: "from-blue-50 to-blue-100 text-blue-700",       link: "/seller/orders" },
    { label: "Out of Stock",  value: stats.outOfStock,    icon: AlertCircle,    color: "from-red-50 to-red-100 text-red-600",           link: "/seller/medicines" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="page-container py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-brand-600 text-sm font-semibold mb-1">
              <LayoutDashboard className="w-4 h-4" /> Seller Dashboard
            </div>
            <h1 className="font-bold text-3xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>
              Welcome, {user?.name.split(" ")[0]}! 👋
            </h1>
            <p className="text-gray-500 mt-1">Here's an overview of your store</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {cards.map((c) => (
              <Link key={c.label} href={c.link}>
                <div className={`bg-gradient-to-br ${c.color} rounded-2xl p-6 border border-white/60 hover:shadow-md transition-shadow group`}>
                  <div className="flex items-center justify-between mb-4">
                    <c.icon className="w-7 h-7 opacity-80" />
                    <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-80 group-hover:translate-x-1 transition-all" />
                  </div>
                  {loading
                    ? <Skeleton className="h-9 w-16 mb-1" />
                    : <div className="font-bold text-4xl mb-1" style={{ fontFamily: "var(--font-sora)" }}>{c.value}</div>
                  }
                  <div className="text-sm font-semibold">{c.label}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-lg text-gray-900 mb-4" style={{ fontFamily: "var(--font-sora)" }}>Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/seller/medicines" className="btn-primary gap-2 text-sm">
                <Package className="w-4 h-4" /> Manage Medicines
              </Link>
              <Link href="/seller/orders" className="btn-outline gap-2 text-sm">
                <ClipboardList className="w-4 h-4" /> View Orders
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
