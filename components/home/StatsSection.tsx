"use client";
import { useEffect, useRef, useState } from "react";
import { Users, Package, ShoppingBag, Star } from "lucide-react";

const stats = [
  { icon: Package,     value: 500,  suffix: "+", label: "Medicines Listed",   color: "text-brand-600" },
  { icon: Users,       value: 1200, suffix: "+", label: "Happy Customers",    color: "text-cyan-600" },
  { icon: ShoppingBag, value: 80,   suffix: "+", label: "Verified Sellers",   color: "text-emerald-600" },
  { icon: Star,        value: 4.8,  suffix: "",  label: "Average Rating",     color: "text-yellow-500", decimal: true },
];

function useCounter(target: number, duration = 1800, decimal = false) {
  const [count, setCount] = useState(0);
  const ref = useRef<boolean>(false);

  const start = () => {
    if (ref.current) return;
    ref.current = true;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(decimal ? parseFloat((eased * target).toFixed(1)) : Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return { count, start };
}

function StatCard({ stat }: { stat: typeof stats[0] }) {
  const { count, start } = useCounter(stat.value, 1800, stat.decimal);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) start(); },
      { threshold: 0.5 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={cardRef} className="flex flex-col items-center text-center group">
      <div className={`w-14 h-14 rounded-2xl bg-gray-50 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center mb-4 shadow-sm`}>
        <stat.icon className={`w-7 h-7 ${stat.color}`} />
      </div>
      <div className={`text-4xl font-bold mb-1 ${stat.color}`} style={{ fontFamily: "var(--font-sora)" }}>
        {count}{stat.suffix}
      </div>
      <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="page-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((s) => <StatCard key={s.label} stat={s} />)}
        </div>
      </div>
    </section>
  );
}
