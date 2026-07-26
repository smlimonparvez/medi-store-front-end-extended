"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { Medicine, Category } from "@/types";
import { formatPrice, getErrorMessage } from "@/lib/utils";
import {
  Package, Search, ChevronLeft, ChevronRight, ExternalLink,
  LayoutDashboard, Users, Tag, ClipboardList, Pencil, Trash2,
  Loader2, X, Save, ImageIcon, Plus
} from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";

const ADMIN_NAV = [
  { label: "Dashboard",  href: "/admin",           icon: LayoutDashboard },
  { label: "Users",      href: "/admin/users",      icon: Users },
  { label: "Medicines",  href: "/admin/medicines",  icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Orders",     href: "/admin/orders",     icon: ClipboardList },
];

type FormData = { 
  name: string; 
  description: string; 
  price: string; 
  stock: string; 
  image: string; 
  manufacturer: string; 
  categoryId: string; 
};

const EMPTY: FormData = { 
  name: "", 
  description: "", 
  price: "", 
  stock: "0", 
  image: "", 
  manufacturer: "", 
  categoryId: "" 
};

const schema = z.object({
  name:       z.string().min(2, "Name is required"),
  description: z.string().optional(),
  price:      z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Price must be positive"),
  stock:      z.string().refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Stock must be 0 or more"),
  image:      z.string().optional(),
  manufacturer: z.string().optional(),
  categoryId: z.string().min(1, "Please select a category"),
});

export default function AdminMedicinesPage() {
  const [medicines,  setMedicines]  = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);
  const [meta,       setMeta]       = useState({ total: 0, page: 1, totalPages: 1 });
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState<Medicine | null>(null);
  const [form,       setForm]       = useState<FormData>(EMPTY);
  const [saving,     setSaving]     = useState(false);
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [deleting,   setDeleting]   = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "15" };
      if (search) params.search = search;
      const [mRes, cRes] = await Promise.all([
        api.get("/medicines", { params }),
        api.get("/categories"),
      ]);
      setMedicines(mRes.data.data?.medicines || mRes.data.data || []);
      setMeta(mRes.data.data?.meta || { total: 0, page: 1, totalPages: 1 });
      setCategories(cRes.data.data || []);
    } catch { setMedicines([]); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); }, [search]);

  const openEditModal = (m: Medicine) => {
    setEditing(m);
    setForm({
      name: m.name,
      description: m.description || "",
      price: String(m.price),
      stock: String(m.stock),
      image: m.image || "",
      manufacturer: m.manufacturer || "",
      categoryId: String(m.categoryId),
    });
    setErrors({});
    setModalOpen(true);
  };

  const openAddModal = () => {
    setEditing(null);
    setForm(EMPTY);
    setErrors({});
    setModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = schema.safeParse(form);
    if (!result.success) { 
      const errs: Record<string, string> = {}; 
      result.error.issues.forEach((e) => { 
        if (e.path[0]) errs[e.path[0] as string] = e.message; 
      }); 
      setErrors(errs); 
      return; 
    }
    
    setSaving(true);
    try {
      const payload = { 
        name: form.name, 
        description: form.description || undefined, 
        price: parseFloat(form.price), 
        stock: parseInt(form.stock), 
        image: form.image || undefined, 
        manufacturer: form.manufacturer || undefined, 
        categoryId: parseInt(form.categoryId) 
      };
      
      if (editing) { 
        await api.put(`/medicines/${editing.id}`, payload); 
        toast.success("Medicine updated!"); 
      } else {
        // For admin, we might need to specify a seller or use a different endpoint
        // If admin can add medicines, they might need to assign to a seller
        await api.post("/medicines", payload); 
        toast.success("Medicine added!");
      }
      setModalOpen(false);
      setEditing(null);
      fetchData();
    } catch (err) { 
      toast.error(getErrorMessage(err)); 
    }
    finally { setSaving(false); }
  };

  const handleDelete = async (m: Medicine) => {
    if (!confirm(`Delete "${m.name}"? This cannot be undone.`)) return;
    setDeleting(m.id);
    try {
      await api.delete(`/medicines/${m.id}`);
      toast.success("Medicine deleted");
      setMedicines((prev) => prev.filter((x) => x.id !== m.id));
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setDeleting(null); }
  };

  return (
    <DashboardLayout navItems={ADMIN_NAV} title="Admin Panel" role="admin">
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-bold text-2xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>All Medicines</h1>
            <p className="text-gray-500 text-sm mt-0.5">{meta.total} medicines listed across all sellers</p>
          </div>
          <div className="flex gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search medicines..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 bg-white dark:bg-[#1c2128] dark:border-[#30363d] dark:text-gray-200" />
            </div>
            <button onClick={openAddModal} className="btn-primary gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" />Add Medicine
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["Medicine", "Category", "Seller", "Price", "Stock", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-5 py-3"><Skeleton className="h-5 w-full" /></td></tr>
                  ))
                ) : medicines.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No medicines found.</td></tr>
                ) : (
                  medicines.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                            {m.image ? <img src={m.image} alt={m.name} className="w-full h-full object-cover" /> : <Package className="w-4 h-4 text-gray-400" />}
                          </div>
                          <span className="font-medium text-gray-900">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{m.category?.name || "—"}</td>
                      <td className="px-5 py-3 text-gray-500">{m.seller?.name || "—"}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{formatPrice(m.price)}</td>
                      <td className="px-5 py-3">
                        <span className={m.stock > 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                          {m.stock > 0 ? `${m.stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/shop/${m.id}`} target="_blank"
                            className="p-2 rounded-xl hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition-colors" title="View in shop">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button onClick={() => openEditModal(m)}
                            className="p-2 rounded-xl hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(m)} disabled={deleting === m.id}
                            className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40" title="Delete">
                            {deleting === m.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!loading && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
              <p className="text-xs text-gray-400">Page {meta.page} of {meta.totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page >= meta.totalPages} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Edit/Add Modal - Same as seller page */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>
                {editing ? "Edit Medicine" : "Add New Medicine"}
              </h2>
              <button onClick={() => { setModalOpen(false); setEditing(null); }} className="p-2 rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4" noValidate>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  Name <span className="text-red-400">*</span>
                </label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="e.g. Napa 500mg" 
                  className={`input-field ${errors.name ? "border-red-400" : ""}`} 
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  rows={3} 
                  placeholder="What is this medicine used for?" 
                  className="input-field resize-none" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                    Price (৳) <span className="text-red-400">*</span>
                  </label>
                  <input 
                    name="price" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={form.price} 
                    onChange={handleChange} 
                    placeholder="0.00" 
                    className={`input-field ${errors.price ? "border-red-400" : ""}`} 
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                    Stock <span className="text-red-400">*</span>
                  </label>
                  <input 
                    name="stock" 
                    type="number" 
                    min="0" 
                    value={form.stock} 
                    onChange={handleChange} 
                    className={`input-field ${errors.stock ? "border-red-400" : ""}`} 
                  />
                  {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  Category <span className="text-red-400">*</span>
                </label>
                <select 
                  name="categoryId" 
                  value={form.categoryId} 
                  onChange={handleChange} 
                  className={`input-field ${errors.categoryId ? "border-red-400" : ""}`}
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Manufacturer</label>
                <input 
                  name="manufacturer" 
                  value={form.manufacturer} 
                  onChange={handleChange} 
                  placeholder="e.g. Beximco Pharma" 
                  className="input-field" 
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />Image URL
                </label>
                <input 
                  name="image" 
                  value={form.image} 
                  onChange={handleChange} 
                  placeholder="https://example.com/image.jpg" 
                  className="input-field" 
                />
                {form.image && (
                  <img 
                    src={form.image} 
                    alt="preview" 
                    className="mt-2 h-20 w-20 rounded-xl object-cover border border-gray-100" 
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} 
                  />
                )}
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => { setModalOpen(false); setEditing(null); }} 
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="btn-primary flex-1 gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editing ? "Save Changes" : "Add Medicine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}