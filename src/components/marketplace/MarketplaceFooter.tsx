import { Heart, Instagram, Sparkles } from "lucide-react";
import { marketplaceContact } from "../../../shared/marketplaceContent";

const footerLinks = [
  { href: "#templates", label: "تێمپلەیتەکان" },
  { href: "#features", label: "تایبەتمەندی" },
  { href: "#pricing", label: "نرخ" },
  { href: "#faq", label: "پرسیار" },
  { href: "#contact", label: "پەیوەندی" }
];

export default function MarketplaceFooter() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="mt-16 border-t border-[#D4AF37]/10">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-serif text-xl text-[#F3EFE9]">Digital Invite</span>
            </div>
            <p className="text-sm text-[#A39081] leading-relaxed">
              بانگهێشتنامەی دیجیتاڵی هاوسەرگیری بە دیزاینی جوان و تایبەت.
              لە ٤٨ کاتژمێردا ئامادە دەبێت.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-[#D4AF37]">بەستەرەکان</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-[#A39081] hover:text-[#D4AF37] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-[#D4AF37]">پەیوەندی</h4>
            <ul className="space-y-2 text-sm text-[#A39081]">
              <li dir="ltr">{marketplaceContact.phone}</li>
              <li dir="ltr">{marketplaceContact.email}</li>
              <li>
                <a
                  href={marketplaceContact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="gold-divider" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A39081]">
          <p>
            &copy; {new Date().getFullYear()} Digital Invite. هەموو مافەکان پارێزراون.
          </p>
          <p className="inline-flex items-center gap-1">
            دروستکراوە بە <Heart className="w-3 h-3 text-[#6d1520]" /> بۆ ئاهەنگە جوانەکان
          </p>
        </div>
      </div>
    </footer>
  );
}
