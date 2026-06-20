"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Category } from "@/types";

const ICONS: Record<string, string> = {
  "pain-relief": "💊", "vitamins-supplements": "🌿", "cold-flu": "🤧",
  "digestive-health": "🫀", "skin-care": "✨", "eye-ear-care": "👁️",
};
const COLORS = [
  "from-brand-50 to-brand-100 border-brand-200 hover:border-brand-400",
  "from-cyan-50 to-cyan-100 border-cyan-200 hover:border-cyan-400",
  "from-emerald-50 to-emerald-100 border-emerald-200 hover:border-emerald-400",
  "from-sky-50 to-sky-100 border-sky-200 hover:border-sky-400",
  "from-green-50 to-green-100 border-green-200 hover:border-green-400",
  "from-teal-50 to-cyan-100 border-teal-200 hover:border-teal-400",
];
const FALLBACK: Category[] = [
  { id: 0, name: "Pain Relief",          slug: "pain-relief" },
  { id: 0, name: "Vitamins",             slug: "vitamins-supplements" },
  { id: 0, name: "Cold & Flu",           slug: "cold-flu" },
  { id: 0, name: "Digestive Health",     slug: "digestive-health" },
  { id: 0, name: "Skin Care",            slug: "skin-care" },
  { id: 0, name: "Eye & Ear Care",       slug: "eye-ear-care" },
];

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data.data || [])).catch(() => {});
  }, []);

  const display = categories.length > 0 ? categories : FALLBACK;

  return (
    <section className="py-20 page-container">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-brand-600 text-sm font-semibold mb-3">🏷️ Browse by Category</div>
        <h2 className="section-title">Find What You Need</h2>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          Shop from our wide range of over-the-counter medicine categories
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {display.map((cat, idx) => (
          <Link
            key={`${cat.slug}-${idx}`}
            // Use categoryId (number) — backend filters by id, not slug
            href={cat.id ? `/shop?categoryId=${cat.id}` : `/shop`}
            className={`flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br border transition-all duration-200 hover:-translate-y-1 hover:shadow-md group ${COLORS[idx % COLORS.length]}`}
          >
            <span className="text-3xl">{ICONS[cat.slug] || "💊"}</span>
            <span className="text-sm font-semibold text-gray-700 text-center leading-tight group-hover:text-brand-700 transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
