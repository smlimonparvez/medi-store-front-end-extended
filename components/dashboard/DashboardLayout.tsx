"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import {
  Pill, LogOut, Menu, Bell, Search,
  ChevronRight, Sun, Moon,
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

// ThemeToggle 
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return <div className="w-9 h-9" />;
  
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark"
        ? <Sun className="w-5 h-5 text-yellow-400" />
        : <Moon className="w-5 h-5 text-gray-500" />
      }
    </button>
  );
}

// ✅ SidebarContent moved outside - fixes the "cannot create components during render" error
function SidebarContent({ 
  navItems, 
  title, 
  user, 
  onLogout, 
  onNavClick 
}: { 
  navItems: NavItem[];
  title: string;
  user: any;
  onLogout: () => void;
  onNavClick: () => void;
}) {
  const pathname = usePathname();
  
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link href="/">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10 shrink-0">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg" style={{ fontFamily: "var(--font-sora)" }}>
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
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
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
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{user?.name || "User"}</p>
            <p className="text-white/50 text-xs truncate">{user?.email || ""}</p>
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

export default function DashboardLayout({ children, navItems, title }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/login");
  };

  const sidebarClass = "bg-gradient-to-b from-brand-800 to-brand-900";

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0d1117] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={cn("hidden lg:flex flex-col w-60 shrink-0", sidebarClass)}>
        <SidebarContent 
          navItems={navItems}
          title={title}
          user={user}
          onLogout={handleLogout}
          onNavClick={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-60 flex flex-col lg:hidden transform transition-transform duration-300",
        sidebarClass,
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent 
          navItems={navItems}
          title={title}
          user={user}
          onLogout={handleLogout}
          onNavClick={() => setSidebarOpen(false)}
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
            <Link href="/" className="hover:text-brand-600 transition-colors">MediStore</Link>
            <span>/</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{title}</span>
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
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}