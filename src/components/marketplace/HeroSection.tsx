import { ChevronDown } from "lucide-react";
import { brand } from "../../../shared/brand";
import BrandLogo from "./BrandLogo";

export default function HeroSection() {
  const scrollToTemplates = () => {
    document.querySelector("#templates")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="market-panel p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#F5E6E8] rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative flex flex-col items-center space-y-5">
        <BrandLogo size="lg" />

        <span className="section-label">
          {brand.taglineEn}
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#2D2A26] leading-tight max-w-2xl">
          {brand.tagline}
        </h1>

        <p className="max-w-xl mx-auto text-[#7A7268] text-sm sm:text-base leading-relaxed">
          بە شێوازی ئۆنڵاین شۆپ تێمپلەیت هەڵبژێرە، پێش ئۆردەرکردن live demo ببینە،
          دواتر فۆڕمی ئۆردەر پڕبکەرەوە — تیمی <span className="text-[#C2556A] font-medium">{brand.nameEn}</span> بانگهێشتنامەی تایبەتیت ئامادە دەکات.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={scrollToTemplates}
            className="btn-primary px-8 py-3.5 rounded-full font-medium text-sm"
          >
            تێمپلەیتەکان ببینە
          </button>
          <button
            type="button"
            onClick={() =>
              document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" })
            }
            className="btn-outline px-8 py-3.5 rounded-full text-sm font-medium"
          >
            چۆن کار دەکات
          </button>
        </div>

        <button
          type="button"
          onClick={scrollToTemplates}
          className="mx-auto block pt-6 text-[#C2556A]/50 hover:text-[#C2556A] transition-colors animate-bounce"
          aria-label="خوارەوە بڕۆ"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
