import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Compass,
  Flower2,
  Moon,
  Sparkle,
  Sparkles,
  Sun
} from "lucide-react";
import PhoneFrame from "../shell/PhoneFrame";
import InvitationMain from "../../components/InvitationMain";
import type { TemplateExperienceProps } from "../types";
import type { TemplatePresetKey } from "../../../shared/templates";
import { getTemplatePreset } from "../../../shared/templates";

const frameByTheme: Record<
  TemplatePresetKey,
  { outer: string; screen: string; introBg: string }
> = {
  royal: { outer: "bg-[#11100F]", screen: "bg-[#D4C6C4]", introBg: "bg-[#D4C6C4]" },
  garden: { outer: "bg-[#0a1a12]", screen: "bg-[#d1fae5]", introBg: "bg-gradient-to-b from-[#ecfdf5] to-[#a7f3d0]" },
  night: { outer: "bg-[#020208]", screen: "bg-[#0a0e1f]", introBg: "bg-[#0a0e1f]" },
  minimal: { outer: "bg-neutral-200", screen: "bg-neutral-50", introBg: "bg-white" },
  sunset: { outer: "bg-[#1a0a08]", screen: "bg-gradient-to-b from-[#ff8a65] to-[#bf360c]", introBg: "bg-gradient-to-b from-[#ff8a65] via-[#ff7043] to-[#5d4037]" },
  classic: { outer: "bg-[#0d1b2a]", screen: "bg-[#415a77]", introBg: "bg-[#1b263b]" },
  cinematic: { outer: "bg-black", screen: "bg-black", introBg: "bg-black" }
};

function ThemeIntro({
  themeId,
  config,
  onOpen
}: {
  themeId: TemplatePresetKey;
  config: TemplateExperienceProps["config"];
  onOpen: () => void;
}) {
  const preset = getTemplatePreset(themeId);

  return (
    <div className={`absolute inset-0 flex flex-col justify-between overflow-hidden ${frameByTheme[themeId].introBg}`}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {themeId === "garden" &&
          [...Array(14)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-xl opacity-40"
              style={{ left: `${(i * 7) % 92}%`, top: `${(i * 11) % 85}%` }}
              animate={{ y: [0, -16, 0], rotate: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 4 + i * 0.2 }}
            >
              {i % 2 ? "🌸" : "🌿"}
            </motion.span>
          ))}
        {themeId === "night" &&
          [...Array(35)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{ left: `${(i * 13) % 100}%`, top: `${(i * 17) % 100}%` }}
              animate={{ opacity: [0.2, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 + (i % 4) * 0.3 }}
            />
          ))}
        {themeId === "sunset" && (
          <motion.div
            className="absolute top-14 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-amber-200 shadow-[0_0_50px_rgba(255,213,79,0.85)]"
            animate={{ y: [8, 0, 8] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
        )}
      </div>

      <div className="pt-[max(2.5rem,env(safe-area-inset-top))] px-4 sm:px-6 flex justify-between items-start z-20 gap-2">
        <div className="text-right min-w-0">
          <p className="text-[10px] sm:text-xs font-mono tracking-[0.2em] font-bold uppercase opacity-80">
            بانگهێشتی هاوسەرگیری
          </p>
          <p className="text-[9px] sm:text-[10px] opacity-70 mt-0.5 truncate">
            {config.coupleName1} و {config.coupleName2}
          </p>
        </div>
        <button
          onClick={onOpen}
          className="shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold border border-black/10 bg-white/25 backdrop-blur-md"
        >
          تێپەڕاندن
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="px-4 sm:px-8 text-center z-10"
      >
        <p className="text-[10px] font-mono uppercase tracking-widest opacity-80 mb-2">
          {preset.subtitle}
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-extralight tracking-widest leading-tight">
          {config.coupleName1}
          <br />
          <span className="opacity-70">&amp;</span> {config.coupleName2}
        </h2>
        <div className="flex items-center justify-center gap-1 mt-3 opacity-80">
          <Sparkle className="w-3 h-3 shrink-0" />
          <span className="text-[10px] tracking-widest font-bold truncate max-w-[220px]">{config.locationShort}</span>
          <Sparkle className="w-3 h-3 shrink-0" />
        </div>
      </motion.div>

      <div className="pb-[max(3.5rem,env(safe-area-inset-bottom))] px-4 sm:px-8 z-20">
        <div className="bg-white/15 border border-white/25 backdrop-blur-md py-3 sm:py-4 px-3 sm:px-4 rounded-2xl flex items-center gap-3">
          {themeId === "night" ? (
            <Moon className="w-5 h-5 shrink-0 animate-pulse" />
          ) : themeId === "garden" ? (
            <Flower2 className="w-5 h-5 shrink-0" />
          ) : themeId === "sunset" ? (
            <Sun className="w-5 h-5 shrink-0" />
          ) : themeId === "classic" ? (
            <BookOpen className="w-5 h-5 shrink-0" />
          ) : (
            <Compass className="w-5 h-5 shrink-0 animate-spin-slow" />
          )}
          <div className="text-right grow text-xs">
            <p className="font-serif font-bold">کردنەوەی بانگهێشتنامە</p>
            <p className="opacity-90 mt-1 leading-relaxed">
              {config.inviteGreeting} — کلیک بکە بۆ بینینی وردەکارییەکان بە ئەنیمەیشنی جوان
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpen}
          className="w-full mt-4 py-3.5 rounded-xl font-bold text-sm shadow-lg bg-black/20 border border-white/30 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 inline ml-2" />
          کردنەوەی بانگهێشت
        </motion.button>
      </div>
    </div>
  );
}

export default function LuxuryThemedFlow({
  config,
  slug,
  themeId
}: TemplateExperienceProps & { themeId: TemplatePresetKey }) {
  const [ready, setReady] = useState(false);
  const frame = frameByTheme[themeId];

  return (
    <PhoneFrame outerClass={frame.outer} screenClass={frame.screen}>
      <AnimatePresence mode="wait">
        {!ready ? (
          <motion.div
            key="intro"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <ThemeIntro themeId={themeId} config={config} onOpen={() => setReady(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55 }}
            className="absolute inset-0"
          >
            <InvitationMain
              config={config}
              slug={slug}
              themeId={themeId}
              onReset={() => setReady(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PhoneFrame>
  );
}
