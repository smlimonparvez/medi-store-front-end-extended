"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Pill, LogOut, LayoutDashboard, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
    setOpen(false);
  };

  const dashLink =
    user?.role === "admin"  ? "/admin" :
    user?.role === "seller" ? "/seller/dashboard" :
    "/orders";

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-100 shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center group-hover:bg-brand-700 transition-colors shadow-sm">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-brand-800" style={{ fontFamily: "var(--font-sora)" }}>
              Medi<span className="text-brand-500">Store</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/shop" className={`btn-ghost text-sm ${isActive("/shop") ? "bg-brand-50 text-brand-700" : ""}`}>
              Shop
            </Link>
            <Link href="/about" className={`btn-ghost text-sm ${isActive("/about") ? "bg-brand-50 text-brand-700" : ""}`}>
              About
            </Link>
            <Link href="/contact" className={`btn-ghost text-sm ${isActive("/contact") ? "bg-brand-50 text-brand-700" : ""}`}>
              Contact
            </Link>
            <Link href="/faq" className={`btn-ghost text-sm ${isActive("/faq") ? "bg-brand-50 text-brand-700" : ""}`}>
              FAQ
            </Link>
            {isAuthenticated && user?.role === "customer" && (
              <Link href="/orders" className={`btn-ghost text-sm ${pathname.startsWith("/orders") ? "bg-brand-50 text-brand-700" : ""}`}>
                My Orders
              </Link>
            )}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {user?.role === "customer" && (
                  <Link href="/cart" className="relative p-2.5 hover:bg-brand-50 rounded-xl transition-colors">
                    <ShoppingCart className="w-5 h-5 text-brand-700" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {totalItems > 9 ? "9+" : totalItems}
                      </span>
                    )}
                  </Link>
                )}
                <Link href={dashLink} className="btn-ghost text-sm gap-1.5">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link href="/profile" className="btn-ghost text-sm gap-1.5">
                  <User className="w-4 h-4" />
                  {user?.name.split(" ")[0]}
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login"    className="btn-outline  text-sm py-2">Login</Link>
                <Link href="/register" className="btn-primary  text-sm py-2">Register</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-xl hover:bg-brand-50" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-3 border-t border-brand-50 space-y-1 animate-fade-in">
            <Link href="/shop" className="block px-4 py-2.5 rounded-xl hover:bg-brand-50 text-sm font-medium" onClick={() => setOpen(false)}>Shop</Link>
            <Link href="/about" className="block px-4 py-2.5 rounded-xl hover:bg-brand-50 text-sm font-medium" onClick={() => setOpen(false)}>About</Link>
            <Link href="/contact" className="block px-4 py-2.5 rounded-xl hover:bg-brand-50 text-sm font-medium" onClick={() => setOpen(false)}>Contact</Link>
            <Link href="/faq" className="block px-4 py-2.5 rounded-xl hover:bg-brand-50 text-sm font-medium" onClick={() => setOpen(false)}>FAQ</Link>
            {isAuthenticated ? (
              <>
                <Link href={dashLink} className="block px-4 py-2.5 rounded-xl hover:bg-brand-50 text-sm font-medium" onClick={() => setOpen(false)}>Dashboard</Link>
                <Link href="/profile" className="block px-4 py-2.5 rounded-xl hover:bg-brand-50 text-sm font-medium" onClick={() => setOpen(false)}>Profile</Link>
                {user?.role === "customer" && (
                  <>
                    <Link href="/orders" className="block px-4 py-2.5 rounded-xl hover:bg-brand-50 text-sm font-medium" onClick={() => setOpen(false)}>My Orders</Link>
                    <Link href="/cart" className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-brand-50 text-sm font-medium" onClick={() => setOpen(false)}>
                      <ShoppingCart className="w-4 h-4" /> Cart {totalItems > 0 && `(${totalItems})`}
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl hover:bg-red-50 text-sm font-medium text-red-500">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-4 pt-1">
                <Link href="/login"    className="btn-outline text-sm flex-1 text-center py-2" onClick={() => setOpen(false)}>Login</Link>
                <Link href="/register" className="btn-primary text-sm flex-1 text-center py-2" onClick={() => setOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
