import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Volume2, VolumeX, AlertCircle } from "lucide-react";

interface WaxSealRopeProps {
  onUnseal: () => void;
  width: number;
  height: number;
}

interface PhyNode {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
}

export default function WaxSealRope({ onUnseal, width, height }: WaxSealRopeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowPathRef = useRef<SVGPathElement>(null);
  const mainPathRef = useRef<SVGPathElement>(null);
  const accentPathRef = useRef<SVGPathElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const tensionIndicatorRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [successProgress, setSuccessProgress] = useState(0); // 0 to 100% of pull threshold
  const [hasSnapped, setHasSnapped] = useState(false);

  // Sound effects state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Physics constants - optimized for elegant slow-swinging luxury movement
  const subSteps = 6;
  const gravity = 0.38;
  const dampening = 0.99;
  const ropeLength = height * 0.48; // Elastic cord standard length
  const nodeCount = 14;
  const segmentLength = ropeLength / (nodeCount - 1);

  // States inside refs to prevent React render lag
  const nodes = useRef<PhyNode[]>([]);
  const isDraggingRef = useRef(false);
  const pointerPos = useRef({ x: width * 0.5, y: height * 0.62 });
  const anchor = useRef({ x: width * 0.82, y: 55 });
  const wasInitialized = useRef(false);

  // Initialize nodes
  useEffect(() => {
    anchor.current = { x: width * 0.82, y: 56 };
    
    // Initial position curves beautifully down to the center-left
    const targetX = width * 0.45;
    const targetY = height * 0.58;

    if (!wasInitialized.current || nodes.current.length === 0) {
      const newNodes: PhyNode[] = [];
      for (let i = 0; i < nodeCount; i++) {
        const t = i / (nodeCount - 1);
        const x = anchor.current.x + (targetX - anchor.current.x) * t;
        const y = anchor.current.y + (targetY - anchor.current.y) * t;
        
        // Induce a breathtaking, premium initial pendulum swing on load!
        // Shifting old values slightly down-left simulates a lovely initial release dangle
        const oldX = x - (i * 2.8);
        const oldY = y - (i * 1.8);
        
        newNodes.push({ x, y, oldX, oldY });
      }
      nodes.current = newNodes;
      wasInitialized.current = true;
    } else {
      // Smoothly scale existing nodes on resize
      const prevAnchor = { ...anchor.current };
      anchor.current = { x: width * 0.82, y: 56 };
      const dx = anchor.current.x - prevAnchor.x;
      const dy = anchor.current.y - prevAnchor.y;

      nodes.current = nodes.current.map((n, i) => {
        const t = i / (nodeCount - 1);
        return {
          x: n.x + dx * (1 - t),
          y: n.y + dy * (1 - t),
          oldX: n.oldX + dx * (1 - t),
          oldY: n.oldY + dy * (1 - t),
        };
      });
    }
  }, [width, height]);

  // Synthesis sound for interaction feedback
  const playSoundEffect = (type: "pluck" | "snap" | "stretch") => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === "pluck") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "stretch") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(60, now);
        osc.frequency.linearRampToValueAtTime(100 + successProgress * 2, now + 0.1);
        gain.gain.setValueAtTime(0.03 * (successProgress / 100), now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "snap") {
        // Double punch sound for snapping wax seal
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(20, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);

        // Sub bass thump
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(55, now);
        osc2.frequency.exponentialRampToValueAtTime(25, now + 0.3);
        gain2.gain.setValueAtTime(0.4, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc2.start(now);
        osc2.stop(now + 0.3);
      }
    } catch (e) {
      console.warn("Audio Context error", e);
    }
  };

  // Main Verlet Physics Loop
  useEffect(() => {
    let animId: number;

    const updatePhysics = () => {
      if (nodes.current.length === 0 || hasSnapped) return;

      const items = nodes.current;

      // 1. Apply gravity & Verlet velocity
      for (let i = 1; i < nodeCount; i++) {
        const n = items[i];
        
        let vx = (n.x - n.oldX) * dampening;
        let vy = (n.y - n.oldY) * dampening;

        // Apply a slight spring-back centering force towards natural center if not dragging
        if (!isDraggingRef.current) {
          const naturalT = i / (nodeCount - 1);
          // Natural resting coordinate
          const restX = anchor.current.x - (anchor.current.x - width * 0.45) * naturalT;
          const restY = anchor.current.y + (height * 0.48) * naturalT;
          vx += (restX - n.x) * 0.001;
          vy += (restY - n.y) * 0.001;
        }

        n.oldX = n.x;
        n.oldY = n.y;

        n.x += vx;
        n.y += vy + gravity;
      }

      // 2. Resolve Constraints (Multi-pass stiffness)
      for (let step = 0; step < subSteps; step++) {
        // Pin the anchor
        items[0].x = anchor.current.x;
        items[0].y = anchor.current.y;

        // Pin the end to the pointer if dragging
        if (isDraggingRef.current) {
          const endNode = items[nodeCount - 1];
          endNode.x = pointerPos.current.x;
          endNode.y = pointerPos.current.y;
        }

        // Segment distance constraint
        for (let i = 0; i < nodeCount - 1; i++) {
          const n1 = items[i];
          const n2 = items[i + 1];

          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const diff = segmentLength - dist;
          // Stiffness coefficient
          const percent = (diff / dist) * 0.52;
          const offsetX = dx * percent;
          const offsetY = dy * percent;

          if (i > 0) {
            n1.x -= offsetX;
            n1.y -= offsetY;
          }
          if (i + 1 < nodeCount - 1 || !isDraggingRef.current) {
            n2.x += offsetX;
            n2.y += offsetY;
          }
        }
      }

      // 3. Draw rope vector and wax seal DOM
      if (mainPathRef.current || shadowPathRef.current || accentPathRef.current) {
        let pathD = `M ${items[0].x.toFixed(1)} ${items[0].y.toFixed(1)}`;
        
        // Draw elegant smooth bezier string curves
        for (let i = 1; i < nodeCount - 1; i++) {
          const xc = (items[i].x + items[i + 1].x) / 2;
          const yc = (items[i].y + items[i + 1].y) / 2;
          pathD += ` Q ${items[i].x.toFixed(1)} ${items[i].y.toFixed(1)}, ${xc.toFixed(1)} ${yc.toFixed(1)}`;
        }
        pathD += ` L ${items[nodeCount - 1].x.toFixed(1)} ${items[nodeCount - 1].y.toFixed(1)}`;
        
        if (shadowPathRef.current) {
          shadowPathRef.current.setAttribute("d", pathD);
        }
        if (mainPathRef.current) {
          mainPathRef.current.setAttribute("d", pathD);
        }
        if (accentPathRef.current) {
          accentPathRef.current.setAttribute("d", pathD);
        }
      }

      // Position the seal
      if (sealRef.current) {
        const sealNode = items[nodeCount - 1];
        sealRef.current.style.transform = `translate3d(${sealNode.x - 38}px, ${sealNode.y - 38}px, 0px) rotate(${(sealNode.x - width/2) * 0.08}deg)`;
      }

      // Calculate vertical stretch progress
      const endNode = items[nodeCount - 1];
      const startY = anchor.current.y;
      const pullDist = endNode.y - startY;
      const threshold = height * 0.76;
      const rawProgress = Math.max(0, Math.min(100, ((pullDist - ropeLength) / (threshold - ropeLength)) * 100));
      
      setSuccessProgress(rawProgress);

      // Play soft stretching squeak sometimes
      if (isDraggingRef.current && Math.abs(endNode.y - endNode.oldY) > 2) {
        if (Math.random() < 0.1) {
          playSoundEffect("stretch");
        }
      }

      // Check for snap release trigger
      if (isDraggingRef.current && endNode.y >= threshold) {
        // Trigger Unseal Snap!
        handleUnsealAction();
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [width, height, hasSnapped, successProgress, soundEnabled]);

  const handleUnsealAction = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    setHasSnapped(true);
    playSoundEffect("snap");
    
    // Animate snap breakdown and then reveal
    setTimeout(() => {
      onUnseal();
    }, 700);
  };

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (hasSnapped) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Check if user clicked near the wax seal or anywhere to pick it up
    const sealNode = nodes.current[nodeCount - 1];
    if (!sealNode) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const distToSeal = Math.hypot(clickX - sealNode.x, clickY - sealNode.y);

    // Give a generous target area (80px radius) for luxury touch usability
    if (distToSeal < 85) {
      isDraggingRef.current = true;
      setIsDragging(true);
      pointerPos.current = { x: clickX, y: clickY };
      containerRef.current?.setPointerCapture(e.pointerId);
      playSoundEffect("pluck");
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || hasSnapped) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.max(15, Math.min(width - 15, e.clientX - rect.left));
    const y = Math.max(15, Math.min(height - 15, e.clientY - rect.top));
    
    pointerPos.current = { x, y };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    containerRef.current?.releasePointerCapture(e.pointerId);
  };

  // Calculate coordinates for image asset
  // The path of the image we saved:
  const sealImgUrl = "/src/assets/images/pink_wax_seal_1780216336387.png";

  return (
    <div
      ref={containerRef}
      id="rope-container"
      className="absolute inset-0 select-none overflow-hidden touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Sound Toggle */}
      <div className="absolute top-4 left-4 z-40">
        <button
          id="sound-btn"
          onClick={() => setSoundEnabled((prev) => !prev)}
          className="p-2.5 rounded-full bg-white/40 border border-white/60 backdrop-blur-md text-[#2C2B29] hover:bg-white/70 hover:scale-105 active:scale-95 transition-all shadow-sm"
          title={soundEnabled ? "Mute audio" : "Enable sound"}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-950" />
          ) : (
            <VolumeX className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Tension guidance hint - elegant sliding bar in side */}
      <div className="absolute top-[48%] left-4 right-4 text-center z-10 pointer-events-none">
        <AnimatePresence>
          {!isDragging && !hasSnapped && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.85, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col items-center select-none"
            >
              <div className="w-8 h-8 rounded-full border border-[#2C2B29]/30 flex items-center justify-center mb-2 animate-bounce">
                <span className="text-xs text-[#2C2B29] font-serif">↓</span>
              </div>
              <p className="text-[12px] font-sans tracking-wide text-[#2C2B29]/90 font-semibold">
                مۆری مۆمەکە بەرەو خوارەوە ڕابکێشە بۆ کردنەوەی نامەکە
              </p>
            </motion.div>
          )}

          {isDragging && !hasSnapped && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center select-none"
            >
              {/* Premium Progress Bar of the Pull */}
              <div className="w-32 h-[3px] bg-black/10 rounded-full overflow-hidden mb-1.5 backdrop-blur-sm">
                <div
                  className="h-full bg-linear-to-r from-rose-500 to-rose-400 transition-all duration-75"
                  style={{ width: `${successProgress}%` }}
                />
              </div>
              <p className="text-[11px] font-serif tracking-wider text-rose-800 font-semibold">
                {successProgress > 80 ? "خەریکە دەکرێتەوە! ✨" : `ڕادەکێشرێت - ${Math.round(successProgress)}%`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SVG Canvas for Rope Vector rendering */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full z-20">
        <defs>
          <filter id="rope-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.18" />
          </filter>
          <linearGradient id="rope-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="#000000" floodOpacity="0.3"></feDropShadow>
            <stop offset="0%" stopColor="#1C1B19" />
            <stop offset="50%" stopColor="#2D2B28" />
            <stop offset="100%" stopColor="#0B0B0A" />
          </linearGradient>
        </defs>

        {/* Rope vector lines: Outer rope, Inner core highlight */}
        {!hasSnapped && (
          <>
            {/* Shadow path */}
            <path
              ref={shadowPathRef}
              fill="none"
              stroke="#000000"
              strokeOpacity="0.22"
              strokeWidth="6"
              strokeLinecap="round"
              style={{ transform: "translate(3px, 5px)" }}
            />
            {/* Main silk braided string */}
            <path
              ref={mainPathRef}
              fill="none"
              stroke="url(#rope-grad)"
              strokeWidth="3.6"
              strokeLinecap="round"
            />
            {/* Golden woven accent thread */}
            <path
              ref={accentPathRef}
              fill="none"
              stroke="#E2B165"
              strokeWidth="1.2"
              strokeDasharray="4, 6"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
          </>
        )}
      </svg>

      {/* Interactive Drag Wax Seal Handle */}
      <button
        ref={sealRef}
        id="wax-seal-handle"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "76px",
          height: "76px",
          cursor: isDragging ? "grabbing" : "grab",
          willChange: "transform",
        }}
        className={`z-30 rounded-full focus:outline-hidden group select-none ${
          isDragging ? "scale-105" : "hover:scale-102 active:scale-98"
        } transition-[scale] duration-150`}
      >
        <AnimatePresence>
          {!hasSnapped ? (
            <div className="relative w-full h-full">
              {/* Outer soft glowing wax shadow ring */}
              <div className="absolute -inset-1.5 rounded-full bg-[#E54B88]/12 blur-md group-hover:bg-[#E54B88]/20 transition-all duration-300" />
              
              {/* Realistic 3D Vector Wax Seal */}
              <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_4px_10px_rgba(141,61,74,0.4)] pointer-events-none">
                <defs>
                  <radialGradient id="wax-grad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FA9C9C" />
                    <stop offset="35%" stopColor="#D93A54" />
                    <stop offset="75%" stopColor="#A61B34" />
                    <stop offset="100%" stopColor="#660A1A" />
                  </radialGradient>
                  <radialGradient id="inner-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#B32038" />
                    <stop offset="70%" stopColor="#801021" />
                    <stop offset="100%" stopColor="#4A0510" />
                  </radialGradient>
                </defs>
                {/* Wavy irregular layout of realistic wax puddle */}
                <path
                  d="M 50 6 C 65 5, 76 11, 86 20 C 96 29, 93 42, 94 56 C 95 70, 89 82, 78 88 C 67 94, 53 91, 38 93 C 23 95, 12 88, 7 74 C 2 60, 4 47, 8 34 C 12 21, 35 7, 50 6 Z"
                  fill="url(#wax-grad)"
                />
                
                {/* Pressed inner ridge */}
                <circle cx="50" cy="50" r="32" fill="url(#inner-grad)" stroke="#4A0510" strokeWidth="1" opacity="0.8" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#FFA3A8" strokeWidth="1.2" opacity="0.32" />
                
                {/* Heart design monogram inside */}
                <path
                  d="M 50 36 C 46 31, 38 31, 35 35 C 31 39, 31 47, 36 51 L 50 65 L 64 51 C 69 47, 69 39, 65 35 C 62 31, 54 31, 50 36 Z"
                  fill="#FFD2D6"
                  opacity="0.9"
                />
                <circle cx="50" cy="50" r="37" fill="none" stroke="#660A1A" strokeWidth="0.8" strokeDasharray="2, 3" opacity="0.5" />
              </svg>

              {/* Pulsing visual core indicators */}
              {!isDragging && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-rose-400 opacity-20"></span>
                </span>
              )}
            </div>
          ) : (
            // Snapped / Broken wax seal fragments
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <div className="absolute -inset-4 bg-rose-400/30 blur-lg rounded-full" />
              <div className="text-white text-lg font-serif">✨</div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Snapping / Particle burst sparks on snap */}
      {hasSnapped && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute w-24 h-24 rounded-full bg-rose-500/20 blur-md" />
              <div className="absolute w-3 h-3 bg-white rounded-full" />
              <Sparkles className="w-12 h-12 text-pink-300 animate-spin" />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
