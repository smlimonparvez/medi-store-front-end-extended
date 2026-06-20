"use client";
import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/utils";
import { User, Phone, MapPin, Image as ImageIcon, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters"),
  phone:   z.string().min(10, "Phone must be at least 10 digits").optional().or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
  avatar:  z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name:    user?.name    || "",
    phone:   user?.phone   || "",
    address: user?.address || "",
    avatar:  user?.avatar  || "",
  });
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
      const res = await api.patch("/auth/profile", form);
      setUser(res.data.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const roleBadge = {
    customer: "bg-brand-50 text-brand-700",
    seller:   "bg-blue-50 text-blue-700",
    admin:    "bg-purple-50 text-purple-700",
  }[user?.role || "customer"];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="page-container py-8 max-w-2xl">
          <h1 className="font-bold text-3xl text-gray-900 mb-8" style={{ fontFamily: "var(--font-sora)" }}>My Profile</h1>

          {/* Avatar + info card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700 text-2xl shrink-0 overflow-hidden">
              {form.avatar
                ? <img src={form.avatar} alt={form.name} className="w-full h-full object-cover" />
                : user?.name[0].toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className={`badge mt-2 capitalize ${roleBadge}`}>{user?.role}</span>
            </div>
          </div>

          {/* Edit form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5" noValidate>
            <h2 className="font-semibold text-lg text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>Edit Information</h2>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand-500" /> Full Name <span className="text-red-400">*</span>
              </label>
              <input name="name" type="text" value={form.name} onChange={handleChange}
                className={`input-field ${errors.name ? "border-red-400" : ""}`} placeholder="Your full name" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-brand-500" /> Phone Number
              </label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                className={`input-field ${errors.phone ? "border-red-400" : ""}`} placeholder="01700000000" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-500" /> Address
              </label>
              <textarea name="address" rows={2} value={form.address} onChange={handleChange as any}
                className={`input-field resize-none ${errors.address ? "border-red-400" : ""}`}
                placeholder="Your delivery address" />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-brand-500" /> Avatar URL
              </label>
              <input name="avatar" type="url" value={form.avatar} onChange={handleChange}
                className={`input-field ${errors.avatar ? "border-red-400" : ""}`}
                placeholder="https://example.com/your-photo.jpg" />
              {errors.avatar && <p className="text-red-500 text-xs mt-1">{errors.avatar}</p>}
              {form.avatar && (
                <p className="text-xs text-gray-400 mt-1">Preview updates in the card above</p>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Email Address</p>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                  <p className="text-xs text-gray-300 mt-0.5">Email cannot be changed</p>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary gap-2 w-full py-3">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
