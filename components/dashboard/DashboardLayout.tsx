"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import {
  Pill,
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
  role: "admin" | "seller";
}

interface SidebarContentProps {
  navItems: NavItem[];
  pathname: string;
  title: string;
  user?: { name?: string; email?: string } | null;
  onLogout: () => void | Promise<void>;
  onClose: () => void;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-500" />
      )}
    </button>
  );
}

function SidebarContent({
  navItems,
  pathname,
  title,
  user,
  onLogout,
  onClose,
}: SidebarContentProps) {
  const displayName = user?.name ?? "User";
  const email = user?.email ?? "";
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link href="/">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10 shrink-0">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <span
            className="font-bold text-white text-lg"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Medi<span className="opacity-70">Store</span>
          </span>
        </div>
      </Link>

      {/* Role badge */}
      <div className="px-5 py-4 shrink-0">
        <span className="inline-flex items-center gap-1.5 bg-white/15 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
          {title}
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
              {active && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-4 shrink-0 border-t border-white/10 pt-3 mt-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 mb-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm">
            {firstLetter}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {displayName}
            </p>
            <p className="text-white/50 text-xs truncate">{email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
  navItems,
  title,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Back-button / cache fix ───────────────────────────────────────────────
  // Problem: after logout the browser caches the dashboard page. Pressing
  // back shows the cached HTML without making a new network request, so
  // middleware never runs and the user sees the dashboard while logged out.
  //
  // Fix A — tell the browser never to cache this page (no-store).
  //   When back is pressed, browser must make a fresh request → middleware
  //   catches it and redirects to /login.
  // Fix B — client-side guard: if AuthContext says no user and loading is
  //   done, redirect immediately. Covers the rare case where cached JS runs
  //   before the network request completes.
  useEffect(() => {
    // Set no-cache headers via meta tag (works alongside server headers)
    const meta = document.createElement("meta");
    meta.httpEquiv = "Cache-Control";
    meta.content = "no-store, no-cache, must-revalidate";
    document.head.appendChild(meta);

    // Also push a history entry so back goes to /login not the dashboard
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.head.removeChild(meta);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Client-side auth guard — redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/login");
  };

  const sidebarClass = "bg-gradient-to-b from-brand-800 to-brand-900";

  // Don't render dashboard content until auth state is confirmed
  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0d1117]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0d1117] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={cn("hidden lg:flex flex-col w-60 shrink-0", sidebarClass)}
      >
        <SidebarContent
          navItems={navItems}
          pathname={pathname}
          title={title}
          user={user}
          onLogout={handleLogout}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 flex flex-col lg:hidden transform transition-transform duration-300",
          sidebarClass,
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent
          navItems={navItems}
          pathname={pathname}
          title={title}
          user={user}
          onLogout={handleLogout}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-[#161b22] border-b border-gray-100 dark:border-[#30363d] flex items-center gap-4 px-4 lg:px-6 shrink-0 shadow-sm">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-brand-600 transition-colors">
              MediStore
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {title}
            </span>
          </div>

          <div className="flex-1" />

          <div className="hidden sm:flex items-center gap-2 bg-gray-50 dark:bg-[#1c2128] border border-gray-200 dark:border-[#30363d] rounded-xl px-3 py-2 w-48 transition-all">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 outline-none flex-1"
            />
          </div>

          <ThemeToggle />

          <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-900 flex items-center justify-center font-bold text-brand-700 dark:text-brand-300 text-sm cursor-default">
            {user?.name[0].toUpperCase()}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
