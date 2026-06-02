import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart } from "lucide-react";
import type { InvitationTemplate } from "../types";
import { mediaUrl } from "../api/base";

interface UnfoldingEnvelopeProps {
  config: InvitationTemplate;
  onComplete: () => void;
}

export default function UnfoldingEnvelope({ config, onComplete }: UnfoldingEnvelopeProps) {
  const [phase, setPhase] = useState<"initial" | "openingFlap" | "slidingOut" | "expanding">("initial");

  // Sequenced timings triggered after the customer clicks to open
  useEffect(() => {
    let timer: any;
    if (phase === "openingFlap") {
      timer = setTimeout(() => {
        setPhase("slidingOut");
      }, 1000);
    } else if (phase === "slidingOut") {
      timer = setTimeout(() => {
        setPhase("expanding");
      }, 1300);
    } else if (phase === "expanding") {
      timer = setTimeout(() => {
        onComplete();
      }, 1100);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [phase, onComplete]);

  const handleOpen = () => {
    if (phase === "initial") {
      setPhase("openingFlap");
    }
  };

  const invitationIllustration = mediaUrl(config.coverImageUrl);

  return (
    <div className="absolute inset-0 bg-[#D4C6C4] flex items-center justify-center overflow-hidden z-40 p-4">
      
      {/* Background architectural layout and floating elements for perfect fluid flow */}
      <div className="absolute inset-0 bg-[#D4C6C4] pointer-events-none overflow-hidden">
        {/* Subtle soft shadows to mimic luxurious paper fold */}
        <div className="absolute inset-0 bg-linear-to-b from-[#000000]/3 to-transparent" />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/5" />
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-black/5" />

        {/* Translucent falling rose/peach blossom petals */}
        {[
          { left: "8%", delay: "0s", duration: "10s", scale: 0.8, color: "bg-rose-400/25" },
          { left: "28%", delay: "3.2s", duration: "12s", scale: 1.1, color: "bg-rose-300/20" },
          { left: "48%", delay: "1.5s", duration: "9s", scale: 0.9, color: "bg-[#E54B88]/15" },
          { left: "68%", delay: "5.5s", duration: "11s", scale: 1.2, color: "bg-peach-300/25" },
          { left: "83%", delay: "2.1s", duration: "8.5s", scale: 0.75, color: "bg-rose-300/30" },
          { left: "92%", delay: "4s", duration: "13s", scale: 1.0, color: "bg-rose-400/20" }
        ].map((p, idx) => (
          <div
            key={idx}
            className={`absolute top-0 rounded-full animate-fall-petal ${p.color}`}
            style={{
              left: p.left,
              width: `${16 * p.scale}px`,
              height: `${24 * p.scale}px`,
              animationDelay: p.delay,
              animationDuration: p.duration,
              borderRadius: "80% 10% 80% 60%", 
              transform: "rotate(35deg)",
              filter: "blur(0.5px)"
            }}
          />
        ))}

        {/* Golden micro glowing fireflies */}
        {[
          { left: "15%", top: "25%", delay: "0.5s" },
          { left: "75%", top: "35%", delay: "2.3s" },
          { left: "40%", top: "70%", delay: "1.1s" },
          { left: "85%", top: "15%", delay: "3.5s" },
          { left: "20%", top: "80%", delay: "4.2s" }
        ].map((f, idx) => (
          <div
            key={`f-${idx}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-200/60 shadow-[0_0_8px_rgba(253,244,197,0.8)] animate-shimmer-slow"
            style={{
              left: f.left,
              top: f.top,
              animationDelay: f.delay
            }}
          />
        ))}
      </div>

      {/* Immersive 3D Space perspective container */}
      <div 
        className="relative w-full h-[min(520px,72dvh)] max-w-[min(340px,92vw)] flex items-center justify-center z-10 mx-auto"
        style={{ perspective: "1250px" }}
      >
        
        {/* Dynamic envelope hover glow */}
        <div className="absolute w-[280px] h-[280px] rounded-full bg-rose-400/8 blur-[90px] -translate-y-8 pointer-events-none animate-pulse-slow" />

        {/* 3D ENVELOPE BODY */}
        <motion.div
          animate={
            phase === "expanding"
              ? { scale: 1.25, rotateX: 5, y: 140, opacity: 0 }
              : { rotateX: 20, rotateY: -10, rotateZ: -1 }
          }
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full max-w-[310px] aspect-[310/215] bg-[#C1B9AE] rounded-b-3xl shadow-[0_24px_55px_rgba(0,0,0,0.35)] border-t border-[#DFDCD4]/25 cursor-pointer"
          onClick={handleOpen}
        >
          
          {/* 1. LAYER ONE: Card sitting inside the envelope pouch, sliding upwards */}
          <motion.div
            initial={{ y: 0, scale: 0.96, zIndex: 10, translateZ: "5px" }}
            animate={
              phase === "slidingOut" || phase === "expanding"
                ? { y: -195, scale: 1.06, rotateX: -4, rotateY: 4, zIndex: 30, translateZ: "18px" }
                : { y: 0, scale: 0.96, zIndex: 10, translateZ: "5px" }
            }
            transition={{
              duration: 1.35,
              ease: [0.22, 1, 0.36, 1], // exquisite overshoot deceleration
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="absolute left-[15px] right-[15px] top-[10px] h-[195px] bg-[#FCFAF7] rounded-2xl border-2 border-[#E9E4DB] shadow-[0_5px_22px_rgba(0,0,0,0.18)] flex flex-col items-center justify-center p-4 text-center select-none"
          >
            {/* Elegant botanical cover image visible as it emerges */}
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#CBB084] mb-2 bg-[#F6F3EE] opacity-95">
              <img src={invitationIllustration} alt="Kurdish Wedding Couple" className="w-full h-full object-cover object-top scale-110" />
            </div>

            <div className="space-y-1">
              <span className="text-[7.5px] font-mono tracking-[0.25em] text-[#9C716B] font-bold uppercase block">
                بانگهێشتنامەی فەرمی
              </span>
              <h3 className="font-serif text-[17px] font-light tracking-widest text-[#2D211F] leading-none my-1">
                {config.coupleName1} &amp; {config.coupleName2}
              </h3>
              <p className="text-[7.5px] tracking-wider uppercase text-[#7D6461] italic font-semibold">
                {config.dateDisplay} • {config.locationShort}
              </p>
            </div>

            {/* Simulated gold foil border line around card */}
            <div className="absolute inset-2 border border-[#E4D1B9]/70 rounded-xl pointer-events-none" />
            
            {/* Elegant sparkling details */}
            <Sparkles className="w-4 h-4 text-amber-500/85 absolute top-3.5 right-3.5 animate-spin-slow" />
          </motion.div>

          {/* 2. ENVELOPE FRONT POUCH (The side triangular fold wings) */}
          <div 
            style={{ transform: "translateZ(15px)" }}
            className="absolute inset-0 bg-linear-to-tr from-[#B5B0A4] to-[#C1B9AE] rounded-b-3xl pointer-events-none"
          >
            {/* Elegant geometric triangular paper seams on the face */}
            <svg className="w-full h-full" viewBox="0 0 310 215" fill="none">
              {/* Left wing triangle */}
              <path d="M 0 0 L 155 120 L 0 215 Z" fill="#BDB7AB" opacity="0.88" />
              {/* Right wing triangle */}
              <path d="M 310 0 L 155 120 L 310 215 Z" fill="#BDB7AB" opacity="0.88" />
              {/* Bottom fold triangle */}
              <path d="M 0 215 L 155 105 L 310 215 Z" fill="#B3AE9F" />
              
              {/* Golden foil luxury heart stamp detail */}
              <circle cx="155" cy="135" r="15" fill="#AF9063" opacity="0.25" />
            </svg>
            <div className="absolute left-1/2 bottom-[65px] -translate-x-1/2 text-[10px] text-amber-100/35">
              <Heart className="w-4 h-4 text-amber-400/25 fill-amber-400/20" />
            </div>
          </div>

          {/* 3. TOP FLAP OF THE ENVELOPE (Does the 3D rotating opening movement) */}
          <motion.div
            initial={{ rotateX: 0, translateZ: "16px" }}
            animate={
              phase !== "initial"
                ? { rotateX: 180, y: -2, translateZ: "2px" }
                : { rotateX: 0, translateZ: "16px" }
            }
            transition={{ duration: 1.0, ease: "easeInOut" }}
            style={{
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              zIndex: phase === "initial" ? 25 : 2
            }}
            className="absolute top-0 left-0 right-0 h-[112px] pointer-events-none"
          >
            {/* Double-sided triangular flap */}
            <div className="absolute inset-0 origin-top overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 310 112" fill="none">
                {/* Outer flap texture */}
                <path d="M 0 0 L 155 112 L 310 0 Z" fill="#C9C2B7" />
                {/* Inner deep burgundy lining flap backface exactly like top luxury invitations */}
                <path d="M 4 0 L 155 107 L 306 0 Z" fill="#751F2F" opacity="0.95" />
              </svg>
            </div>
          </motion.div>

        </motion.div>

        {/* Real Interactive Raspberry Wax Seal in the Center */}
        <AnimatePresence>
          {phase === "initial" && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0, y: 15 }}
              transition={{ duration: 0.4 }}
              style={{ transformStyle: "preserve-3d" }}
              className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center select-none"
              onClick={handleOpen}
            >
              {/* Pulsing ring outline under the seal */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.15, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-2.5 rounded-full border-2 border-rose-300 pointer-events-none"
              />
              
              {/* Real 3D-like Rose Gold/Wax Raspberry Seal (exactly like the GIF!) */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-13 h-13 rounded-full bg-gradient-to-br from-[#E27D8C] via-[#B83B5E] to-[#751F2F] border-2 border-[#FFE8E8]/35 flex items-center justify-center shadow-[0_10px_25px_rgba(184,59,94,0.5),_inset_0_2px_4px_rgba(255,255,255,0.4)] relative cursor-pointer"
              >
                {/* Embedded vintage stamp content */}
                <div className="absolute inset-1 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-100 fill-pink-100/90 animate-shimmer-slow" />
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing luxurious indication text underneath the envelope container */}
        <AnimatePresence>
          {phase === "initial" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-10 left-0 right-0 text-center select-none z-10 pointer-events-none"
            >
              <p className="font-serif italic text-sm text-[#8E5E56] animate-pulse">
                پەنجە بنێ بە مۆرەکەوە بۆ کردنەوەی نامەکە
              </p>
              <p className="text-[10px] font-mono tracking-[0.1em] text-[#9A7D79] uppercase mt-1 opacity-75">
                لەسەر مۆرەکە کلیک بکە
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* FULL-SCREEN IMMERSIVE PAPER EXPANSION OVERLAY */}
      {phase === "expanding" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-[#ECE1DF] z-50 flex items-center justify-center p-4"
        >
          {/* Mirror floating background layout of Invitation Main for instant gorgeous seamless blend */}
          <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-[#E5BCC1]/30 blur-2xl pointer-events-none" />
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-[#D1ADB4]/20 blur-2xl pointer-events-none" />
          
          <div className="text-center space-y-4">
            <h2 className="font-serif text-3xl font-light tracking-widest text-[#2D211F] uppercase animate-pulse">
              دەکرێتەوە...
            </h2>
            <div className="w-16 h-[1.5px] bg-[#B68B85] mx-auto" />
            <p className="text-[#7D6461] text-xs font-mono tracking-widest uppercase font-semibold">
              {config.coupleName1} و {config.coupleName2}
            </p>
          </div>
        </motion.div>
      )}

    </div>
  );
}
