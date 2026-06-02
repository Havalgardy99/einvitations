import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Heart, Sparkles } from "lucide-react";
import type { InvitationTemplate } from "../../shared/invitation";
import { api } from "../api/client";
import App from "../App";

export default function InvitationPage() {
  const { slug } = useParams<{ slug: string }>();
  const [config, setConfig] = useState<InvitationTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setError("لینکەکە نادروستە");
      setLoading(false);
      return;
    }
    api
      .getPublicInvitation(slug)
      .then(setConfig)
      .catch(() => setError("بانگهێشتنامەکە نەدۆزرایەوە یان ناچالاکە"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div
        dir="rtl"
        className="admin-root min-h-screen flex items-center justify-center"
      >
        <div className="admin-noise" aria-hidden />
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="relative z-10 flex flex-col items-center gap-5"
        >
          <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37]/30 flex items-center justify-center bg-[#6D1520]/20">
            <Sparkles className="w-8 h-8 text-[#D4AF37] animate-spin-slow" />
          </div>
          <span className="font-serif text-lg tracking-[0.15em] text-[#CBB084]">
            کردنەوەی بانگهێشت...
          </span>
        </motion.div>
      </div>
    );
  }

  if (error || !config || !slug) {
    return (
      <div
        dir="rtl"
        className="admin-root min-h-screen flex items-center justify-center p-6"
      >
        <div className="admin-noise" aria-hidden />
        <div className="glass-panel relative z-10 max-w-sm w-full rounded-2xl p-10 text-center space-y-5">
          <Heart className="w-10 h-10 text-[#D4AF37]/50 mx-auto" />
          <h1 className="font-serif text-2xl text-[#F3EFE9]">بانگهێشتنامە</h1>
          <p className="text-[#A39081] text-sm leading-relaxed">{error}</p>
          <div className="gold-divider w-16 mx-auto" />
          <a
            href="/admin"
            className="btn-gold-outline inline-block px-6 py-2.5 rounded-xl text-sm font-medium"
          >
            داشبۆردی بەڕێوەبەر
          </a>
        </div>
      </div>
    );
  }

  return <App config={config} slug={slug} />;
}
