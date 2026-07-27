"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ShoppingCart, Menu, X, Pill,
  LogOut, LayoutDashboard, User, Heart,
  Sun, Moon, ChevronDown, Settings, HelpCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

// ThemeToggle Navbar
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return <div className="w-9 h-9" />;
  
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl hover:bg-brand-50 dark:hover:bg-white/10 transition-colors"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark"
        ? <Sun className="w-5 h-5 text-yellow-400" />
        : <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      }
    </button>
  );
}

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
    setOpen(false);
    setDropdownOpen(false);
  };

  const dashLink =
    user?.role === "admin" ? "/admin" :
    user?.role === "seller" ? "/seller/dashboard" :
    "/orders";

  const isActive = (href: string) => pathname === href;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-md border-b border-brand-100 dark:border-[#30363d] shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center group-hover:bg-brand-700 transition-colors shadow-sm">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <span
              className="font-bold text-xl text-brand-800 dark:text-white"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Medi<span className="text-brand-500">Store</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/shop" className={`btn-ghost text-sm ${isActive("/shop") ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400" : "dark:text-gray-300 dark:hover:bg-white/10"}`}>Shop</Link>
            <Link href="/about" className={`btn-ghost text-sm ${isActive("/about") ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400" : "dark:text-gray-300 dark:hover:bg-white/10"}`}>About</Link>
            <Link href="/contact" className={`btn-ghost text-sm ${isActive("/contact") ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400" : "dark:text-gray-300 dark:hover:bg-white/10"}`}>Contact</Link>
            <Link href="/faq" className={`btn-ghost text-sm ${isActive("/faq") ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400" : "dark:text-gray-300 dark:hover:bg-white/10"}`}>FAQ</Link>
            {isAuthenticated && user?.role === "customer" && (
              <Link href="/orders" className={`btn-ghost text-sm ${pathname.startsWith("/orders") ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400" : "dark:text-gray-300 dark:hover:bg-white/10"}`}>
                My Orders
              </Link>
            )}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Wishlist icon */}
                <Link href="/wishlist" className="relative p-2.5 hover:bg-brand-50 dark:hover:bg-white/10 rounded-xl transition-colors">
                  <Heart className="w-5 h-5 text-brand-700 dark:text-brand-400" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart icon — customers only */}
                {user?.role === "customer" && (
                  <Link href="/cart" className="relative p-2.5 hover:bg-brand-50 dark:hover:bg-white/10 rounded-xl transition-colors">
                    <ShoppingCart className="w-5 h-5 text-brand-700 dark:text-brand-400" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {totalItems > 9 ? "9+" : totalItems}
                      </span>
                    )}
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand-50 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-900 flex items-center justify-center font-bold text-brand-700 dark:text-brand-300 text-sm">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.name.split(" ")[0]}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#161b22] rounded-2xl shadow-xl border border-gray-100 dark:border-[#30363d] overflow-hidden animate-slide-up">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-[#30363d]">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 capitalize">
                          {user?.role}
                        </span>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href={dashLink}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-white/10 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-white/10 transition-colors"
                        >
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          My Profile
                        </Link>
                        <Link
                          href="#"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-white/10 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          Settings
                        </Link>
                        <Link
                          href="#"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-white/10 transition-colors"
                        >
                          <HelpCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          Help & Support
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 dark:border-[#30363d] py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link href="/login" className="btn-outline text-sm py-2">Login</Link>
                <Link href="/register" className="btn-primary text-sm py-2">Register</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 rounded-xl hover:bg-brand-50 dark:hover:bg-white/10"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-5 h-5 dark:text-white" /> : <Menu className="w-5 h-5 dark:text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-3 border-t border-brand-50 dark:border-[#30363d] space-y-1 animate-fade-in">
            <Link href="/shop" className="block px-4 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-white/10 text-sm font-medium dark:text-gray-300" onClick={() => setOpen(false)}>Shop</Link>
            <Link href="/about" className="block px-4 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-white/10 text-sm font-medium dark:text-gray-300" onClick={() => setOpen(false)}>About</Link>
            <Link href="/contact" className="block px-4 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-white/10 text-sm font-medium dark:text-gray-300" onClick={() => setOpen(false)}>Contact</Link>
            <Link href="/faq" className="block px-4 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-white/10 text-sm font-medium dark:text-gray-300" onClick={() => setOpen(false)}>FAQ</Link>

            {isAuthenticated ? (
              <>
                <Link href="/wishlist" className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-white/10 text-sm font-medium dark:text-gray-300" onClick={() => setOpen(false)}>
                  <Heart className="w-4 h-4 text-red-400" />
                  Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
                <Link href={dashLink} className="block px-4 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-white/10 text-sm font-medium dark:text-gray-300" onClick={() => setOpen(false)}>Dashboard</Link>
                <Link href="/profile" className="block px-4 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-white/10 text-sm font-medium dark:text-gray-300" onClick={() => setOpen(false)}>Profile</Link>
                {user?.role === "customer" && (
                  <>
                    <Link href="/orders" className="block px-4 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-white/10 text-sm font-medium dark:text-gray-300" onClick={() => setOpen(false)}>My Orders</Link>
                    <Link href="/cart" className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-white/10 text-sm font-medium dark:text-gray-300" onClick={() => setOpen(false)}>
                      <ShoppingCart className="w-4 h-4" />
                      Cart {totalItems > 0 && `(${totalItems})`}
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/20 text-sm font-medium text-red-500">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-4 pt-1">
                <Link href="/login" className="btn-outline text-sm flex-1 text-center py-2" onClick={() => setOpen(false)}>Login</Link>
                <Link href="/register" className="btn-primary text-sm flex-1 text-center py-2" onClick={() => setOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}