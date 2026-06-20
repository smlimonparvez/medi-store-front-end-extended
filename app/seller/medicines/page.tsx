"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { Medicine, Category } from "@/types";
import { formatPrice, getErrorMessage } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Loader2, Package, Save, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";

type FormData = {
  name: string; description: string; price: string; stock: string;
  image: string; manufacturer: string; categoryId: string;
};
const EMPTY: FormData = { name: "", description: "", price: "", stock: "0", image: "", manufacturer: "", categoryId: "" };

const schema = z.object({
  name:       z.string().min(2, "Name is required"),
  price:      z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Price must be positive"),
  stock:      z.string().refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Stock must be 0 or more"),
  categoryId: z.string().min(1, "Please select a category"),
});

function MedicineModal({ open, onClose, onSave, initial, categories }: {
  open: boolean; onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  initial?: FormData; categories: Category[];
}) {
  const [form, setForm]   = useState<FormData>(initial || EMPTY);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { setForm(initial || EMPTY); setErrors({}); }, [initial, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((e) => { if (e.path[0]) errs[e.path[0] as string] = e.message; });
      setErrors(errs);
      return;
    }
    setSaving(true);
    try { await onSave(form); onClose(); }
    catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSaving(false); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>
            {initial ? "Edit Medicine" : "Add New Medicine"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Name <span className="text-red-400">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Napa 500mg"
              className={`input-field ${errors.name ? "border-red-400" : ""}`} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="What is this medicine used for?" className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Price (৳) <span className="text-red-400">*</span></label>
              <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange}
                placeholder="0.00" className={`input-field ${errors.price ? "border-red-400" : ""}`} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Stock <span className="text-red-400">*</span></label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange}
                className={`input-field ${errors.stock ? "border-red-400" : ""}`} />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Category <span className="text-red-400">*</span></label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange}
              className={`input-field ${errors.categoryId ? "border-red-400" : ""}`}>
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Manufacturer</label>
            <input name="manufacturer" value={form.manufacturer} onChange={handleChange}
              placeholder="e.g. Beximco Pharma" className="input-field" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" /> Image URL
            </label>
            <input name="image" value={form.image} onChange={handleChange}
              placeholder="https://example.com/image.jpg" className="input-field" />
            {form.image && (
              <img src={form.image} alt="preview" className="mt-2 h-20 w-20 rounded-xl object-cover border border-gray-100" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {initial ? "Save Changes" : "Add Medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SellerMedicinesPage() {
  const [medicines,  setMedicines]  = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState<Medicine | null>(null);
  const [deleting,   setDeleting]   = useState<number | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [mRes, cRes] = await Promise.all([api.get("/seller/medicines"), api.get("/categories")]);
      setMedicines(mRes.data.data || []);
      setCategories(cRes.data.data || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSave = async (form: FormData) => {
    const payload = {
      name: form.name, description: form.description || undefined,
      price: parseFloat(form.price), stock: parseInt(form.stock),
      image: form.image || undefined, manufacturer: form.manufacturer || undefined,
      categoryId: parseInt(form.categoryId),
    };
    if (editing) {
      await api.put(`/seller/medicines/${editing.id}`, payload);
      toast.success("Medicine updated!");
    } else {
      await api.post("/seller/medicines", payload);
      toast.success("Medicine added!");
    }
    await fetchAll();
    setEditing(null);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api.delete(`/seller/medicines/${id}`);
      toast.success("Medicine deleted");
      setMedicines((m) => m.filter((x) => x.id !== id));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setDeleting(null); }
  };

  const editFormData = editing ? {
    name: editing.name, description: editing.description || "",
    price: String(editing.price), stock: String(editing.stock),
    image: editing.image || "", manufacturer: editing.manufacturer || "",
    categoryId: String(editing.categoryId),
  } : undefined;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="page-container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-bold text-3xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>My Medicines</h1>
              <p className="text-gray-500 mt-1">{medicines.length} product{medicines.length !== 1 ? "s" : ""} listed</p>
            </div>
            <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary gap-2">
              <Plus className="w-4 h-4" /> Add Medicine
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <tbody>{Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)}</tbody>
              </table>
            </div>
          ) : medicines.length === 0 ? (
            <div className="text-center py-32">
              <Package className="w-16 h-16 text-brand-100 mx-auto mb-4" />
              <h3 className="font-bold text-xl text-gray-700 mb-2" style={{ fontFamily: "var(--font-sora)" }}>No medicines yet</h3>
              <p className="text-gray-400 mb-6">Add your first product to start selling</p>
              <button onClick={() => setModalOpen(true)} className="btn-primary gap-2"><Plus className="w-4 h-4" /> Add First Medicine</button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      {["Medicine", "Category", "Price", "Stock", "Actions"].map((h) => (
                        <th key={h} className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {medicines.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-50 overflow-hidden shrink-0 flex items-center justify-center">
                              {m.image
                                ? <img src={m.image} alt={m.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                : <Package className="w-5 h-5 text-brand-300" />}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{m.name}</p>
                              {m.manufacturer && <p className="text-xs text-gray-400">{m.manufacturer}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{m.category.name}</td>
                        <td className="px-6 py-4 font-semibold text-brand-700">{formatPrice(m.price)}</td>
                        <td className="px-6 py-4">
                          <span className={`badge ${m.stock === 0 ? "bg-red-50 text-red-500" : m.stock <= 5 ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"}`}>
                            {m.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => { setEditing(m); setModalOpen(true); }}
                              className="p-2 rounded-xl hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(m.id, m.name)} disabled={deleting === m.id}
                              className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40">
                              {deleting === m.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </div>
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
      <MedicineModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave} initial={editFormData} categories={categories} />
    </>
  );
}
