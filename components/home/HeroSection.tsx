'use client';

import Link from "next/link";
import { ShoppingBag, ShieldCheck, Truck, Star, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white min-h-[88vh] flex items-center">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-brand-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Dot grid pattern */}
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="page-container relative z-10 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left content */}
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-brand-200 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            100% Over-The-Counter — No Prescription Needed
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-6 tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
            Your Health,
            <span className="block bg-gradient-to-r from-brand-300 to-cyan-300 bg-clip-text text-transparent">
              Delivered Fast
            </span>
          </h1>

          <p className="text-brand-200 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
            Shop from hundreds of verified OTC medicines. Trusted sellers, transparent pricing, and cash on delivery — right to your door.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link href="/shop"
              className="group flex items-center gap-2 bg-white text-brand-800 hover:bg-brand-50 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-base"
              style={{ fontFamily: "var(--font-sora)" }}>
              <ShoppingBag className="w-5 h-5" />
              Browse Medicines
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/register"
              className="flex items-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-2xl transition-all text-base backdrop-blur-sm"
              style={{ fontFamily: "var(--font-sora)" }}>
              Create Free Account
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 text-sm text-brand-300">
            {[
              { icon: ShieldCheck, text: "Verified Sellers" },
              { icon: Truck,       text: "Fast Delivery" },
              { icon: Star,        text: "5-Star Reviews" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2">
                <b.icon className="w-4 h-4 text-brand-400" />
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — floating medicine cards illustration */}
        <div className="hidden lg:flex items-center justify-center relative h-[480px]">
          {/* Center pill icon */}
          <div className="absolute w-40 h-40 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl z-10">
            <span className="text-7xl">💊</span>
          </div>

          {/* Floating category cards */}
          {[
            { emoji: "🌿", label: "Vitamins",    top: "4%",  left: "8%",   delay: "0s" },
            { emoji: "🤧", label: "Cold & Flu",  top: "4%",  right: "8%",  delay: "0.3s" },
            { emoji: "✨", label: "Skin Care",   bottom: "8%", left: "4%",  delay: "0.6s" },
            { emoji: "🫀", label: "Digestive",   bottom: "8%", right: "4%", delay: "0.9s" },
            { emoji: "👁️", label: "Eye & Ear",   top: "42%", left: "0%",   delay: "1.2s" },
            { emoji: "💊", label: "Pain Relief", top: "42%", right: "0%",  delay: "1.5s" },
          ].map((c) => (
            <div key={c.label}
              className="absolute bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-lg"
              style={{ top: c.top, left: (c as any).left, right: (c as any).right, bottom: (c as any).bottom,
                animation: `float 4s ease-in-out infinite`, animationDelay: c.delay }}>
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-sm font-semibold text-white">{c.label}</span>
            </div>
          ))}

          {/* Orbiting ring */}
          <div className="absolute w-72 h-72 border border-white/10 rounded-full" />
          <div className="absolute w-96 h-96 border border-white/5 rounded-full" />
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 28C840 36 960 40 1080 36C1200 32 1320 20 1380 14L1440 8V60H0Z" fill="#f8fffe"/>
        </svg>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}
