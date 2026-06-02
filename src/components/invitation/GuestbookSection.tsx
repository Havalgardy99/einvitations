import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Send } from "lucide-react";
import type { GuestbookEntry, InvitationTemplate } from "../../types";
import { api } from "../../api/client";

interface GuestbookSectionProps {
  slug: string;
  config: InvitationTemplate;
  /** Full-page layout with larger comment cards */
  standalone?: boolean;
}

export default function GuestbookSection({
  slug,
  config,
  standalone = false
}: GuestbookSectionProps) {
  const [comments, setComments] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", message: "", emoji: "❤️" });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    api
      .getGuestbook(slug)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    setSubmitting(true);
    try {
      const entry = await api.submitGuestbook(slug, {
        name: form.name.trim(),
        message: form.message.trim(),
        emoji: form.emoji
      });
      setComments((prev) => [entry, ...prev]);
      setForm({ name: "", message: "", emoji: "❤️" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`space-y-6 ${standalone ? "pb-8" : ""}`}>
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-[#FCFAF2]/95 border-2 border-[#CBB084]/65 rounded-3xl p-5 shadow-lg space-y-4 relative sticky top-0 z-10"
      >
        <div className="absolute inset-2 border border-[#CBB084]/15 rounded-2xl pointer-events-none" />
        <h3 className="font-serif text-base font-bold text-[#1C0F11] text-center relative z-10">
          نامەی پیرۆزبایی بنووسە ✍️
        </h3>
        <div className="space-y-3 relative z-10 text-right">
          <input
            required
            placeholder="ناوی بەڕێزتان"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-[#1A0A0C]/5 border-2 border-[#CBB084]/40 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:border-[#D4AF37] text-[#1C0F11] font-semibold"
          />
          <textarea
            required
            rows={standalone ? 4 : 3}
            placeholder="پەیامی پڕ لە خۆشەویستی و پیرۆزبایی دڵسۆزانەتان لێرە بنووسن..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-[#1A0A0C]/5 border-2 border-[#CBB084]/40 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:border-[#D4AF37] resize-none text-[#1C0F11] font-semibold"
          />
          <div className="flex items-center gap-2 flex-row-reverse flex-wrap">
            <span className="text-[10px] font-mono text-[#6D1520] font-bold uppercase shrink-0">
              ئیمۆجی:
            </span>
            <div className="flex gap-1.5 flex-wrap justify-end grow">
              {["❤️", "🥂", "💍", "✨", "🎉", "🌸"].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setForm({ ...form, emoji })}
                  className={`text-xl p-2 rounded-xl transition-all ${
                    form.emoji === emoji
                      ? "bg-[#6D1520]/15 ring-2 ring-[#D4AF37]/50 scale-110"
                      : "hover:bg-[#6D1520]/5"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#6D1520] hover:bg-[#4D0A11] disabled:opacity-60 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {submitting ? "ناردن..." : "ناردنی مۆر و پیرۆزبایی"}
            <Send className="w-3.5 h-3.5 text-amber-200" />
          </button>
        </div>
      </motion.form>

      <section className="space-y-4">
        <div className="flex items-center justify-between flex-row-reverse border-b border-[#CBB084]/30 pb-3">
          <h2 className="font-serif text-lg text-[#F5E6D3] flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]/30" />
            هەموو پیرۆزباییەکان
          </h2>
          <span className="text-xs font-mono bg-[#6D1520]/30 text-[#D4AF37] px-3 py-1 rounded-full border border-[#D4AF37]/25">
            {comments.length} نامە
          </span>
        </div>

        {loading ? (
          <p className="text-center text-[#A39081] text-sm py-12">بارکردن...</p>
        ) : comments.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-[#CBB084]/25">
            <p className="text-[#CBB084] text-sm">هێشتا هیچ نامەیەک نییە</p>
            <p className="text-[#A39081] text-xs mt-2">یەکەمین کەس بە!</p>
          </div>
        ) : (
          <div
            className={
              standalone
                ? "grid gap-4 sm:grid-cols-1"
                : "space-y-3 max-h-96 overflow-y-auto pr-1"
            }
          >
            <AnimatePresence initial={false}>
              {comments.map((comment, i) => (
                <motion.article
                  key={comment.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className={`relative text-right bg-[#FCFAF2] border border-[#CBB084]/40 rounded-2xl shadow-md overflow-hidden ${
                    standalone ? "p-5 sm:p-6" : "p-4 pl-12"
                  }`}
                >
                  <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#D4AF37] to-[#6D1520]" />
                  <div className="flex items-start justify-between flex-row-reverse gap-3 mb-3">
                    <div>
                      <p className="font-serif text-base font-bold text-[#1C0F11]">
                        {comment.name}
                      </p>
                      <p className="text-[10px] font-mono text-[#6D1520]/80 mt-0.5">
                        {comment.timestamp}
                      </p>
                    </div>
                    <span className="text-2xl shrink-0 bg-[#6D1520]/5 px-2.5 py-1 rounded-xl border border-[#CBB084]/20">
                      {comment.emoji}
                    </span>
                  </div>
                  <p className="text-[#2C181B] text-sm sm:text-base leading-relaxed font-medium whitespace-pre-wrap">
                    {comment.message}
                  </p>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}
