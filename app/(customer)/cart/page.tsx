"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, Package, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-brand-300" />
            </div>
            <h2 className="font-bold text-2xl text-gray-800 mb-2" style={{ fontFamily: "var(--font-sora)" }}>Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Browse our medicines and add something!</p>
            <Link href="/shop" className="btn-primary gap-2">Browse Shop <ArrowRight className="w-4 h-4" /></Link>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-bold text-3xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>Shopping Cart</h1>
              <p className="text-gray-500 mt-1">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors flex items-center gap-1.5">
              <Trash2 className="w-4 h-4" /> Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
                  <div className="w-20 h-20 rounded-xl bg-brand-50 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.image
                      ? <Image src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
                      : <Package className="w-8 h-8 text-brand-200" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2" style={{ fontFamily: "var(--font-sora)" }}>
                          {item.name}
                        </h3>
                        <p className="text-brand-600 font-bold mt-1">{formatPrice(item.price)}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}
                          className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center transition-colors disabled:opacity-40">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-semibold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}
                          className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center transition-colors disabled:opacity-40">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-bold text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {item.stock <= 5 && (
                      <p className="text-xs text-orange-500 font-medium mt-1">Only {item.stock} units available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                <h2 className="font-bold text-lg text-gray-900 mb-5" style={{ fontFamily: "var(--font-sora)" }}>Order Summary</h2>
                <div className="space-y-3 text-sm mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-gray-600">
                      <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                      <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dashed border-gray-100 pt-4 mb-6 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span><span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery</span>
                    <span className="text-green-600 font-medium">Cash on Delivery</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-900 pt-2">
                    <span>Total</span>
                    <span className="text-brand-700">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="btn-primary w-full py-3 text-base font-semibold" style={{ fontFamily: "var(--font-sora)" }}>
                  Proceed to Checkout
                </Link>
                <Link href="/shop" className="text-center block text-sm text-brand-600 hover:text-brand-800 mt-3 font-medium transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
