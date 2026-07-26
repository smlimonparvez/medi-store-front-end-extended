"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { formatPrice, formatDate } from "@/lib/utils";
import { Order } from "@/types";
import {
  Users, Package, ClipboardList, ShoppingBag,
  TrendingUp, Tag, LayoutDashboard,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";

const ADMIN_NAV = [
  { label: "Dashboard",  href: "/admin",             icon: LayoutDashboard },
  { label: "Users",      href: "/admin/users",        icon: Users },
  { label: "Medicines",  href: "/admin/medicines",    icon: Package },
  { label: "Categories", href: "/admin/categories",   icon: Tag },
  { label: "Orders",     href: "/admin/orders",       icon: ClipboardList },
];

const PIE_COLORS = ["#0d9488", "#2563eb", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0, totalCustomers: 0, totalSellers: 0,
    totalMedicines: 0, totalOrders: 0, pendingOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/dashboard"),
      api.get("/admin/orders", { params: { page: 1, limit: 5 } }),
    ])
      .then(([statsRes, ordersRes]) => {
        setStats(statsRes.data.data);
        setRecentOrders(ordersRes.data.data?.orders || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Users",     value: stats.totalUsers,     sub: `${stats.totalCustomers} customers · ${stats.totalSellers} sellers`, icon: Users,         color: "bg-brand-50 text-brand-700 border-brand-100",  link: "/admin/users" },
    { label: "Total Medicines", value: stats.totalMedicines, sub: "Across all sellers",                                                 icon: Package,       color: "bg-blue-50 text-blue-700 border-blue-100",    link: "/admin/medicines" },
    { label: "Total Orders",    value: stats.totalOrders,    sub: `${stats.pendingOrders} pending`,                                     icon: ClipboardList, color: "bg-purple-50 text-purple-700 border-purple-100", link: "/admin/orders" },
    { label: "Pending Orders",  value: stats.pendingOrders,  sub: "Awaiting action",                                                    icon: ShoppingBag,   color: "bg-orange-50 text-orange-600 border-orange-100", link: "/admin/orders" },
  ];

  const userChartData = [
    { name: "Customers", value: stats.totalCustomers },
    { name: "Sellers",   value: stats.totalSellers },
    { name: "Admins",    value: stats.totalUsers - stats.totalCustomers - stats.totalSellers },
  ].filter((d) => d.value > 0);

  const orderChartData = [
    { name: "Placed",     value: 0 },
    { name: "Processing", value: 0 },
    { name: "Shipped",    value: 0 },
    { name: "Delivered",  value: 0 },
    { name: "Cancelled",  value: 0 },
  ];
  recentOrders.forEach((o) => {
    const idx = orderChartData.findIndex((d) => d.name.toLowerCase() === o.status);
    if (idx > -1) orderChartData[idx].value++;
  });

  return (
    <DashboardLayout navItems={ADMIN_NAV} title="Admin Panel" role="admin">
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="font-bold text-2xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, Admin. Here's what's happening today.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((c) => (
            <Link key={c.label} href={c.link}>
              <div className={`border rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer ${c.color}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center">
                    <c.icon className="w-5 h-5" />
                  </div>
                  <TrendingUp className="w-4 h-4 opacity-40" />
                </div>
                {loading
                  ? <Skeleton className="h-9 w-16 mb-1" />
                  : <div className="font-bold text-3xl mb-1" style={{ fontFamily: "var(--font-sora)" }}>{c.value}</div>
                }
                <div className="font-semibold text-sm">{c.label}</div>
                <div className="text-xs opacity-60 mt-0.5">{c.sub}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User breakdown pie */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: "var(--font-sora)" }}>
              User Breakdown
            </h2>
            {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={userChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                    {userChartData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Order status bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: "var(--font-sora)" }}>
              Recent Order Statuses
            </h2>
            {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={orderChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0d9488" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent orders table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800" style={{ fontFamily: "var(--font-sora)" }}>Recent Orders</h2>
            <Link href="/admin/orders" className="text-brand-600 text-sm font-medium hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  {["Order", "Customer", "Total", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="px-5 py-3"><Skeleton className="h-5 w-full" /></td></tr>
                  ))
                ) : recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">No orders yet</td></tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-gray-900">#{order.id}</td>
                      <td className="px-5 py-3 text-gray-600">{order.customer?.name}</td>
                      <td className="px-5 py-3 font-medium text-brand-700">{formatPrice(order.totalAmount)}</td>
                      <td className="px-5 py-3"><OrderStatusBadge status={order.status} /></td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-3" style={{ fontFamily: "var(--font-sora)" }}>Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/users"      className="btn-primary text-sm gap-2 py-2"><Users className="w-4 h-4" />Manage Users</Link>
            <Link href="/admin/orders"     className="btn-outline text-sm gap-2 py-2"><ClipboardList className="w-4 h-4" />All Orders</Link>
            <Link href="/admin/categories" className="btn-outline text-sm gap-2 py-2"><Tag className="w-4 h-4" />Categories</Link>
            <Link href="/admin/medicines"  className="btn-outline text-sm gap-2 py-2"><Package className="w-4 h-4" />All Medicines</Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
