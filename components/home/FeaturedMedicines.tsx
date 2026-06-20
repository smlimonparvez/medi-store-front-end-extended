"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Medicine } from "@/types";
import MedicineCard from "@/components/medicine/MedicineCard";
import { MedicineCardSkeleton } from "@/components/ui/Skeleton";
import { Sparkles, ArrowRight } from "lucide-react";

export default function FeaturedMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/medicines?limit=8")
      .then((r) => setMedicines(r.data.data?.medicines || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-brand-50/40">
      <div className="page-container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-600 text-sm font-semibold mb-3">
              <Sparkles className="w-4 h-4" /> Featured Products
            </div>
            <h2 className="section-title">Popular Medicines</h2>
            <p className="text-gray-500 mt-2">Top-selling products from verified sellers</p>
          </div>
          <Link href="/shop" className="hidden md:flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-800 transition-colors group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <MedicineCardSkeleton key={i} />)}
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <span className="text-5xl block mb-4">💊</span>
            <p className="font-medium">Sellers are stocking up — check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {medicines.map((m) => <MedicineCard key={m.id} medicine={m} />)}
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link href="/shop" className="btn-outline inline-flex items-center gap-2">View All <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </section>
  );
}
