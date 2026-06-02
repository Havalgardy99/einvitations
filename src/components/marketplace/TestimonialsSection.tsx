import { Quote, Star } from "lucide-react";
import { marketplaceTestimonials } from "../../../shared/marketplaceContent";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="space-y-6 scroll-mt-24">
      <div className="gold-divider mb-6" />
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#D4AF37]">ڕای کڕیارەکان</h2>
        <p className="text-sm text-[#A39081] max-w-lg mx-auto">
          ئەو کەسانەی بانگهێشتنامەی دیجیتاڵیان لەگەڵمان دروست کرد
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {marketplaceTestimonials.map((t) => (
          <article key={t.name} className="glass-panel rounded-2xl p-6 space-y-4">
            <Quote className="w-8 h-8 text-[#D4AF37]/30" />
            <p className="text-sm text-[#CBB084] leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex gap-0.5">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              ))}
            </div>
            <div className="gold-divider" />
            <div>
              <p className="font-serif text-[#F3EFE9]">{t.name}</p>
              <p className="text-xs text-[#A39081] mt-0.5">{t.event}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
