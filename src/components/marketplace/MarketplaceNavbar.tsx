import { useEffect, useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";

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
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0c0a09]/90 backdrop-blur-xl border-b border-[#D4AF37]/10 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={() => scrollTo("#hero")}
          className="flex items-center gap-2 text-[#F3EFE9] hover:text-[#D4AF37] transition-colors"
        >
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <span className="font-serif text-lg">Digital Invite</span>
        </button>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                type="button"
                onClick={() => scrollTo(link.href)}
                className="px-3 py-2 text-sm text-[#CBB084] hover:text-[#D4AF37] transition-colors rounded-lg hover:bg-[#D4AF37]/5"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => scrollTo("#contact")}
          className="hidden md:inline-flex btn-wine px-4 py-2 rounded-lg text-sm text-white font-medium"
        >
          ئۆردەر بکە
        </button>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-[#D4AF37]"
          aria-label={open ? "داخستن" : "مێنو"}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-[#0c0a09]/95 backdrop-blur-xl border-b border-[#D4AF37]/10 px-4 pb-4">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  type="button"
                  onClick={() => scrollTo(link.href)}
                  className="w-full text-right px-3 py-3 text-sm text-[#CBB084] hover:text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/5"
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => scrollTo("#contact")}
                className="w-full btn-wine mt-2 px-4 py-3 rounded-lg text-sm text-white font-medium"
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
