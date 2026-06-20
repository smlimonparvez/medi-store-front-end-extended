"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Skeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { Users, Package, ClipboardList, ShoppingBag, ArrowRight, LayoutDashboard } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0, totalCustomers: 0, totalSellers: 0,
    totalMedicines: 0, totalOrders: 0, pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Users",     value: stats.totalUsers,     sub: `${stats.totalCustomers} customers · ${stats.totalSellers} sellers`, icon: Users,         color: "from-brand-50 to-brand-100 text-brand-700",   link: "/admin/users" },
    { label: "Total Medicines", value: stats.totalMedicines, sub: "Listed by all sellers",                                              icon: Package,       color: "from-cyan-50 to-cyan-100 text-cyan-700",       link: "/admin/users" },
    { label: "Total Orders",    value: stats.totalOrders,    sub: `${stats.pendingOrders} pending`,                                     icon: ClipboardList, color: "from-blue-50 to-blue-100 text-blue-700",       link: "/admin/orders" },
    { label: "Pending Orders",  value: stats.pendingOrders,  sub: "Awaiting processing",                                               icon: ShoppingBag,   color: "from-orange-50 to-orange-100 text-orange-600", link: "/admin/orders" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="page-container py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-brand-600 text-sm font-semibold mb-1">
              <LayoutDashboard className="w-4 h-4" /> Admin Panel
            </div>
            <h1 className="font-bold text-3xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">MediStore platform overview</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {cards.map((c) => (
              <Link key={c.label} href={c.link}>
                <div className={`bg-gradient-to-br ${c.color} rounded-2xl p-6 border border-white/60 hover:shadow-md transition-shadow group`}>
                  <div className="flex items-center justify-between mb-4">
                    <c.icon className="w-7 h-7 opacity-80" />
                    <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-80 group-hover:translate-x-1 transition-all" />
                  </div>
                  {loading
                    ? <Skeleton className="h-10 w-16 mb-1" />
                    : <div className="font-bold text-4xl mb-1" style={{ fontFamily: "var(--font-sora)" }}>{c.value}</div>
                  }
                  <div className="font-semibold text-sm">{c.label}</div>
                  <div className="text-xs opacity-60 mt-0.5">{c.sub}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-lg text-gray-900 mb-4" style={{ fontFamily: "var(--font-sora)" }}>Admin Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/users"      className="btn-primary text-sm gap-2"><Users className="w-4 h-4" />Manage Users</Link>
              <Link href="/admin/orders"     className="btn-outline text-sm gap-2"><ClipboardList className="w-4 h-4" />All Orders</Link>
              <Link href="/admin/categories" className="btn-outline text-sm gap-2"><Package className="w-4 h-4" />Categories</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
