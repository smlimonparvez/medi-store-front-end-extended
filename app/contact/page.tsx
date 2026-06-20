"use client";
import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters"),
  email:   z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

const contactInfo = [
  { icon: Phone,  label: "Phone",   value: "+880 1700-000000",      sub: "Mon–Sat, 9am–6pm" },
  { icon: Mail,   label: "Email",   value: "support@medistore.com", sub: "We reply within 24h" },
  { icon: MapPin, label: "Address", value: "Dhaka, Bangladesh",     sub: "Head Office" },
];

export default function ContactPage() {
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

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
    // Simulate sending (no backend endpoint for contact yet)
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="page-container relative z-10 text-center max-w-2xl mx-auto">
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-sora)" }}>Get in Touch</h1>
            <p className="text-brand-200 text-lg">
              Have a question, issue, or just want to say hello? We'd love to hear from you.
            </p>
          </div>
        </section>

        <section className="py-20 page-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Contact info */}
            <div className="space-y-6">
              <h2 className="font-bold text-2xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>
                Contact Information
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Reach us through any of these channels and we'll get back to you as soon as possible.
              </p>
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{c.label}</p>
                    <p className="text-gray-700 text-sm">{c.value}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{c.sub}</p>
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div className="bg-brand-50 rounded-2xl border border-brand-100 p-6 text-center mt-4">
                <MapPin className="w-8 h-8 text-brand-400 mx-auto mb-2" />
                <p className="text-sm text-brand-600 font-medium">Dhaka, Bangladesh</p>
                <p className="text-xs text-brand-400 mt-1">Business hours: Mon–Sat 9am–6pm</p>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16 animate-fade-in">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900 mb-3" style={{ fontFamily: "var(--font-sora)" }}>
                    Message Sent!
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    Thanks for reaching out, <strong>{form.name}</strong>. We'll reply to <strong>{form.email}</strong> within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-8 btn-outline"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5" noValidate>
                  <h2 className="font-bold text-2xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>
                    Send Us a Message
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Your Name <span className="text-red-400">*</span></label>
                      <input name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange}
                        className={`input-field ${errors.name ? "border-red-400" : ""}`} />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email <span className="text-red-400">*</span></label>
                      <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange}
                        className={`input-field ${errors.email ? "border-red-400" : ""}`} />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Subject <span className="text-red-400">*</span></label>
                    <input name="subject" type="text" placeholder="How can we help?" value={form.subject} onChange={handleChange}
                      className={`input-field ${errors.subject ? "border-red-400" : ""}`} />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Message <span className="text-red-400">*</span></label>
                    <textarea name="message" rows={6} placeholder="Tell us everything..." value={form.message} onChange={handleChange}
                      className={`input-field resize-none ${errors.message ? "border-red-400" : ""}`} />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    <p className="text-xs text-gray-400 mt-1">{form.message.length}/500 characters</p>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base gap-2" style={{ fontFamily: "var(--font-sora)" }}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
