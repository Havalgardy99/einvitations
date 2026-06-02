import { Heart, Instagram } from "lucide-react";
import { brand } from "../../../shared/brand";
import { marketplaceContact } from "../../../shared/marketplaceContent";
import BrandLogo from "./BrandLogo";

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
    <footer className="mt-16 border-t border-[#F0EBE6] bg-white/50">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <BrandLogo size="md" />
            <p className="text-sm text-[#7A7268] leading-relaxed">
              {brand.tagline} بە دیزاینی جوان و تایبەت.
              لە ٤٨ کاتژمێردا ئامادە دەبێت.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-[#2D2A26]">بەستەرەکان</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-[#7A7268] hover:text-[#C2556A] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-[#2D2A26]">پەیوەندی</h4>
            <ul className="space-y-2 text-sm text-[#7A7268]">
              <li dir="ltr">{marketplaceContact.phone}</li>
              <li dir="ltr">{marketplaceContact.email}</li>
              <li>
                <a
                  href={marketplaceContact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-[#C2556A] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="market-divider" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A7268]">
          <p>
            &copy; {new Date().getFullYear()} {brand.nameEn} ({brand.nameKu}). هەموو مافەکان پارێزراون.
          </p>
          <p className="inline-flex items-center gap-1">
            دروستکراوە بە <Heart className="w-3 h-3 text-[#C2556A]" /> بۆ ئاهەنگە جوانەکان
          </p>
        </div>
      </div>
    </footer>
  );
}
