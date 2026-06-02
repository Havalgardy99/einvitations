import React, { useEffect, useMemo, useState } from "react";
import { PlayCircle, ShoppingCart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { PublicTemplateCard } from "../api/client";

export default function HomePage() {
  const [templates, setTemplates] = useState<PublicTemplateCard[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const selected = useMemo(
    () => templates.find((preset) => preset.key === selectedTemplate) ?? null,
    [templates, selectedTemplate]
  );

  useEffect(() => {
    api.listTemplateCards().then(setTemplates).catch(() => setTemplates([]));
  }, []);

  const onSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !customerName.trim() || !phone.trim()) return;
    setLoading(true);
    try {
      await api.createOrder({
        templateKey: selectedTemplate,
        customerName: customerName.trim(),
        phone: phone.trim(),
        notes: notes.trim() || undefined
      });
      setDone(true);
      setCustomerName("");
      setPhone("");
      setNotes("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="admin-root min-h-screen">
      <div className="admin-noise" aria-hidden />
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10">
        <section className="glass-panel rounded-3xl p-6 sm:p-10 text-center space-y-5">
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
          <p className="text-xs text-[#A39081]">داشبۆرد تەنها بۆ بەڕێوەبەرە و نەبینراوە لەم پەڕەیە.</p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-[#D4AF37]">تێمپلەیتە بەردەستەکان</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {templates.map((preset) => (
              <article key={preset.key} className="invite-card overflow-hidden">
                <img
                  src={preset.previewImageUrl}
                  alt={preset.name}
                  className="h-56 w-full object-cover"
                />
                <div className="p-5 space-y-3">
                  <p className="text-xs font-mono tracking-widest text-[#D4AF37]/80 uppercase">
                    {preset.subtitle}
                  </p>
                  <h3 className="font-serif text-2xl text-[#F3EFE9]">{preset.name}</h3>
                  <p className="text-sm text-[#A39081] leading-relaxed">
                    {preset.description}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to={`/demo/${preset.key}`}
                      className="btn-gold-outline inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Live Demo
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedTemplate(preset.key);
                        setDone(false);
                      }}
                      className="btn-wine inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      ئۆردەر
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {selected && (
          <section className="glass-panel rounded-2xl p-6 sm:p-8">
            <h3 className="font-serif text-2xl text-[#F3EFE9] mb-1">
              ئۆردەرکردن: {selected.name}
            </h3>
            <p className="text-sm text-[#A39081] mb-5">
              زانیارییەکان پڕبکەرەوە بۆ وەرگرتنی وێبسایتی تایبەتت
            </p>
            <form onSubmit={onSubmitOrder} className="grid sm:grid-cols-2 gap-4">
              <input
                className="input-luxury"
                placeholder="ناوی تەواو"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <input
                className="input-luxury"
                placeholder="ژمارەی مۆبایل"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <textarea
                className="input-luxury sm:col-span-2 min-h-[90px]"
                placeholder="تێبینی (ئەرکیاری)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-wine sm:col-span-2 rounded-xl px-5 py-3 text-white font-bold disabled:opacity-60"
              >
                {loading ? "چاوەڕێبە..." : "ناردنی ئۆردەر"}
              </button>
            </form>
            {done && (
              <p className="mt-4 text-emerald-300 text-sm">
                ئۆردەرەکەت بە سەرکەوتوویی نێردرا. لە زوترین کاتدا پەیوەندیت پێوە دەکرێت.
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
