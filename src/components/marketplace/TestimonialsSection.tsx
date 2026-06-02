import { Quote, Star } from "lucide-react";
import { marketplaceTestimonials } from "../../../shared/marketplaceContent";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="space-y-8 scroll-mt-24">
      <div className="market-divider mb-6" />
      <div className="text-center space-y-2">
        <h2 className="section-title">ڕای کڕیارەکان</h2>
        <p className="section-subtitle max-w-lg mx-auto">
          ئەو کەسانەی بانگهێشتنامەی دیجیتاڵیان لەگەڵمان دروست کرد
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {marketplaceTestimonials.map((t) => (
          <article key={t.name} className="market-panel p-6 space-y-4">
            <Quote className="w-8 h-8 text-[#E8A0A8]" />
            <p className="text-sm text-[#7A7268] leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex gap-0.5">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#E8A0A8] text-[#E8A0A8]" />
              ))}
            </div>
            <div className="market-divider" />
            <div>
              <p className="font-serif text-[#2D2A26]">{t.name}</p>
              <p className="text-xs text-[#7A7268] mt-0.5">{t.event}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
