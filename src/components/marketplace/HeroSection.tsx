import { ChevronDown, Sparkles } from "lucide-react";

export default function HeroSection() {
  const scrollToTemplates = () => {
    document.querySelector("#templates")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="glass-panel rounded-3xl p-6 sm:p-10 text-center space-y-5">
      <span className="inline-flex items-center gap-2 text-xs tracking-widest text-[#D4AF37] font-mono">
        <Sparkles className="w-4 h-4" />
        DIGITAL INVITATIONS
      </span>
      <h1 className="font-serif text-3xl sm:text-5xl text-[#F3EFE9] leading-tight">
        تێمپلەیتی بانگهێشتنامەی هاوسەرگیری
      </h1>
      <p className="max-w-2xl mx-auto text-[#CBB084] text-sm sm:text-base leading-relaxed">
        بە شێوازی ئۆنڵاین شۆپ تێمپلەیت هەڵبژێرە، پێش ئۆردەرکردن live demo ببینە،
        دواتر فۆڕمی ئۆردەر پڕبکەرەوە بۆ ئەوەی تیمی ئێمە بانگهێشتنامەی تایبەتیت بۆ ئامادە بکات.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={scrollToTemplates}
          className="btn-wine px-6 py-3 rounded-xl text-white font-medium text-sm"
        >
          تێمپلەیتەکان ببینە
        </button>
        <button
          type="button"
          onClick={() =>
            document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" })
          }
          className="btn-gold-outline px-6 py-3 rounded-xl text-sm font-medium"
        >
          چۆن کار دەکات
        </button>
      </div>
      <p className="text-xs text-[#A39081]">
        داشبۆرد تەنها بۆ بەڕێوەبەرە و نەبینراوە لەم پەڕەیە.
      </p>
      <button
        type="button"
        onClick={scrollToTemplates}
        className="mx-auto block pt-4 text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors animate-bounce"
        aria-label="خوارەوە بڕۆ"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  );
}
