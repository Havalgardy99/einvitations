import React from "react";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { InvitationTemplate } from "../../types";
import { mediaUrl } from "../../api/base";

interface SectionShellProps {
  config: InvitationTemplate;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  fullPage?: boolean;
}

export default function SectionShell({
  config,
  title,
  subtitle,
  children,
  fullPage = true
}: SectionShellProps) {
  return (
    <div className="min-h-screen bg-[#11100F] flex items-center justify-center p-0 sm:p-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />

      <div
        className={`relative z-10 w-full bg-[#1A0A0C] text-[#F5E6D3] flex flex-col overflow-hidden ${
          fullPage
            ? "min-h-screen sm:min-h-0 sm:max-w-md sm:rounded-[2rem] sm:border sm:border-[#3D1A1E] sm:shadow-2xl sm:max-h-[90vh]"
            : "h-full"
        }`}
      >
        <header className="shrink-0 pt-6 pb-4 px-5 bg-[#210D0F]/95 border-b border-[#3D1A1E] text-center">
          <div className="flex items-center justify-center gap-2 text-[9px] tracking-[0.2em] text-[#D4AF37] font-mono uppercase mb-2">
            <Sparkles className="w-3 h-3" />
            {config.coupleName1} & {config.coupleName2}
            <Sparkles className="w-3 h-3" />
          </div>
          <h1 className="font-serif text-2xl font-light tracking-wide text-[#F5E6D3]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#CBB084] mt-2 leading-relaxed">{subtitle}</p>
          )}
          <Link
            to={`/i/${config.slug}`}
            className="inline-block mt-3 text-[10px] text-[#A39081] hover:text-[#D4AF37] underline underline-offset-2"
          >
            گەڕانەوە بۆ بانگهێشتنامەی تەواو
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-luxury px-4 py-5">
          {children}
        </div>

        {config.coverImageUrl && (
          <div className="shrink-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
        )}
      </div>
    </div>
  );
}

/** Decorative thumb — unused export kept for future */
export function SectionCoverThumb({ config }: { config: InvitationTemplate }) {
  if (!config.coverImageUrl) return null;
  return (
    <img
      src={mediaUrl(config.coverImageUrl)}
      alt=""
      className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]/40"
    />
  );
}
