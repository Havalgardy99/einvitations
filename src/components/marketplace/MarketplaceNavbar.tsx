import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";

const navLinks = [
  { href: "#templates", label: "تێمپلەیتەکان" },
  { href: "#features", label: "تایبەتمەندی" },
  { href: "#how-it-works", label: "چۆن کار دەکات" },
  { href: "#pricing", label: "نرخ" },
  { href: "#faq", label: "پرسیار" },
  { href: "#contact", label: "پەیوەندی" }
];

export default function MarketplaceNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-[#f0ebe6] shadow-sm shadow-rose-100/50"
          : "bg-white/60 backdrop-blur-md"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button type="button" onClick={() => scrollTo("#hero")} className="hover:opacity-80 transition-opacity">
          <BrandLogo size="sm" />
        </button>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                type="button"
                onClick={() => scrollTo(link.href)}
                className="px-3 py-2 text-sm text-[#7A7268] hover:text-[#C2556A] transition-colors rounded-lg hover:bg-[#F5E6E8]/60"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => scrollTo("#contact")}
          className="hidden md:inline-flex btn-primary px-5 py-2 rounded-full text-sm font-medium"
        >
          ئۆردەر بکە
        </button>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-[#C2556A]"
          aria-label={open ? "داخستن" : "مێنو"}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-[#f0ebe6] px-4 pb-4">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  type="button"
                  onClick={() => scrollTo(link.href)}
                  className="w-full text-right px-3 py-3 text-sm text-[#7A7268] hover:text-[#C2556A] rounded-lg hover:bg-[#F5E6E8]/60"
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => scrollTo("#contact")}
                className="w-full btn-primary mt-2 px-4 py-3 rounded-full text-sm font-medium"
              >
                ئۆردەر بکە
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
