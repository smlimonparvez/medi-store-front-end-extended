import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rafi Ahmed",
    role: "Regular Customer",
    avatar: "R",
    color: "bg-brand-100 text-brand-700",
    rating: 5,
    text: "MediStore has made buying medicines so easy. I ordered Napa and Vitamin C tablets and they arrived the next day. The prices are great and everything was genuine.",
  },
  {
    name: "Tasnim Jahan",
    role: "Mother of two",
    avatar: "T",
    color: "bg-pink-100 text-pink-700",
    rating: 5,
    text: "I was skeptical about buying medicines online, but MediStore changed my mind. The sellers are verified and the ordering process is simple. Highly recommend!",
  },
  {
    name: "Karim Hossain",
    role: "Pharmacy Owner",
    avatar: "K",
    color: "bg-emerald-100 text-emerald-700",
    rating: 5,
    text: "As a seller on MediStore, managing my inventory has never been easier. The dashboard is intuitive and orders come in regularly. A great platform for pharmacy businesses.",
  },
  {
    name: "Nadia Islam",
    role: "Fitness Enthusiast",
    avatar: "N",
    color: "bg-purple-100 text-purple-700",
    rating: 4,
    text: "I buy my vitamins and supplements from MediStore every month. The variety is impressive and the search filters make it easy to find exactly what I need.",
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} className={`w-4 h-4 ${s <= count ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-brand-50/40 to-white">
      <div className="page-container">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-brand-600 text-sm font-semibold mb-3">
            ⭐ Customer Stories
          </div>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Thousands of happy customers trust MediStore for their health needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 hover:shadow-md transition-shadow duration-300 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-12 h-12 text-brand-600" />
              </div>

              {/* Rating */}
              <StarRow count={t.rating} />

              {/* Text */}
              <p className="text-gray-600 leading-relaxed mt-4 mb-6 text-sm">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold text-sm shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm" style={{ fontFamily: "var(--font-sora)" }}>
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
