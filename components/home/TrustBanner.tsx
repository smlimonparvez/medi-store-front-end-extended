import Link from "next/link";
import { ShieldCheck, Clock, Headphones, CreditCard } from "lucide-react";

const trust = [
  { icon: ShieldCheck, title: "Verified Sellers",   desc: "Every seller is reviewed and approved" },
  { icon: Clock,       title: "Fast Delivery",       desc: "Order processed within 24 hours" },
  { icon: Headphones,  title: "24/7 Support",        desc: "We're here to help anytime" },
  { icon: CreditCard,  title: "Cash on Delivery",    desc: "Pay when your order arrives" },
];

export default function TrustBanner() {
  return (
    <>
      <section className="py-16 bg-brand-700 text-white">
        <div className="page-container grid grid-cols-2 lg:grid-cols-4 gap-8">
          {trust.map((t, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center">
                <t.icon className="w-6 h-6 text-brand-200" />
              </div>
              <div>
                <div className="font-bold text-lg" style={{ fontFamily: "var(--font-sora)" }}>{t.title}</div>
                <div className="text-brand-300 text-sm mt-0.5">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 page-container">
        <div className="bg-gradient-to-r from-brand-600 to-cyan-600 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <h2 className="font-bold text-3xl md:text-4xl mb-4" style={{ fontFamily: "var(--font-sora)" }}>
              Ready to order your medicines?
            </h2>
            <p className="text-brand-100 text-lg mb-8 max-w-lg mx-auto">
              Join thousands of customers who trust MediStore for their health needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop"     className="bg-white text-brand-700 font-bold px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors shadow-md" style={{ fontFamily: "var(--font-sora)" }}>Shop Now</Link>
              <Link href="/register" className="border-2 border-white/60 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors" style={{ fontFamily: "var(--font-sora)" }}>Register Free</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
