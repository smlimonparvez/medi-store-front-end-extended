import { UserPlus, Search, ShoppingCart, Package } from "lucide-react";

const steps = [
  { icon: UserPlus,     title: "Create Account",  desc: "Register as a customer in under a minute.",                    color: "bg-brand-50 text-brand-600" },
  { icon: Search,       title: "Browse & Search", desc: "Find medicines by name, category, or manufacturer.",           color: "bg-cyan-50 text-cyan-600" },
  { icon: ShoppingCart, title: "Add to Cart",      desc: "Select your medicines and review before checkout.",            color: "bg-emerald-50 text-emerald-600" },
  { icon: Package,      title: "Track Delivery",   desc: "Cash on delivery. Track status from placed to delivered.",     color: "bg-sky-50 text-sky-600" },
];

export default function HowItWorks() {
  return (
    <section className="py-20 page-container">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 text-brand-600 text-sm font-semibold mb-3">🚀 Simple Process</div>
        <h2 className="section-title">How It Works</h2>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">Order your medicines in 4 easy steps</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-brand-200 via-brand-300 to-brand-200 z-0" />
        {steps.map((step, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
            <div className="relative mb-5">
              <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                <step.icon className="w-7 h-7" />
              </div>
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {idx + 1}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-sora)" }}>{step.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
