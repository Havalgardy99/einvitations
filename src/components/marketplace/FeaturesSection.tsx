import {
  Clock,
  MapPin,
  Palette,
  Share2,
  Smartphone,
  Users,
  type LucideIcon
} from "lucide-react";
import { marketplaceFeatures } from "../../../shared/marketplaceContent";

const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Palette,
  Users,
  Clock,
  MapPin,
  Share2
};

export default function FeaturesSection() {
  return (
    <section id="features" className="space-y-6 scroll-mt-24">
      <div className="gold-divider mb-6" />
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#D4AF37]">تایبەتمەندیەکان</h2>
        <p className="text-sm text-[#A39081] max-w-lg mx-auto">
          هەموو ئەوەی پێویستە بۆ بانگهێشتنامەیەکی دیجیتاڵی تەواو
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {marketplaceFeatures.map((feature) => {
          const Icon = iconMap[feature.icon] ?? Smartphone;
          return (
            <article
              key={feature.title}
              className="glass-panel rounded-2xl p-6 space-y-3 hover:border-[#D4AF37]/30 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif text-xl text-[#F3EFE9]">{feature.title}</h3>
              <p className="text-sm text-[#A39081] leading-relaxed">{feature.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
