"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/utils";
import { Pill, Eye, EyeOff, Loader2, ShieldCheck, Store, User } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  email:    z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const DEMO_CREDENTIALS = [
  { role: "Admin",    email: "admin@medistore.com",    password: "admin123",    icon: ShieldCheck, color: "bg-brand-50 border-brand-200 text-brand-700 hover:bg-brand-100" },
  { role: "Seller",   email: "medicorp.seller@example.com",   password: "password123",   icon: Store,       color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" },
  { role: "Customer", email: "limon@gmail.com", password: "123456", icon: User,        color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100" },
];

function LoginForm() {
  const { login }     = useAuth();
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const redirect      = searchParams.get("redirect") || "";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const doLogin = async (loginEmail: string, loginPassword: string) => {
    const res = await api.post("/auth/login", { email: loginEmail, password: loginPassword });
    const { user, token } = res.data.data;
    // Support both localStorage-token flow and cookie flow
    if (token) {
      localStorage.setItem("medistore_token", token);
      // Set middleware cookie for route protection
      const value = encodeURIComponent(JSON.stringify({ id: user.id, name: user.name, role: user.role, email: user.email }));
      document.cookie = `medistore_user=${value}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    }
    login(user, token);
    toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
    const dest = redirect || (user.role === "admin" ? "/admin" : user.role === "seller" ? "/seller/dashboard" : "/shop");
    router.push(dest);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    const result = schema.safeParse({ email, password });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((e) => { if (e.path[0]) errs[e.path[0] as string] = e.message; });
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await doLogin(email, password);
    } catch (err: any) {
      // Show the exact server error inline — not just a toast
      const msg = err?.response?.data?.message || getErrorMessage(err);
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (cred: typeof DEMO_CREDENTIALS[0]) => {
    setApiError("");
    setErrors({});
    setDemoLoading(cred.role);
    // Pre-fill the form fields so the user can see what was used
    setEmail(cred.email);
    setPassword(cred.password);
    try {
      await doLogin(cred.email, cred.password);
    } catch (err: any) {
      const msg = err?.response?.data?.message || getErrorMessage(err);
      setApiError(msg || `Demo ${cred.role} account not found. Please seed the database first.`);
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-cyan-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-brand-700 transition-colors">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-brand-800" style={{ fontFamily: "var(--font-sora)" }}>
            Medi<span className="text-brand-500">Store</span>
          </span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="font-bold text-2xl text-gray-900 mb-1" style={{ fontFamily: "var(--font-sora)" }}>Welcome back</h1>
          <p className="text-gray-500 text-sm mb-6">Sign in to your account to continue</p>

          {/* Demo credential buttons */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Quick demo login</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => handleDemoLogin(cred)}
                  disabled={!!demoLoading || loading}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-semibold transition-all disabled:opacity-50 ${cred.color}`}
                >
                  {demoLoading === cred.role
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <cred.icon className="w-4 h-4" />
                  }
                  {cred.role}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">or sign in manually</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* API-level error banner */}
          {apiError && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm animate-fade-in">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5 text-red-500 font-bold text-xs">!</div>
              <p>{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setApiError(""); }}
                className={`input-field ${errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span className="font-bold">·</span> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setApiError(""); }}
                  className={`input-field pr-11 ${errors.password ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span className="font-bold">·</span> {errors.password}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading || !!demoLoading} className="btn-primary w-full py-3 text-base gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-brand-600 font-semibold hover:text-brand-800">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
