"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";
import { Medicine } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function MedicineCard({ medicine }: { medicine: Medicine }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }
    if (user.role !== "customer") {
      toast.error("Only customers can add items to cart");
      return;
    }
    addToCart({
      id: medicine.id, name: medicine.name,
      price: Number(medicine.price), image: medicine.image,
      quantity: 1, stock: medicine.stock, sellerId: medicine.sellerId,
    });
  };

  const outOfStock = medicine.stock === 0;
  const lowStock   = medicine.stock > 0 && medicine.stock <= 5;

  return (
    <Link href={`/shop/${medicine.id}`}>
      <div className="card group cursor-pointer overflow-hidden">
        {/* Image */}
        <div className="relative h-44 bg-brand-50 overflow-hidden">
          {medicine.image ? (
            <Image src={medicine.image} alt={medicine.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-brand-200" />
            </div>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
          {lowStock && !outOfStock && (
            <div className="absolute top-2 left-2">
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Only {medicine.stock} left!</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className="bg-white/90 text-brand-700 text-xs font-semibold px-2 py-1 rounded-lg shadow-sm">
              {medicine.category.name}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 group-hover:text-brand-700 transition-colors" style={{ fontFamily: "var(--font-sora)" }}>
            {medicine.name}
          </h3>
          {medicine.manufacturer && (
            <p className="text-xs text-gray-400 mb-3">{medicine.manufacturer}</p>
          )}
          <div className="flex items-center justify-between mt-auto">
            <span className="font-bold text-brand-700 text-lg" style={{ fontFamily: "var(--font-sora)" }}>
              {formatPrice(medicine.price)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="w-9 h-9 rounded-xl bg-brand-50 hover:bg-brand-600 text-brand-600 hover:text-white flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
