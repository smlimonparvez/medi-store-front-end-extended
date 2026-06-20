import Link from "next/link";
import { Pill, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-100 mt-20">
      <div className="page-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white" style={{ fontFamily: "var(--font-sora)" }}>
                Medi<span className="text-brand-300">Store</span>
              </span>
            </Link>
            <p className="text-sm text-brand-300 leading-relaxed">
              Your trusted online pharmacy. Quality OTC medicines from verified sellers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4" style={{ fontFamily: "var(--font-sora)" }}>Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Shop",     href: "/shop" },
                { label: "About Us", href: "/about" },
                { label: "Contact",  href: "/contact" },
                { label: "FAQ",      href: "/faq" },
                { label: "Login",    href: "/login" },
                { label: "Register", href: "/register" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-brand-300 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4" style={{ fontFamily: "var(--font-sora)" }}>Categories</h4>
            <ul className="space-y-2 text-sm text-brand-300">
              {["Pain Relief", "Vitamins", "Cold & Flu", "Digestive Health", "Skin Care"].map((c) => (
                <li key={c}><Link href={`/shop?search=${c}`} className="hover:text-white transition-colors">{c}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4" style={{ fontFamily: "var(--font-sora)" }}>Contact</h4>
            <ul className="space-y-3 text-sm text-brand-300">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-400 shrink-0" />+880 1700-000000</li>
              <li className="flex items-center gap-2"><Mail  className="w-4 h-4 text-brand-400 shrink-0" />support@medistore.com</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-brand-400">
          <p>© {new Date().getFullYear()} MediStore. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/about"   className="hover:text-brand-200 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-brand-200 transition-colors">Contact</Link>
            <Link href="/faq"     className="hover:text-brand-200 transition-colors">FAQ</Link>
            <span>OTC only — no prescription required</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
