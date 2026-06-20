"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { User } from "@/types";
import { formatDate, getErrorMessage } from "@/lib/utils";
import { Loader2, ShieldOff, ShieldCheck, Users } from "lucide-react";
import toast from "react-hot-toast";

type FilterRole = "all" | "customer" | "seller";

export default function AdminUsersPage() {
  const [users,    setUsers]    = useState<User[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState<FilterRole>("all");
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filter !== "all") params.role = filter;
      const res = await api.get("/admin/users", { params });
      setUsers(res.data.data?.users || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [filter]);

  const toggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "banned" : "active";
    if (!confirm(`${newStatus === "banned" ? "Ban" : "Unban"} ${user.name}?`)) return;
    setUpdating(user.id);
    try {
      await api.patch(`/admin/users/${user.id}`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
      toast.success(`User ${newStatus === "banned" ? "banned" : "unbanned"}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="page-container py-8">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-bold text-3xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>
                Manage Users
              </h1>
              <p className="text-gray-500 mt-1">{users.length} users found</p>
            </div>

            {/* Role filter tabs */}
            <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
              {(["all", "customer", "seller"] as FilterRole[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                    filter === f
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TableRowSkeleton key={i} cols={5} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-32">
              <Users className="w-16 h-16 text-brand-100 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      {["User", "Role", "Status", "Phone", "Joined", "Action"].map((h) => (
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
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        {/* User */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700 text-sm shrink-0">
                              {user.name[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">
                          <span
                            className={`badge capitalize ${
                              user.role === "seller"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-brand-50 text-brand-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`badge ${
                              user.status === "active"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-500"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        {/* Phone */}
                        <td className="px-5 py-4 text-gray-500 text-xs">
                          {user.phone || "—"}
                        </td>

                        {/* Joined */}
                        <td className="px-5 py-4 text-gray-400 text-xs">
                          {formatDate(user.createdAt)}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => toggleStatus(user)}
                            disabled={updating === user.id}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                              user.status === "active"
                                ? "bg-red-50 text-red-500 hover:bg-red-100"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                            } disabled:opacity-40`}
                          >
                            {updating === user.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : user.status === "active" ? (
                              <>
                                <ShieldOff className="w-3.5 h-3.5" /> Ban
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-3.5 h-3.5" /> Unban
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
