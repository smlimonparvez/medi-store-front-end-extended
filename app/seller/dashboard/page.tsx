"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { Order, OrderStatus } from "@/types";
import { formatPrice, formatDate, getErrorMessage } from "@/lib/utils";
import { Package, ClipboardList, AlertCircle, LayoutDashboard, TrendingUp, Loader2 } from "lucide-react";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import toast from "react-hot-toast";

const SELLER_NAV = [
  { label: "Dashboard",  href: "/seller/dashboard", icon: LayoutDashboard },
  { label: "Medicines",  href: "/seller/medicines",  icon: Package },
  { label: "Orders",     href: "/seller/orders",     icon: ClipboardList },
];

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  placed: "processing", processing: "shipped", shipped: "delivered",
};
const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  placed: "Mark Processing", processing: "Mark Shipped", shipped: "Mark Delivered",
};

const STATUS_COLORS = ["#2563eb", "#f59e0b", "#8b5cf6", "#10b981", "#ef4444"];

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [stats,    setStats]    = useState({ totalMedicines: 0, totalOrders: 0, outOfStock: 0, totalRevenue: 0 });
  const [orders,   setOrders]   = useState<any[]>([]);
  const [updating, setUpdating] = useState<number | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/seller/dashboard"),
      api.get("/seller/orders"),
    ])
      .then(([statsRes, ordersRes]) => {
        setStats(statsRes.data.data);
        setOrders((ordersRes.data.data || []).slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (orderId: number, status: OrderStatus) => {
    setUpdating(orderId);
    try {
      await api.patch(`/seller/orders/${orderId}`, { status });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toast.success(`Order marked as ${status}`);
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setUpdating(null); }
  };

  const cards = [
    { label: "My Medicines", value: stats.totalMedicines, icon: Package,     color: "bg-brand-50 text-brand-700 border-brand-100",   link: "/seller/medicines" },
    { label: "Total Orders",  value: stats.totalOrders,   icon: ClipboardList, color: "bg-blue-50 text-blue-700 border-blue-100",     link: "/seller/orders" },
    { label: "Out of Stock",  value: stats.outOfStock,    icon: AlertCircle,  color: "bg-red-50 text-red-600 border-red-100",         link: "/seller/medicines" },
  ];

  const statusData = ["placed", "processing", "shipped", "delivered", "cancelled"].map((s) => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: orders.filter((o) => o.status === s).length,
  }));

  const stockData = [
    { name: "In Stock",     value: stats.totalMedicines - stats.outOfStock },
    { name: "Out of Stock", value: stats.outOfStock },
  ].filter((d) => d.value > 0);

  return (
    <DashboardLayout navItems={SELLER_NAV} title="Seller Dashboard" role="seller">
      <div className="space-y-6">
        <div>
          <h1 className="font-bold text-2xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>
            Welcome, {user?.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's your store overview for today.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              </div>
            </Link>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: "var(--font-sora)" }}>Recent Order Statuses</h2>
            {loading ? <Skeleton className="h-48 w-full" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={statusData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: "var(--font-sora)" }}>Stock Overview</h2>
            {loading ? <Skeleton className="h-48 w-full" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={stockData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                    {stockData.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800" style={{ fontFamily: "var(--font-sora)" }}>Recent Orders</h2>
            <Link href="/seller/orders" className="text-brand-600 text-sm font-medium hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-gray-400"><ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>No orders yet</p></div>
          ) : (
            <div className="divide-y divide-gray-50">
              {orders.map((order) => (
                <div key={order.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900 text-sm">#{order.id}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(order.createdAt)} · {order.customer?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-brand-700 text-sm">{formatPrice(order.totalAmount)}</span>
                    {NEXT[order.status as OrderStatus] && (
                      <button onClick={() => handleUpdate(order.id, NEXT[order.status as OrderStatus]!)}
                        disabled={updating === order.id}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors disabled:opacity-40 flex items-center gap-1">
                        {updating === order.id && <Loader2 className="w-3 h-3 animate-spin" />}
                        {NEXT_LABEL[order.status as OrderStatus]}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-3" style={{ fontFamily: "var(--font-sora)" }}>Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/seller/medicines" className="btn-primary gap-2 text-sm py-2"><Package className="w-4 h-4" />Manage Medicines</Link>
            <Link href="/seller/orders" className="btn-outline gap-2 text-sm py-2"><ClipboardList className="w-4 h-4" />View All Orders</Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
