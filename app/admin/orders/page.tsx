"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { ClipboardList, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [meta,    setMeta]    = useState({ total: 0, totalPages: 1 });

  useEffect(() => {
    setLoading(true);
    api
      .get("/admin/orders", { params: { page, limit: 15 } })
      .then((r) => {
        setOrders(r.data.data?.orders || []);
        setMeta(r.data.data?.meta || { total: 0, totalPages: 1 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="page-container py-8">
          <div className="mb-8">
            <h1
              className="font-bold text-3xl text-gray-900"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              All Orders
            </h1>
            <p className="text-gray-500 mt-1">{meta.total} total orders on the platform</p>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <TableRowSkeleton key={i} cols={6} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-32">
              <ClipboardList className="w-16 h-16 text-brand-100 mx-auto mb-4" />
              <p className="text-gray-500">No orders yet</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/70">
                        {["Order", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                          <th
                            key={h}
                            className="text-left px-5 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-5 py-4 font-semibold text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-800">
                              {order.customer?.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {order.customer?.email}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-gray-500">
                            {order.orderItems.length} item
                            {order.orderItems.length !== 1 ? "s" : ""}
                          </td>
                          <td className="px-5 py-4 font-semibold text-brand-700">
                            {formatPrice(order.totalAmount)}
                          </td>
                          <td className="px-5 py-4">
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td className="px-5 py-4 text-gray-400 text-xs">
                            {formatDate(order.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:border-brand-400 disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-600">
                    Page {page} of {meta.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page === meta.totalPages}
                    className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:border-brand-400 disabled:opacity-40 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
