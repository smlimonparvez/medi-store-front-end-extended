import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ShieldCheck, Truck, HeartPulse, Users, Star, Pill } from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    desc: "Every seller on MediStore goes through a verification process. We only list genuine, quality OTC medicines with clear pricing.",
    color: "bg-brand-50 text-brand-600",
  },
  {
    icon: HeartPulse,
    title: "Health First",
    desc: "Our platform is designed with your health in mind. We strictly list OTC medicines only — no prescription drugs, no grey areas.",
    color: "bg-red-50 text-red-500",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    desc: "We partner with sellers who take delivery seriously. Cash on delivery means you pay only when you're happy.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Users,
    title: "Community Driven",
    desc: "From customers leaving honest reviews to sellers keeping stock fresh — our whole platform runs on a community of trust.",
    color: "bg-purple-50 text-purple-600",
  },
];

const team = [
  { name: "Dr. Farhan Kabir",    role: "Medical Advisor",       avatar: "F", color: "bg-brand-100 text-brand-700" },
  { name: "Sadia Rahman",        role: "Head of Operations",    avatar: "S", color: "bg-pink-100 text-pink-700" },
  { name: "Mehedi Hasan",        role: "Lead Developer",        avatar: "M", color: "bg-emerald-100 text-emerald-700" },
  { name: "Nusrat Jahan",        role: "Seller Relations",      avatar: "N", color: "bg-purple-100 text-purple-700" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="page-container relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-brand-200 text-sm font-medium mb-6">
              <Pill className="w-4 h-4" /> About MediStore
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "var(--font-sora)" }}>
              Healthcare Made
              <span className="block text-brand-300">Simple & Accessible</span>
            </h1>
            <p className="text-brand-200 text-xl leading-relaxed">
              MediStore was founded with one mission: make it easy for every Bangladeshi family to access genuine, affordable over-the-counter medicines — from the comfort of their home.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 page-container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-5">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Every year, millions of people in Bangladesh struggle to find trusted medicines quickly, especially in emergencies. Counterfeit products, inflated prices, and long pharmacy queues make a simple task frustrating.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                MediStore solves this by connecting customers directly with verified pharmacies and sellers — with transparent pricing, genuine products, and cash on delivery.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We are not just a marketplace. We're a platform built on trust, serving both the people who need medicines and the sellers who want to grow their pharmacy business online.
              </p>
            </div>
            <div className="bg-gradient-to-br from-brand-50 to-cyan-50 rounded-3xl p-10 text-center border border-brand-100">
              <span className="text-8xl block mb-4">💊</span>
              <p className="text-brand-700 font-semibold text-lg" style={{ fontFamily: "var(--font-sora)" }}>
                "Your health is our priority."
              </p>
              <p className="text-brand-500 text-sm mt-2">— The MediStore Team</p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-50/50">
          <div className="page-container">
            <div className="text-center mb-14">
              <h2 className="section-title">Our Core Values</h2>
              <p className="text-gray-500 mt-3">The principles that guide everything we do</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => (
                <div key={v.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl ${v.color} flex items-center justify-center mb-5`}>
                    <v.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-sora)" }}>{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 page-container">
          <div className="text-center mb-14">
            <h2 className="section-title">Meet the Team</h2>
            <p className="text-gray-500 mt-3">The people working to improve your healthcare access</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {team.map((m) => (
              <div key={m.name} className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-2xl ${m.color} flex items-center justify-center font-bold text-2xl mb-4 shadow-sm`}>
                  {m.avatar}
                </div>
                <p className="font-bold text-gray-900 text-sm" style={{ fontFamily: "var(--font-sora)" }}>{m.name}</p>
                <p className="text-gray-400 text-xs mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-brand-600 text-white">
          <div className="page-container text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-sora)" }}>
              Ready to experience MediStore?
            </h2>
            <p className="text-brand-200 mb-8 text-lg">Join thousands of customers who trust us every day.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/shop" className="bg-white text-brand-700 font-bold px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors shadow-md" style={{ fontFamily: "var(--font-sora)" }}>
                Browse Medicines
              </Link>
              <Link href="/register" className="border-2 border-white/50 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors" style={{ fontFamily: "var(--font-sora)" }}>
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
