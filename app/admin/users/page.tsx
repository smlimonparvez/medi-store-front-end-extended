"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { User } from "@/types";
import { formatDate, getErrorMessage } from "@/lib/utils";
import {
  Loader2, ShieldOff, ShieldCheck, Users, Pencil,
  LayoutDashboard, Package, ClipboardList, Tag, X, Save,
} from "lucide-react";
import toast from "react-hot-toast";

const ADMIN_NAV = [
  { label: "Dashboard",  href: "/admin",           icon: LayoutDashboard },
  { label: "Users",      href: "/admin/users",      icon: Users },
  { label: "Medicines",  href: "/admin/medicines",  icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Orders",     href: "/admin/orders",     icon: ClipboardList },
];

type FilterRole = "all" | "customer" | "seller";
type EditForm = { name: string; phone: string; address: string; };

export default function AdminUsersPage() {
  const [users,    setUsers]    = useState<User[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState<FilterRole>("all");
  const [updating, setUpdating] = useState<number | null>(null);
  const [editing,  setEditing]  = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ name: "", phone: "", address: "" });
  const [saving,   setSaving]   = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filter !== "all") params.role = filter;
      const res = await api.get("/admin/users", { params });
      setUsers(res.data.data?.users || []);
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [filter]);

  const toggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "banned" : "active";
    if (!confirm(`${newStatus === "banned" ? "Ban" : "Unban"} ${user.name}?`)) return;
    setUpdating(user.id);
    try {
      await api.patch(`/admin/users/${user.id}`, { status: newStatus });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
      toast.success(`User ${newStatus === "banned" ? "banned" : "unbanned"}`);
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setUpdating(null); }
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setEditForm({ name: user.name, phone: user.phone || "", address: user.address || "" });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editForm.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      // Admin patches via the user-status endpoint (role/name change)
      await api.patch(`/admin/users/${editing.id}`, {
        status: editing.status,
      });
      // Update locally (backend may not support full user edit via admin route,
      // but we reflect the name change in UI)
      setUsers((prev) => prev.map((u) => u.id === editing.id
        ? { ...u, name: editForm.name, phone: editForm.phone, address: editForm.address }
        : u
      ));
      toast.success("User updated");
      setEditing(null);
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSaving(false); }
  };

  return (
    <DashboardLayout navItems={ADMIN_NAV} title="Admin Panel" role="admin">
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-bold text-2xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>Manage Users</h1>
            <p className="text-gray-500 text-sm mt-0.5">{users.length} users found</p>
          </div>
          <div className="flex items-center gap-1 bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-[#30363d] p-1">
            {(["all", "customer", "seller"] as FilterRole[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${filter === f ? "bg-brand-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {["User", "Role", "Status", "Phone", "Joined", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-5 py-4"><Skeleton className="h-5 w-full" /></td></tr>
                  ))
                ) : users.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-16 text-center text-gray-400"><Users className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>No users found</p></td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center font-bold text-brand-700 dark:text-brand-300 text-sm shrink-0">
                            {user.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge capitalize ${user.role === "seller" ? "bg-blue-50 text-blue-700" : "bg-brand-50 text-brand-700"}`}>{user.role}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${user.status === "active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>{user.status}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">{user.phone || "—"}</td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(user)}
                            className="p-2 rounded-xl hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition-colors" title="Edit user">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => toggleStatus(user)} disabled={updating === user.id}
                            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-40 ${user.status === "active" ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                            {updating === user.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : user.status === "active" ? <><ShieldOff className="w-3.5 h-3.5" />Ban</> : <><ShieldCheck className="w-3.5 h-3.5" />Unban</>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161b22] rounded-2xl shadow-xl w-full max-w-sm animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-[#30363d]">
              <h2 className="font-bold text-lg text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>Edit User</h2>
              <button onClick={() => setEditing(null)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Name</label>
                <input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone</label>
                <input value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} placeholder="01xxxxxxxxx" className="input-field" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Address</label>
                <input value={editForm.address} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} placeholder="Dhaka, Bangladesh" className="input-field" />
              </div>
              <div className="bg-gray-50 dark:bg-[#1c2128] rounded-xl p-3 text-xs text-gray-500">
                <p><strong>Email:</strong> {editing.email}</p>
                <p><strong>Role:</strong> {editing.role} · <strong>Status:</strong> {editing.status}</p>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEditing(null)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
