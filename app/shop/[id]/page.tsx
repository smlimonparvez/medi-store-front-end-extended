"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import api from "@/lib/axios";
import { Medicine } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, formatDate, getErrorMessage } from "@/lib/utils";
import {
  ShoppingCart, Package, Star, ArrowLeft,
  Loader2, Building2, Tag, Send, Hash,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";

function StarRating({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" disabled={!interactive} onClick={() => onRate?.(s)}
          className={interactive ? "cursor-pointer" : "cursor-default"}>
          <Star className={`w-${interactive ? "6" : "4"} h-${interactive ? "6" : "4"} transition-colors ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 hover:text-yellow-300"}`} />
        </button>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Skeleton className="h-72 md:h-full min-h-[300px] rounded-none" />
        <div className="p-10 space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function MedicineDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading]   = useState(true);
  const [rating, setRating]     = useState(5);
  const [comment, setComment]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchMedicine = async () => {
    try {
      const res = await api.get(`/medicines/${id}`);
      setMedicine(res.data.data);
    } catch {
      router.push("/shop");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedicine(); }, [id]);

  const handleAddToCart = () => {
    if (!user) { toast.error("Please login first"); router.push("/login"); return; }
    if (user.role !== "customer") { toast.error("Only customers can add to cart"); return; }
    if (!medicine) return;
    addToCart({
      id: medicine.id, name: medicine.name,
      price: Number(medicine.price), image: medicine.image,
      quantity: 1, stock: medicine.stock, sellerId: medicine.sellerId,
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to leave a review"); return; }
    setSubmitting(true);
    try {
      await api.post("/reviews", { medicineId: Number(id), rating, comment });
      toast.success("Review submitted!");
      setComment(""); setRating(5);
      fetchMedicine();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = medicine?.reviews?.length
    ? medicine.reviews.reduce((s, r) => s + r.rating, 0) / medicine.reviews.length
    : 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="page-container py-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-brand-700 font-medium text-sm mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Shop
          </button>

          {loading ? (
            <DetailSkeleton />
          ) : medicine ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image */}
                <div className="relative h-72 md:h-full min-h-[320px] bg-brand-50 flex items-center justify-center">
                  {medicine.image ? (
                    <Image src={medicine.image} alt={medicine.name} fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-brand-200">
                      <Package className="w-20 h-20" />
                      <span className="text-sm">No image available</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-8 md:p-10">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="badge bg-brand-50 text-brand-700 border border-brand-100">
                      <Tag className="w-3 h-3" /> {medicine.category.name}
                    </span>
                    {medicine.stock === 0 && (
                      <span className="badge bg-red-50 text-red-600">Out of Stock</span>
                    )}
                    {medicine.stock > 0 && medicine.stock <= 5 && (
                      <span className="badge bg-orange-50 text-orange-600">Only {medicine.stock} left!</span>
                    )}
                  </div>

                  <h1 className="font-bold text-2xl md:text-3xl text-gray-900 mb-2 leading-tight" style={{ fontFamily: "var(--font-sora)" }}>
                    {medicine.name}
                  </h1>

                  {medicine.manufacturer && (
                    <p className="flex items-center gap-1.5 text-sm text-gray-400 mb-4">
                      <Building2 className="w-4 h-4" /> {medicine.manufacturer}
                    </p>
                  )}

                  {avgRating > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <StarRating rating={Math.round(avgRating)} />
                      <span className="text-sm text-gray-500">
                        {avgRating.toFixed(1)} ({medicine.reviews?.length} reviews)
                      </span>
                    </div>
                  )}

                  <div className="text-3xl font-bold text-brand-700 mb-4" style={{ fontFamily: "var(--font-sora)" }}>
                    {formatPrice(medicine.price)}
                  </div>

                  {medicine.description && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{medicine.description}</p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Hash className="w-4 h-4" />
                    {medicine.stock > 0
                      ? <span className="text-green-600 font-medium">{medicine.stock} units in stock</span>
                      : <span className="text-red-500 font-medium">Out of stock</span>}
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={medicine.stock === 0}
                    className="btn-primary w-full py-3 text-base gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </button>

                  <p className="text-xs text-gray-400 mt-4">
                    Sold by: <span className="font-medium text-gray-600">{medicine.seller.name}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Reviews */}
          {!loading && medicine && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="font-bold text-xl text-gray-900 mb-6" style={{ fontFamily: "var(--font-sora)" }}>
                Customer Reviews {medicine.reviews && medicine.reviews.length > 0 && (
                  <span className="font-normal text-base text-gray-400">({medicine.reviews.length})</span>
                )}
              </h2>

              {/* Review form — only for customers */}
              {user?.role === "customer" && (
                <form onSubmit={handleReviewSubmit} className="bg-brand-50 rounded-xl p-6 mb-8 border border-brand-100">
                  <h3 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: "var(--font-sora)" }}>Write a Review</h3>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Your Rating</label>
                    <StarRating rating={rating} interactive onRate={setRating} />
                  </div>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Comment (optional)</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3}
                      placeholder="Share your experience with this medicine..." className="input-field resize-none" />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary gap-2">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit Review
                  </button>
                  <p className="text-xs text-gray-400 mt-2">* You can only review medicines from your delivered orders</p>
                </form>
              )}

              {/* Reviews list */}
              {!medicine.reviews || medicine.reviews.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {medicine.reviews.map((review) => (
                    <div key={review.id} className="flex gap-4 pb-5 border-b border-gray-50 last:border-0">
                      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700 text-sm shrink-0">
                        {review.customer.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span className="font-semibold text-gray-800 text-sm">{review.customer.name}</span>
                          <StarRating rating={review.rating} />
                          <span className="text-xs text-gray-400 ml-auto">{formatDate(review.createdAt)}</span>
                        </div>
                        {review.comment && <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
