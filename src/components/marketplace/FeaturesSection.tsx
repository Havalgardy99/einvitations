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
    <section id="features" className="space-y-8 scroll-mt-24">
      <div className="market-divider mb-6" />
      <div className="text-center space-y-2">
        <h2 className="section-title">تایبەتمەندیەکان</h2>
        <p className="section-subtitle max-w-lg mx-auto">
          هەموو ئەوەی پێویستە بۆ بانگهێشتنامەیەکی دیجیتاڵی تەواو
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {marketplaceFeatures.map((feature) => {
          const Icon = iconMap[feature.icon] ?? Smartphone;
          return (
            <article
              key={feature.title}
              className="market-panel p-6 space-y-3 hover:shadow-lg hover:shadow-rose-100/40 transition-shadow"
            >
              <div className="icon-box">
                <Icon className="w-5 h-5 text-[#C2556A]" />
              </div>
              <h3 className="font-serif text-xl text-[#2D2A26]">{feature.title}</h3>
              <p className="text-sm text-[#7A7268] leading-relaxed">{feature.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
