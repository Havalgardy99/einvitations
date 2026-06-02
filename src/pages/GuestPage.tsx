import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import type { InvitationTemplate } from "../../shared/invitation";
import { api } from "../api/client";
import SectionShell from "../components/invitation/SectionShell";
import RsvpSection from "../components/invitation/RsvpSection";
import GuestbookSection from "../components/invitation/GuestbookSection";

export default function GuestPage() {
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
      .catch(() => setError("بانگهێشتنامەکە نەدۆزرایەوە"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="admin-root min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-3 text-[#CBB084]"
        >
          <Sparkles className="w-8 h-8 text-[#D4AF37] animate-spin-slow" />
          <span className="font-serif tracking-widest text-sm">بارکردن...</span>
        </motion.div>
      </div>
    );
  }

  if (error || !config || !slug) {
    return (
      <div className="admin-root min-h-screen flex items-center justify-center p-6 text-center">
        <p className="text-[#A39081]">{error}</p>
      </div>
    );
  }

  return (
    <SectionShell
      config={config}
      title="بەشداری و پیرۆزبایی"
      subtitle="سەرەتا بەشداری پشتڕاست بکەن، دواتر پیرۆزبایی بنووسن — هەموو لە یەک لینک"
      fullPage
    >
      <div className="space-y-8">
        <RsvpSection slug={slug} config={config} standalone />
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#D4AF37]/25" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#1A0A0C] px-4 text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
              پیرۆزباییەکان
            </span>
          </div>
        </div>
        <GuestbookSection slug={slug} config={config} standalone />
      </div>
    </SectionShell>
  );
}

/** Legacy URLs → combined guest page */
export function RedirectToGuest() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return null;
  return <Navigate to={`/i/${slug}/guest`} replace />;
}
