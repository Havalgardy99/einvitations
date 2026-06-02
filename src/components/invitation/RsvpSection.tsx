import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, Send, User, Users } from "lucide-react";
import type { InvitationTemplate } from "../../types";
import { api } from "../../api/client";
import { apiUrl } from "../../api/base";

interface RsvpSectionProps {
  slug: string;
  config: InvitationTemplate;
  standalone?: boolean;
}

export default function RsvpSection({
  slug,
  config,
  standalone = false
}: RsvpSectionProps) {
  const [attendingCount, setAttendingCount] = useState(0);
  const [form, setForm] = useState({
    name: "",
    isAttending: true,
    guestsCount: 1,
    dietaryRestrictions: "",
    favoriteSong: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(apiUrl(`/api/invitations/${slug}/rsvps`))
      .then((r) => (r.ok ? r.json() : []))
      .then((list: { name: string }[]) => setAttendingCount(list.length))
      .catch(() => {});
  }, [slug, submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const entry = await api.submitRsvp(slug, {
        name: form.name.trim(),
        isAttending: form.isAttending,
        guestsCount: form.isAttending ? form.guestsCount : 0,
        dietaryRestrictions: form.dietaryRestrictions.trim(),
        favoriteSong: form.favoriteSong.trim()
      });
      if (entry.isAttending) {
        setAttendingCount((c) => c + 1);
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({
          name: "",
          isAttending: true,
          guestsCount: 1,
          dietaryRestrictions: "",
          favoriteSong: ""
        });
      }, 2800);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`space-y-5 ${standalone ? "pb-8" : ""}`}>
      <div className="bg-[#FCFAF2]/95 border-2 border-[#CBB084]/65 rounded-3xl p-5 shadow-lg relative">
        <div className="absolute inset-2 border border-[#CBB084]/15 rounded-2xl pointer-events-none" />
        <div className="text-center space-y-1 relative z-10 mb-5">
          <h3 className="font-serif text-lg font-bold text-[#1C0F11]">
            پشتڕاستکردنەوەی بەشداریکردن (RSVP)
          </h3>
          <p className="text-xs text-[#2C181B] font-semibold">{config.rsvpDeadline}</p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-12 text-center space-y-3 flex flex-col items-center relative z-10"
          >
            <div className="p-4 rounded-full bg-emerald-950/10 text-emerald-800 border border-emerald-800/30">
              <CheckCircle className="w-10 h-10 text-emerald-700" />
            </div>
            <p className="font-serif text-lg text-[#1C0F11] font-bold">
              بە سەرکەوتوویی پشتڕاستکرایەوە!
            </p>
            <p className="text-sm text-[#6D1520]">سوپاس — چاوەڕوانی ئێوەین ❤️</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10 text-right">
            <div className="space-y-1">
              <label className="text-[11px] font-mono tracking-wider uppercase text-[#6D1520] flex items-center gap-1.5 font-bold justify-end">
                ناو و پاشناوی تەواوتان <User className="w-3.5 h-3.5 text-[#D4AF37]" />
              </label>
              <input
                type="text"
                required
                placeholder="بۆ نموونە: ئارتین زریان"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#1A0A0C]/5 border-2 border-[#CBB084]/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] text-right text-[#1C0F11] font-semibold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono tracking-wider uppercase text-[#6D1520] font-bold block text-right">
                ئایا ئامادە دەبن لە ئاهەنگەکەدا؟
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isAttending: true })}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                    form.isAttending
                      ? "bg-[#6D1520] text-white border-transparent"
                      : "bg-[#FCFAF2] border-2 border-[#CBB084]/40 text-[#6D1520]"
                  }`}
                >
                  بەڵێ، بە شانازییەوە دێم!
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isAttending: false })}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                    !form.isAttending
                      ? "bg-[#6D1520] text-white border-transparent"
                      : "bg-[#FCFAF2] border-2 border-[#CBB084]/40 text-[#6D1520]"
                  }`}
                >
                  ببوورن، ناتوانم بێم
                </button>
              </div>
            </div>
            {form.isAttending && (
              <div className="space-y-1">
                <label className="text-[11px] font-mono tracking-wider uppercase text-[#6D1520] flex items-center gap-1.5 font-bold justify-end">
                  ژمارەی هاوەڵەکانتان <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                </label>
                <select
                  value={form.guestsCount}
                  onChange={(e) =>
                    setForm({ ...form, guestsCount: Number(e.target.value) })
                  }
                  className="w-full bg-[#1A0A0C]/5 border-2 border-[#CBB084]/40 rounded-xl px-4 py-3 text-sm text-right text-[#1C0F11] font-semibold"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "میوان" : "میوان"}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <input
              type="text"
              placeholder="جۆری خواردن / هەستیاری (ئەگەر هەیە)"
              value={form.dietaryRestrictions}
              onChange={(e) =>
                setForm({ ...form, dietaryRestrictions: e.target.value })
              }
              className="w-full bg-[#1A0A0C]/5 border-2 border-[#CBB084]/40 rounded-xl px-4 py-3 text-sm text-right text-[#1C0F11] font-semibold"
            />
            <input
              type="text"
              placeholder="پێشنیاری گۆرانی..."
              value={form.favoriteSong}
              onChange={(e) => setForm({ ...form, favoriteSong: e.target.value })}
              className="w-full bg-[#1A0A0C]/5 border-2 border-[#CBB084]/40 rounded-xl px-4 py-3 text-sm text-right text-[#1C0F11] font-semibold"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#6D1520] hover:bg-[#4D0A11] disabled:opacity-60 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {submitting ? "ناردن..." : "ناردنی پشتڕاستکردنەوە"}
              <Send className="w-3.5 h-3.5 text-amber-200" />
            </button>
          </form>
        )}
      </div>

      <div className="bg-[#2D1418]/80 border border-[#4D2429] rounded-2xl p-4 flex items-center justify-between flex-row-reverse">
        <span className="text-xs text-[#FCFAF2]/80 font-serif">ئامادەبووانی پشتڕاستکراو</span>
        <span className="text-sm font-bold text-[#D4AF37] bg-[#FCFAF2]/10 px-3 py-1 rounded-full">
          {attendingCount} کەس
        </span>
      </div>
    </div>
  );
}
