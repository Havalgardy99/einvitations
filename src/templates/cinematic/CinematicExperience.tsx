import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SkipForward } from "lucide-react";
import PhoneFrame from "../shell/PhoneFrame";
import InvitationMain from "../../components/InvitationMain";
import type { TemplateExperienceProps } from "../types";
import { DEFAULT_CINEMATIC_VIDEO } from "../../../shared/templates";

type Phase = "video" | "content";

export default function CinematicExperience({ config, slug }: TemplateExperienceProps) {
  const [phase, setPhase] = useState<Phase>("video");
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = config.introVideoUrl?.trim() || DEFAULT_CINEMATIC_VIDEO;

  const goToContent = useCallback(() => {
    videoRef.current?.pause();
    setPhase("content");
  }, []);

  const startVideo = useCallback(async () => {
    const el = videoRef.current;
    if (!el) return;

    el.muted = false;
    try {
      await el.play();
      return;
    } catch {
      /* browsers often block unmuted autoplay — fall back to muted start */
    }

    el.muted = true;
    try {
      await el.play();
      el.muted = false;
    } catch {
      /* no overlay — video stays on first frame if autoplay fully blocked */
    }
  }, []);

  useEffect(() => {
    if (phase !== "video") return;
    void startVideo();
  }, [phase, videoSrc, startVideo]);

  return (
    <PhoneFrame outerClass="bg-black" screenClass="bg-black">
      <AnimatePresence mode="wait">
        {phase === "video" ? (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.55 }}
            className="absolute inset-0 z-50 bg-black"
          >
            <video
              ref={videoRef}
              src={videoSrc}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              playsInline
              muted={false}
              preload="auto"
              onEnded={goToContent}
              onLoadedData={() => void startVideo()}
              onCanPlay={() => void startVideo()}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />

            <div
              className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20"
              style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
            >
              <button
                type="button"
                onClick={goToContent}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/25 text-white text-xs font-bold"
              >
                <SkipForward className="w-3.5 h-3.5" />
                تێپەڕاندن
              </button>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center z-20 pointer-events-none"
              style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
            >
              <p className="text-[10px] tracking-[0.25em] text-white/70 uppercase font-mono mb-2">
                Cinematic Invitation
              </p>
              <h2 className="font-serif text-2xl text-white drop-shadow-lg">
                {config.coupleName1} & {config.coupleName2}
              </h2>
              <p className="text-xs text-white/75 mt-2">{config.dateDisplay}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <InvitationMain
              config={config}
              slug={slug}
              themeId="cinematic"
              onReset={() => setPhase("video")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PhoneFrame>
  );
}
