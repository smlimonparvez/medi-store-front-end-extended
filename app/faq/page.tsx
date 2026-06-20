"use client";
import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Link from "next/link";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "Orders & Delivery",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse medicines in our shop, add them to your cart, then go to checkout. Fill in your shipping address and phone number. We only offer Cash on Delivery — pay when your order arrives.",
      },
      {
        q: "How long does delivery take?",
        a: "Delivery time depends on your location and the seller. Most sellers process orders within 24 hours. Delivery within Dhaka typically takes 1–2 business days, and outside Dhaka takes 2–4 business days.",
      },
      {
        q: "Can I cancel my order?",
        a: 'Yes! You can cancel an order as long as its status is still "Placed". Once the seller marks it as "Processing", cancellation is no longer possible. To cancel, go to My Orders → Order Detail → Cancel Order.',
      },
      {
        q: "What if I receive the wrong item?",
        a: "Please contact our support team at support@medistore.com with your order number and photos of what you received. We'll resolve it within 48 hours.",
      },
    ],
  },
  {
    category: "Medicines & Safety",
    items: [
      {
        q: "Are all medicines on MediStore genuine?",
        a: "All sellers on MediStore are verified before they can list products. We only allow OTC (over-the-counter) medicines. However, if you ever suspect a product is fake, please report it to us immediately.",
      },
      {
        q: "Do I need a prescription?",
        a: "No. MediStore exclusively lists Over-The-Counter (OTC) medicines that do not require a prescription. We do not allow prescription-only medicines on our platform.",
      },
      {
        q: "How do I know if a medicine is right for me?",
        a: "We always recommend consulting a doctor or pharmacist before starting any new medicine, even OTC ones. MediStore provides product descriptions to help you make informed decisions, but we are not a substitute for medical advice.",
      },
    ],
  },
  {
    category: "Account & Profile",
    items: [
      {
        q: "How do I update my profile information?",
        a: "Go to Profile (click your name in the navbar). You can update your name, phone number, delivery address, and avatar URL from there.",
      },
      {
        q: "Can I change my account role?",
        a: "No. Once you register as a customer or seller, your role is fixed. If you need a different role, please create a new account or contact support.",
      },
      {
        q: "My account was banned. What do I do?",
        a: "If your account was banned and you believe it was a mistake, email us at support@medistore.com with your account email and we'll review your case within 2–3 business days.",
      },
    ],
  },
  {
    category: "For Sellers",
    items: [
      {
        q: "How do I start selling on MediStore?",
        a: "Register as a seller, then go to your Seller Dashboard → My Medicines → Add Medicine. Fill in the medicine name, price, stock, category, and optionally an image URL.",
      },
      {
        q: "How do I update an order status?",
        a: "Go to Seller Dashboard → My Orders. You'll see all orders containing your medicines. Use the status buttons to move an order from Placed → Processing → Shipped → Delivered.",
      },
      {
        q: "What happens if I run out of stock?",
        a: "When stock hits 0, the medicine is automatically shown as 'Out of Stock' in the shop and customers can't add it to their cart. Update your stock any time from My Medicines.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white hover:bg-gray-50/70 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm" style={{ fontFamily: "var(--font-sora)" }}>
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-brand-500 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96" : "max-h-0"}`}>
        <div className="px-5 pb-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
          {a}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("Orders & Delivery");

  const current = faqs.find((f) => f.category === activeCategory);

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="page-container relative z-10 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-brand-300" />
            </div>
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-sora)" }}>
              Frequently Asked Questions
            </h1>
            <p className="text-brand-200 text-lg">
              Everything you need to know about MediStore. Can't find an answer?{" "}
              <Link href="/contact" className="text-white font-semibold underline underline-offset-2 hover:text-brand-200">
                Contact us.
              </Link>
            </p>
          </div>
        </section>

        <section className="py-20 page-container">
          <div className="max-w-4xl mx-auto">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {faqs.map((f) => (
                <button
                  key={f.category}
                  onClick={() => setActiveCategory(f.category)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeCategory === f.category
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-brand-300"
                  }`}
                >
                  {f.category}
                </button>
              ))}
            </div>

            {/* Questions */}
            {current && (
              <div className="space-y-3 animate-fade-in">
                {current.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            )}

            {/* Still need help */}
            <div className="mt-16 bg-brand-50 rounded-2xl border border-brand-100 p-8 text-center">
              <h3 className="font-bold text-xl text-gray-900 mb-3" style={{ fontFamily: "var(--font-sora)" }}>
                Still have questions?
              </h3>
              <p className="text-gray-500 mb-6">
                Our support team is here to help. Send us a message and we'll get back to you within 24 hours.
              </p>
              <Link href="/contact" className="btn-primary gap-2">
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
