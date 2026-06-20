"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Skeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { Category } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Loader2, Tag, Save } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

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
    api
      .get("/categories")
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
    if (!result.success) {
      setNameError(result.error.issues[0]?.message || "Invalid name");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, { name });
        toast.success("Category updated!");
      } else {
        await api.post("/categories", { name });
        toast.success("Category created!");
      }
      fetchCategories();
      closeModal();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (
      !confirm(
        `Delete "${cat.name}"?\n\nThis will fail if medicines are assigned to it.`
      )
    )
      return;
    setDeleting(cat.id);
    try {
      await api.delete(`/categories/${cat.id}`);
      toast.success("Category deleted");
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="page-container py-8 max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="font-bold text-3xl text-gray-900"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                Categories
              </h1>
              <p className="text-gray-500 mt-1">{categories.length} categories</p>
            </div>
            <button onClick={openAdd} className="btn-primary gap-2">
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-32">
              <Tag className="w-16 h-16 text-brand-100 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No categories yet</p>
              <button onClick={openAdd} className="btn-primary gap-2">
                <Plus className="w-4 h-4" /> Add First Category
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
                        <Tag className="w-4 h-4 text-brand-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{cat.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{cat.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-2 rounded-xl hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        disabled={deleting === cat.id}
                        className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                      >
                        {deleting === cat.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2
                className="font-bold text-xl text-gray-900"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {editing ? "Edit Category" : "Add Category"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6" noValidate>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Category Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError(""); }}
                placeholder="e.g. Pain Relief"
                className={`input-field mb-1 ${nameError ? "border-red-400" : ""}`}
                autoFocus
              />
              {nameError && (
                <p className="text-red-500 text-xs mb-4">{nameError}</p>
              )}

              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editing ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
