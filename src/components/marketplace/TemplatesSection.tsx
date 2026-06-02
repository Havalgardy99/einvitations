import { PlayCircle, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import type { PublicTemplateCard } from "../../api/client";

interface Props {
  templates: PublicTemplateCard[];
  onOrder: (key: string) => void;
}

export default function TemplatesSection({ templates, onOrder }: Props) {
  return (
    <section id="templates" className="space-y-4 scroll-mt-24">
      <div className="gold-divider mb-6" />
      <h2 className="font-serif text-2xl text-[#D4AF37]">تێمپلەیتە بەردەستەکان</h2>
      <p className="text-sm text-[#A39081] max-w-xl">
        هەر تێمپلەیتێک live demo هەیە — پێش ئۆردەرکردن ببینە چۆن دەردەکەوێت.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((preset) => (
          <article key={preset.key} className="invite-card group">
            <div className="relative overflow-hidden">
              <img
                src={preset.previewImageUrl}
                alt={preset.name}
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-5 space-y-3">
              <p className="text-xs font-mono tracking-widest text-[#D4AF37]/80 uppercase">
                {preset.subtitle}
              </p>
              <h3 className="font-serif text-2xl text-[#F3EFE9]">{preset.name}</h3>
              <p className="text-sm text-[#A39081] leading-relaxed line-clamp-3">
                {preset.description}
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOrder(preset.key)}
                  className="btn-wine flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white"
                >
                  <ShoppingCart className="w-4 h-4" />
                  ئۆردەر
                </button>
                <Link
                  to={`/demo/${preset.key}`}
                  className="btn-gold-outline flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm"
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
        <p className="text-center text-[#A39081] py-12">تێمپلەیتەکان بار دەکرێن...</p>
      )}
    </section>
  );
}
