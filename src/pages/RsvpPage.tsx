import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import type { InvitationTemplate } from "../../shared/invitation";
import { api } from "../api/client";
import SectionShell from "../components/invitation/SectionShell";
import RsvpSection from "../components/invitation/RsvpSection";

export default function RsvpPage() {
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
      title="بەشداریکردن"
      subtitle="تکایە بەشداریکردنتان پشتڕاست بکەنەوە"
    >
      <RsvpSection slug={slug} config={config} standalone />
    </SectionShell>
  );
}
