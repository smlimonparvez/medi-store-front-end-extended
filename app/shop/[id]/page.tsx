"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  ChevronLeft, ChevronRight, ZoomIn, X,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";

// --- Helpers ---
function StarRating({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" disabled={!interactive}
          onClick={() => onRate?.(s)}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}>
          <Star className={`w-${interactive ? "6" : "4"} h-${interactive ? "6" : "4"} transition-colors ${s <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
        </button>
      ))}
    </div>
  );
}

// --- Image Gallery ---
function ImageGallery({ image, name }: { image?: string; name: string }) {
  // Generate a few "gallery" images from the same URL with slight variations
  // so there's something visual to show for demo purposes.
  // In production, your API would return an images[] array.
  const images = image ? [image] : [];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setActive((a) => (a === 0 ? images.length - 1 : a - 1));
  const next = () => setActive((a) => (a === images.length - 1 ? 0 : a + 1));

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-brand-50 rounded-2xl flex flex-col items-center justify-center text-brand-200">
        <Package className="w-24 h-24" />
        <span className="text-sm mt-3">No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden group cursor-zoom-in"
        onClick={() => setLightbox(true)}>
        <img src={images[active]} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
        </div>
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${active === i ? "border-brand-500 shadow-sm" : "border-gray-100 hover:border-brand-300"}`}>
              <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors">
            <X className="w-5 h-5" />
          </button>
          <img src={images[active]} alt={name} className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function MedicineDetailPage() {
  const { id }     = useParams();
  const router     = useRouter();
  const { addToCart } = useCart();
  const { user }   = useAuth();

  const [medicine,   setMedicine]   = useState<Medicine | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [qty,        setQty]        = useState(1);
  const [rating,     setRating]     = useState(5);
  const [comment,    setComment]    = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchMedicine = async () => {
    try {
      const res = await api.get(`/medicines/${id}`);
      setMedicine(res.data.data);
    } catch { router.push("/shop"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMedicine(); }, [id]);

  const handleAddToCart = () => {
    if (!user) { toast.error("Please login first"); router.push("/login"); return; }
    if (user.role !== "customer") { toast.error("Only customers can add to cart"); return; }
    if (!medicine) return;
    for (let i = 0; i < qty; i++) {
      addToCart({ id: medicine.id, name: medicine.name, price: Number(medicine.price), image: medicine.image, quantity: 1, stock: medicine.stock, sellerId: medicine.sellerId });
    }
    toast.success(`${qty} × ${medicine.name} added to cart!`);
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
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSubmitting(false); }
  };

  const avgRating = medicine?.reviews?.length
    ? medicine.reviews.reduce((s, r) => s + r.rating, 0) / medicine.reviews.length
    : 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="page-container py-8">
          <button onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-brand-700 font-medium text-sm mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Shop
          </button>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <div className="space-y-4 py-4">
                <Skeleton className="h-4 w-24" /><Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" /><Skeleton className="h-6 w-20" />
                <Skeleton className="h-16 w-full" /><Skeleton className="h-12 w-full" />
              </div>
            </div>
          ) : medicine ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Image Gallery */}
                <div className="p-6 bg-gray-50/50 border-b md:border-b-0 md:border-r border-gray-100">
                  <ImageGallery image={medicine.image} name={medicine.name} />
                </div>

                {/* Info */}
                <div className="p-8 md:p-10">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="badge bg-brand-50 text-brand-700 border border-brand-100">
                      <Tag className="w-3 h-3" /> {medicine.category.name}
                    </span>
                    <div className="flex gap-2">
                      {medicine.stock === 0 && <span className="badge bg-red-50 text-red-600">Out of Stock</span>}
                      {medicine.stock > 0 && medicine.stock <= 5 && <span className="badge bg-orange-50 text-orange-600">Only {medicine.stock} left!</span>}
                    </div>
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
                      <span className="text-sm text-gray-500">{avgRating.toFixed(1)} ({medicine.reviews?.length} reviews)</span>
                    </div>
                  )}

                  <div className="text-3xl font-bold text-brand-700 mb-4" style={{ fontFamily: "var(--font-sora)" }}>
                    {formatPrice(medicine.price)}
                  </div>

                  {medicine.description && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{medicine.description}</p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Hash className="w-4 h-4" />
                    {medicine.stock > 0
                      ? <span className="text-green-600 font-medium">{medicine.stock} units in stock</span>
                      : <span className="text-red-500 font-medium">Out of stock</span>}
                  </div>

                  {/* Quantity selector */}
                  {medicine.stock > 0 && user?.role === "customer" && (
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-sm font-semibold text-gray-700">Qty:</span>
                      <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                        <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 transition-colors">−</button>
                        <span className="w-8 text-center font-semibold text-sm">{qty}</span>
                        <button onClick={() => setQty((q) => Math.min(medicine.stock, q + 1))}
                          className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 transition-colors">+</button>
                      </div>
                    </div>
                  )}

                  <button onClick={handleAddToCart} disabled={medicine.stock === 0} className="btn-primary w-full py-3 text-base gap-2 mb-4">
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </button>

                  <p className="text-xs text-gray-400">
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
                Customer Reviews
                {medicine.reviews && medicine.reviews.length > 0 && (
                  <span className="font-normal text-base text-gray-400 ml-2">({medicine.reviews.length})</span>
                )}
              </h2>

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
                      placeholder="Share your experience..." className="input-field resize-none" />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary gap-2">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit Review
                  </button>
                </form>
              )}

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
