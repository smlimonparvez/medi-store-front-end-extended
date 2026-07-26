"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { Category } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Loader2, Tag, Save, LayoutDashboard, Package, ClipboardList, Users } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";

const ADMIN_NAV = [
  { label: "Dashboard",  href: "/admin",           icon: LayoutDashboard },
  { label: "Users",      href: "/admin/users",      icon: Users },
  { label: "Medicines",  href: "/admin/medicines",  icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Orders",     href: "/admin/orders",     icon: ClipboardList },
];

const schema = z.object({ name: z.string().min(2, "Name must be at least 2 characters").max(50) });

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState<Category | null>(null);
  const [name,       setName]       = useState("");
  const [nameError,  setNameError]  = useState("");
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState<number | null>(null);

  const fetchCategories = () => {
    setLoading(true);
    api.get("/categories")
      .then((r) => setCategories(r.data.data || []))
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd  = () => { setEditing(null); setName(""); setNameError(""); setModalOpen(true); };
  const openEdit = (cat: Category) => { setEditing(cat); setName(cat.name); setNameError(""); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); setName(""); setNameError(""); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");
    const result = schema.safeParse({ name });
    if (!result.success) { setNameError(result.error.issues[0]?.message || "Invalid"); return; }
    setSaving(true);
    try {
      if (editing) { await api.put(`/categories/${editing.id}`, { name }); toast.success("Category updated!"); }
      else         { await api.post("/categories", { name }); toast.success("Category created!"); }
      closeModal(); fetchCategories();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSaving(false); }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete "${cat.name}"?`)) return;
    setDeleting(cat.id);
    try { await api.delete(`/categories/${cat.id}`); toast.success("Deleted"); fetchCategories(); }
    catch (err) { toast.error(getErrorMessage(err)); }
    finally { setDeleting(null); }
  };

  return (
    <DashboardLayout navItems={ADMIN_NAV} title="Admin Panel" role="admin">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-2xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>Categories</h1>
            <p className="text-gray-500 text-sm mt-0.5">{categories.length} categories</p>
          </div>
          <button onClick={openAdd} className="btn-primary gap-2"><Plus className="w-4 h-4" />Add Category</button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {["#", "Name", "Slug", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={4} className="px-5 py-4"><Skeleton className="h-5 w-full" /></td></tr>
                  ))
                ) : categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 text-gray-400 text-xs">{cat.id}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900">{cat.name}</td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs">{cat.slug}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(cat)} className="p-2 rounded-xl hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(cat)} disabled={deleting === cat.id} className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40">
                          {deleting === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>{editing ? "Edit Category" : "New Category"}</h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Name <span className="text-red-400">*</span></label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Pain Relief" className={`input-field ${nameError ? "border-red-400" : ""}`} />
                {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={closeModal} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editing ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
