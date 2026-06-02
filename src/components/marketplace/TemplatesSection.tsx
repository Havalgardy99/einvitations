import { PlayCircle, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import type { PublicTemplateCard } from "../../api/client";

interface Props {
  templates: PublicTemplateCard[];
  onOrder: (key: string) => void;
}

export default function TemplatesSection({ templates, onOrder }: Props) {
  return (
    <section id="templates" className="space-y-5 scroll-mt-24">
      <div className="market-divider mb-6" />
      <div>
        <h2 className="section-title">تێمپلەیتە بەردەستەکان</h2>
        <p className="section-subtitle mt-2 max-w-xl">
          هەر تێمپلەیتێک live demo هەیە — پێش ئۆردەرکردن ببینە چۆن دەردەکەوێت.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((preset) => (
          <article key={preset.key} className="market-card group">
            <div className="relative overflow-hidden">
              <img
                src={preset.previewImageUrl}
                alt={preset.name}
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-5 space-y-3">
              <p className="text-xs tracking-widest text-[#B8976A] uppercase font-medium">
                {preset.subtitle}
              </p>
              <h3 className="font-serif text-2xl text-[#2D2A26]">{preset.name}</h3>
              <p className="text-sm text-[#7A7268] leading-relaxed line-clamp-3">
                {preset.description}
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onOrder(preset.key)}
                  className="btn-primary flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  ئۆردەر
                </button>
                <Link
                  to={`/demo/${preset.key}`}
                  className="btn-outline flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm"
                >
                  <PlayCircle className="w-4 h-4" />
                  Live Demo
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      {templates.length === 0 && (
        <p className="text-center text-[#7A7268] py-12">تێمپلەیتەکان بار دەکرێن...</p>
      )}
    </section>
  );
}
