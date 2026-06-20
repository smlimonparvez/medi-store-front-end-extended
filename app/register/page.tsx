"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/utils";
import { Pill, Eye, EyeOff, Loader2, ShoppingBag, Store } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone:    z.string().min(10, "Phone must be at least 10 digits").optional().or(z.literal("")),
  role:     z.enum(["customer", "seller"]),
});

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ name: "", email: "", password: "", phone: "", role: "customer" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((e) => { if (e.path[0]) errs[e.path[0] as string] = e.message; });
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      toast.success("Account created! Please login.");
      router.push("/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-cyan-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-md">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-brand-800" style={{ fontFamily: "var(--font-sora)" }}>
            Medi<span className="text-brand-500">Store</span>
          </span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="font-bold text-2xl text-gray-900 mb-1" style={{ fontFamily: "var(--font-sora)" }}>Create your account</h1>
          <p className="text-gray-500 text-sm mb-8">Join MediStore today — it's free</p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Role selector */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "customer", label: "Buy Medicines", icon: ShoppingBag, desc: "Order for myself" },
                  { value: "seller",   label: "Sell Medicines", icon: Store,       desc: "List my products" },
                ].map((r) => (
                  <button key={r.value} type="button" onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${form.role === r.value ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-brand-200"}`}>
                    <r.icon className={`w-6 h-6 ${form.role === r.value ? "text-brand-600" : "text-gray-400"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${form.role === r.value ? "text-brand-700" : "text-gray-700"}`}>{r.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {[
              { name: "name",  label: "Full Name",  type: "text",  placeholder: "John Doe",       required: true },
              { name: "email", label: "Email",       type: "email", placeholder: "you@example.com", required: true },
              { name: "phone", label: "Phone (optional)", type: "tel", placeholder: "01700000000", required: false },
            ].map((f) => (
              <div key={f.name}>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  {f.label} {f.required && <span className="text-red-400">*</span>}
                </label>
                <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name as keyof typeof form]} onChange={handleChange} className={`input-field ${errors[f.name] ? "border-red-400" : ""}`} />
                {errors[f.name] && <p className="text-red-500 text-xs mt-1">{errors[f.name]}</p>}
              </div>
            ))}

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <input name="password" type={showPass ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={handleChange} className={`input-field pr-11 ${errors.password ? "border-red-400" : ""}`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-600 font-semibold hover:text-brand-800">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
