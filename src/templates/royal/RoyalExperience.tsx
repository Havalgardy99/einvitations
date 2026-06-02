import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Sparkle } from "lucide-react";
import WaxSealRope from "../../components/WaxSealRope";
import UnfoldingEnvelope from "../../components/UnfoldingEnvelope";
import InvitationMain from "../../components/InvitationMain";
import PhoneFrame from "../shell/PhoneFrame";
import type { TemplateExperienceProps } from "../types";

export default function RoyalExperience({ config, slug }: TemplateExperienceProps) {
  const [flowState, setFlowState] = useState<"sealed" | "unfolding" | "ready">("sealed");

  return (
    <PhoneFrame outerClass="bg-[#11100F]" screenClass="bg-[#D4C6C4]">
      <div className="absolute inset-0 top-0 left-0 right-0 bottom-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-amber-500/5 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-rose-500/5 blur-[80px]" />
      </div>
      <AnimatePresence mode="wait">
        {flowState === "sealed" ? (
          <motion.div
            key="seal"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-[#D4C6C4] flex flex-col justify-between"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[8, 28, 48, 68, 83, 92].map((left, idx) => (
                <div
                  key={idx}
                  className="absolute top-0 rounded-full animate-fall-petal bg-rose-400/25"
                  style={{
                    left: `${left}%`,
                    width: 14 + idx * 2,
                    height: 22 + idx * 2,
                    animationDelay: `${idx * 0.7}s`,
                    animationDuration: `${9 + idx}s`,
                    borderRadius: "80% 10% 80% 60%",
                    transform: "rotate(35deg)"
                  }}
                />
              ))}
            </div>
            <div className="pt-12 px-6 pb-2 flex justify-between items-center z-30">
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#3D3C3A] font-bold">
                  بانگهێشتی هاوسەرگیری
                </span>
                <p className="text-[9px] text-[#3D3C3A]/70 mt-0.5">
                  {config.coupleName1} و {config.coupleName2}
                </p>
              </div>
              <button
                onClick={() => setFlowState("unfolding")}
                className="px-4 py-1.5 bg-white/20 border border-black/10 backdrop-blur-md rounded-full text-xs font-semibold text-[#1C1B1A]"
              >
                تێپەڕاندن
              </button>
            </div>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-8 text-center z-10"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#363534]">
                {config.dateDisplay}
              </span>
              <h2 className="font-serif text-3xl font-extralight tracking-widest text-[#232221] mt-2">
                {config.coupleName1}
                <br />
                &amp; {config.coupleName2}
              </h2>
              <div className="flex items-center justify-center gap-1 text-[#645F59] mt-2">
                <Sparkle className="w-3 h-3" />
                <span className="text-[10px] tracking-widest font-bold">
                  {config.locationShort}
                </span>
                <Sparkle className="w-3 h-3" />
              </div>
            </motion.div>
            <div className="pb-16 px-8 z-30">
              <div className="bg-white/10 border border-white/20 backdrop-blur-md py-4 px-4 rounded-2xl flex items-center gap-3">
                <Compass className="w-5 h-5 animate-spin-slow shrink-0" />
                <div className="text-right text-xs">
                  <p className="font-serif font-bold">ڕاکێشانی مۆرەکە</p>
                  <p className="text-[10px] opacity-90 mt-1">
                    مۆری مۆم بەرەو خوارەوە ڕابکێشە بۆ کردنەوەی بانگهێشتنامەکە
                  </p>
                </div>
              </div>
            </div>
            <WaxSealRope
              onUnseal={() => setFlowState("unfolding")}
              width={390}
              height={780}
            />
          </motion.div>
        ) : flowState === "unfolding" ? (
          <motion.div key="unfold" className="absolute inset-0 bg-[#D4C6C4] z-40">
            <UnfoldingEnvelope
              config={config}
              onComplete={() => setFlowState("ready")}
            />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0"
          >
            <InvitationMain
              config={config}
              slug={slug}
              onReset={() => setFlowState("sealed")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PhoneFrame>
  );
}
