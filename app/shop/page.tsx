"use client";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import MedicineCard from "@/components/medicine/MedicineCard";
import { MedicineCardSkeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { Medicine, Category } from "@/types";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ShopPage() {
  const [medicines, setMedicines]   = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [meta, setMeta]             = useState({ total: 0, page: 1, totalPages: 1 });
  const [showFilters, setShowFilters] = useState(false);

  const [search,     setSearch]     = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice,   setMinPrice]   = useState("");
  const [maxPrice,   setMaxPrice]   = useState("");
  const [page,       setPage]       = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("search") || "");
    setCategoryId(params.get("categoryId") || "");
  }, []);

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data.data || [])).catch(() => {});
  }, []);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "12" };
      if (search)     params.search     = search;
      if (categoryId) params.categoryId = categoryId;
      if (minPrice)   params.minPrice   = minPrice;
      if (maxPrice)   params.maxPrice   = maxPrice;
      const res = await api.get("/medicines", { params });
      setMedicines(res.data.data?.medicines || []);
      setMeta(res.data.data?.meta || { total: 0, page: 1, totalPages: 1 });
    } catch {
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, minPrice, maxPrice, page]);

  useEffect(() => { fetchMedicines(); }, [fetchMedicines]);

  const clearFilters = () => {
    setSearch(""); setCategoryId(""); setMinPrice(""); setMaxPrice(""); setPage(1);
  };

  const hasFilters = search || categoryId || minPrice || maxPrice;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="bg-white border-b border-gray-100">
          <div className="page-container py-8">
            <h1 className="font-bold text-3xl text-gray-900 mb-1" style={{ fontFamily: "var(--font-sora)" }}>Medicine Shop</h1>
            <p className="text-gray-500">{loading ? "Loading..." : `${meta.total} products found`}</p>
          </div>
        </div>

        <div className="page-container py-8">
          {/* Search */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" placeholder="Search medicines..." value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="input-field pl-10"
              />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${showFilters ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-600 hover:border-brand-300"}`}>
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {hasFilters && <span className="w-2 h-2 bg-brand-500 rounded-full" />}
            </button>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 animate-slide-up">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Category</label>
                  <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }} className="input-field">
                    <option value="">All Categories</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Min Price (৳)</label>
                  <input type="number" placeholder="0" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Max Price (৳)</label>
                  <input type="number" placeholder="Any" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} className="input-field" />
                </div>
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="mt-4 flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium">
                  <X className="w-4 h-4" /> Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 12 }).map((_, i) => <MedicineCardSkeleton key={i} />)}
            </div>
          ) : medicines.length === 0 ? (
            <div className="text-center py-32">
              <span className="text-6xl block mb-4">🔍</span>
              <h3 className="font-bold text-xl text-gray-700 mb-2" style={{ fontFamily: "var(--font-sora)" }}>No medicines found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
              {hasFilters && <button onClick={clearFilters} className="btn-outline">Clear Filters</button>}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {medicines.map((m) => <MedicineCard key={m.id} medicine={m} />)}
              </div>

              {meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:border-brand-400 disabled:opacity-40 transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === meta.totalPages || Math.abs(p - page) <= 1)
                    .map((p, idx, arr) => (
                      <span key={p} className="flex items-center gap-1">
                        {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-gray-400 px-1">…</span>}
                        <button onClick={() => setPage(p)}
                          className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${p === page ? "bg-brand-600 text-white shadow-sm" : "border border-gray-200 hover:border-brand-400"}`}>
                          {p}
                        </button>
                      </span>
                    ))}
                  <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:border-brand-400 disabled:opacity-40 transition-all">
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
