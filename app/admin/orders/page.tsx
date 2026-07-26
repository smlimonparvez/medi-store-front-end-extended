"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { ClipboardList, ChevronLeft, ChevronRight, LayoutDashboard, Package, Users, Tag } from "lucide-react";

const ADMIN_NAV = [
  { label: "Dashboard",  href: "/admin",           icon: LayoutDashboard },
  { label: "Users",      href: "/admin/users",      icon: Users },
  { label: "Medicines",  href: "/admin/medicines",  icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Orders",     href: "/admin/orders",     icon: ClipboardList },
];

export default function AdminOrdersPage() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [meta,    setMeta]    = useState({ total: 0, totalPages: 1 });

  useEffect(() => {
    setLoading(true);
    api.get("/admin/orders", { params: { page, limit: 15 } })
      .then((r) => { setOrders(r.data.data?.orders || []); setMeta(r.data.data?.meta || { total: 0, totalPages: 1 }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <DashboardLayout navItems={ADMIN_NAV} title="Admin Panel" role="admin">
      <div className="space-y-5">
        <div>
          <h1 className="font-bold text-2xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>All Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">{meta.total} total orders on the platform</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {["Order", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-5 py-3"><Skeleton className="h-5 w-full" /></td></tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-16 text-center text-gray-400"><ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>No orders yet</p></td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-gray-900">#{order.id}</td>
                      <td className="px-5 py-4"><p className="font-medium text-gray-800">{order.customer?.name}</p><p className="text-xs text-gray-400">{order.customer?.email}</p></td>
                      <td className="px-5 py-4 text-gray-500">{order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}</td>
                      <td className="px-5 py-4 font-semibold text-brand-700">{formatPrice(order.totalAmount)}</td>
                      <td className="px-5 py-4"><OrderStatusBadge status={order.status} /></td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!loading && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
              <p className="text-xs text-gray-400">Page {page} of {meta.totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page >= meta.totalPages} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
