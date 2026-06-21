"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useWishlist } from "@/context/WishlistContext";
import { useCart }     from "@/context/CartContext";
import { useAuth }     from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import {
  Heart, ShoppingCart, Trash2,
  Package, ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { items, removeFromWishlist, totalItems } = useWishlist();
  const { addToCart }                             = useCart();
  const { user }                                  = useAuth();
  const router                                    = useRouter();

  const handleAddToCart = (medicine: typeof items[0]) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }
    if (user.role !== "customer") {
      toast.error("Only customers can add to cart");
      return;
    }
    addToCart({
      id:       medicine.id,
      name:     medicine.name,
      price:    Number(medicine.price),
      image:    medicine.image,
      quantity: 1,
      stock:    medicine.stock,
      sellerId: medicine.sellerId,
    });
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-red-200" />
            </div>
            <h2
              className="font-bold text-2xl text-gray-800 mb-2"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Your wishlist is empty
            </h2>
            <p className="text-gray-400 mb-8">
              Browse medicines and click the heart to save them here
            </p>
            <Link href="/shop" className="btn-primary gap-2">
              Browse Shop <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="page-container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="font-bold text-3xl text-gray-900"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                My Wishlist
              </h1>
              <p className="text-gray-500 mt-1">
                {totalItems} saved item{totalItems !== 1 ? "s" : ""}
              </p>
            </div>
            <Link href="/shop" className="btn-outline text-sm gap-2">
              Continue Browsing
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((medicine) => {
              const outOfStock = medicine.stock === 0;

              return (
                <div key={medicine.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                  {/* Image */}
                  <Link href={`/shop/${medicine.id}`}>
                    <div className="relative h-44 bg-brand-50 overflow-hidden">
                      {medicine.image ? (
                        <Image
                          src={medicine.image}
                          alt={medicine.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-brand-200" />
                        </div>
                      )}
                      {outOfStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className="bg-white/90 text-brand-700 text-xs font-semibold px-2 py-1 rounded-lg">
                          {medicine.category.name}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-4">
                    <Link href={`/shop/${medicine.id}`}>
                      <h3
                        className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 hover:text-brand-700 transition-colors"
                        style={{ fontFamily: "var(--font-sora)" }}
                      >
                        {medicine.name}
                      </h3>
                    </Link>

                    {medicine.manufacturer && (
                      <p className="text-xs text-gray-400 mb-3">
                        {medicine.manufacturer}
                      </p>
                    )}

                    <div className="font-bold text-brand-700 text-lg mb-4" style={{ fontFamily: "var(--font-sora)" }}>
                      {formatPrice(medicine.price)}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(medicine)}
                        disabled={outOfStock}
                        className="flex-1 btn-primary text-sm py-2 gap-1.5 disabled:opacity-40"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {outOfStock ? "Out of Stock" : "Add to Cart"}
                      </button>
                      <button
                        onClick={() => removeFromWishlist(medicine.id)}
                        className="w-10 h-10 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-400 flex items-center justify-center transition-colors border border-gray-100"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
