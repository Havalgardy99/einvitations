import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Heart, 
  Sparkles, 
  Send, 
  User, 
  MessageSquare, 
  CheckCircle,
  Map,
  ChevronRight,
  Music,
  Users
} from "lucide-react";
import { RSVP, GuestbookEntry, InvitationTemplate } from "../types";
import { api } from "../api/client";
import { apiUrl, mediaUrl } from "../api/base";
import type { TemplatePresetKey } from "../../shared/templates";
import { DEFAULT_THEME_COLORS } from "../../shared/templateCategories";
import { buildThemeFromConfig } from "../templates/shared/buildThemeFromConfig";
import { getInvitationTheme } from "../templates/shared/invitationThemes";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.04
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const timelineItemVariants = {
  hidden: { opacity: 0, x: 35, scale: 0.97 },
  show: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 13
    }
  }
};

const popInVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12
    }
  }
};

interface InvitationMainProps {
  config: InvitationTemplate;
  slug: string;
  onReset: () => void;
  /** When set, applies a distinct color theme while keeping Royal-level layout & animations */
  themeId?: TemplatePresetKey;
}

export default function InvitationMain({
  config,
  slug,
  onReset,
  themeId
}: InvitationMainProps) {
  const t = config.themeOverrides
    ? buildThemeFromConfig({ ...DEFAULT_THEME_COLORS, ...config.themeOverrides })
    : getInvitationTheme(themeId ?? config.templateKey ?? "royal");
  const [activeTab, setActiveTab] = useState<"invite" | "timeline" | "rsvp" | "wishes">("invite");
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicTimerId, setMusicTimerId] = useState<any>(null);

  const [targetDate] = useState(() => new Date(config.countdownDate));

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Cleanup music sequence and audio context on unmount
  useEffect(() => {
    return () => {
      if (musicTimerId) {
        clearTimeout(musicTimerId);
      }
      if (audioContext) {
        audioContext.close().catch(() => {});
      }
    };
  }, [musicTimerId, audioContext]);

  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [attendingCount, setAttendingCount] = useState(0);

  useEffect(() => {
    fetch(apiUrl(`/api/invitations/${slug}/rsvps`))
      .then((r) => (r.ok ? r.json() : []))
      .then((list: { name: string }[]) => setAttendingCount(list.length))
      .catch(() => {});
  }, [slug]);

  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    isAttending: true,
    guestsCount: 1,
    dietaryRestrictions: "",
    favoriteSong: ""
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpForm.name.trim()) return;

    try {
      const newRSVP = await api.submitRsvp(slug, {
        name: rsvpForm.name.trim(),
        isAttending: rsvpForm.isAttending,
        guestsCount: rsvpForm.isAttending ? rsvpForm.guestsCount : 0,
        dietaryRestrictions: rsvpForm.dietaryRestrictions.trim(),
        favoriteSong: rsvpForm.favoriteSong.trim()
      });
      setRsvps([newRSVP, ...rsvps]);
      if (newRSVP.isAttending) {
        setAttendingCount((c) => c + 1);
      }
    } catch {
      return;
    }
    setRsvpSubmitted(true);
    
    // Clear form except name
    setTimeout(() => {
      setRsvpSubmitted(false);
      setRsvpForm({
        name: "",
        isAttending: true,
        guestsCount: 1,
        dietaryRestrictions: "",
        favoriteSong: ""
      });
    }, 2500);
  };

  const [comments, setComments] = useState<GuestbookEntry[]>([]);

  useEffect(() => {
    api.getGuestbook(slug).then(setComments).catch(() => setComments([]));
  }, [slug]);

  const [guestbookForm, setGuestbookForm] = useState({
    name: "",
    message: "",
    emoji: "❤️"
  });

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookForm.name.trim() || !guestbookForm.message.trim()) return;

    try {
      const newComment = await api.submitGuestbook(slug, {
        name: guestbookForm.name.trim(),
        message: guestbookForm.message.trim(),
        emoji: guestbookForm.emoji
      });
      setComments([newComment, ...comments]);
    } catch {
      return;
    }
    setGuestbookForm({
      name: "",
      message: "",
      emoji: "❤️"
    });
  };

  const imageIllustrationUrl = mediaUrl(config.coverImageUrl);

  return (
    <div className={`flex flex-col h-full font-sans antialiased overflow-hidden relative ${t.shell}`}>
      
      <div className={`absolute top-10 left-10 w-48 h-48 rounded-full blur-2xl pointer-events-none ${t.glow1}`} />
      <div className={`absolute bottom-20 right-10 w-48 h-48 rounded-full blur-2xl pointer-events-none ${t.glow2}`} />

      <div className={`relative pt-[max(1.5rem,env(safe-area-inset-top))] pb-4 sm:pb-5 px-4 sm:px-6 shrink-0 backdrop-blur-md border-b flex flex-col items-center select-none text-center z-10 ${t.header}`}>
        <div className={`text-[9px] tracking-[0.25em] font-mono uppercase mb-1.5 flex items-center justify-center gap-1 font-semibold ${t.headerLabel}`}>
          <Sparkles className={`w-3 h-3 animate-pulse ${t.gold}`} /> بانگهێشتنامەی فەرمی <Sparkles className={`w-3 h-3 animate-pulse ${t.gold}`} />
        </div>
        
        <h1 className={`font-serif text-3xl font-extralight tracking-widest mt-1 mb-2 ${t.monogram}`}>
          {config.monogram}
        </h1>
        
        <p className={`text-[10px] uppercase tracking-widest font-sans font-bold italic ${t.couple}`}>
          {config.coupleName1} و {config.coupleName2}
        </p>

        <button
          onClick={onReset}
          className={`absolute top-4 right-4 text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full transition-all border ${t.resetBtn}`}
        >
          سەرەتا
        </button>
      </div>

      {/* Main Tabbed Content Area */}
      <div className="grow overflow-y-auto px-5 py-6 space-y-6 scrollbar-thin z-10">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: CARD DETAILS */}
          {activeTab === "invite" && (
            <motion.div
              key="invite"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="space-y-6"
            >
              <motion.div 
                variants={itemVariants}
                className={`rounded-3xl border-2 p-6 shadow-2xl flex flex-col items-center relative overflow-hidden ${t.card}`}
              >
                <div className={`absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 opacity-80 rounded-tl-sm pointer-events-none ${t.cardCorner}`} />
                <div className={`absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 opacity-80 rounded-tr-sm pointer-events-none ${t.cardCorner}`} />
                <div className={`absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 opacity-80 rounded-bl-sm pointer-events-none ${t.cardCorner}`} />
                <div className={`absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 opacity-80 rounded-br-sm pointer-events-none ${t.cardCorner}`} />
                <div className={`absolute inset-4 border rounded-2xl pointer-events-none ${t.cardInner}`} />
                <div className={`absolute inset-5 border rounded-2xl pointer-events-none opacity-60 ${t.cardInner}`} />

                {/* Luxury Interactive Music Switcher */}
                <div className="w-full flex justify-end mb-2 relative z-20">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Initialize and toggle sweet synthesized wedding melody safely using Web Audio API
                      try {
                        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                        if (!AudioContextClass) return;
                        
                        if (!audioContext) {
                          const ctx = new AudioContextClass();
                          setAudioContext(ctx);
                          
                          // Play Canon in D beautifully using oscillators!
                          const tempo = 130;
                          const noteOffset = 60 / tempo;
                          const chords = [
                            [74, 69, 66], // D Major
                            [73, 69, 64], // A Major
                            [71, 66, 62], // B Minor
                            [69, 66, 61], // F# Minor
                            [67, 62, 59], // G Major
                            [66, 62, 57], // D Major
                            [67, 62, 59], // G Major
                            [69, 64, 61], // A Major
                          ];
                          
                          let activeOscillators: { stop: () => void }[] = [];
                          let barCounter = 0;
                          
                          const playNextBar = () => {
                            const now = ctx.currentTime;
                            const notes = chords[barCounter % chords.length];
                            
                            // Play root bass note
                            const bassOsc = ctx.createOscillator();
                            const bassGain = ctx.createGain();
                            bassOsc.connect(bassGain);
                            bassGain.connect(ctx.destination);
                            bassOsc.type = "sine";
                            bassOsc.frequency.setValueAtTime(440 * Math.pow(2, (notes[2] - 12 - 69) / 12), now);
                            bassGain.gain.setValueAtTime(0.08, now);
                            bassGain.gain.exponentialRampToValueAtTime(0.01, now + noteOffset * 3.8);
                            bassOsc.start(now);
                            bassOsc.stop(now + noteOffset * 4);
                            activeOscillators.push(bassOsc);

                            // Arpeggiate melody notes beautifully with glass chime/harp pluck effect
                            notes.forEach((midi, idx) => {
                              const pitch = 440 * Math.pow(2, (midi - 69) / 12);
                              const pluckOsc = ctx.createOscillator();
                              const pluckGain = ctx.createGain();
                              
                              pluckOsc.connect(pluckGain);
                              pluckGain.connect(ctx.destination);
                              pluckOsc.type = "triangle";
                              pluckOsc.frequency.setValueAtTime(pitch, now + idx * (noteOffset * 0.5));
                              
                              pluckGain.gain.setValueAtTime(0, now);
                              pluckGain.gain.linearRampToValueAtTime(0.07, now + idx * (noteOffset * 0.5) + 0.03);
                              pluckGain.gain.exponentialRampToValueAtTime(0.005, now + idx * (noteOffset * 0.5) + 1.2);
                              
                              pluckOsc.start(now + idx * (noteOffset * 0.5));
                              pluckOsc.stop(now + idx * (noteOffset * 0.5) + 1.5);
                              activeOscillators.push(pluckOsc);
                            });

                            barCounter++;
                            const nextTimeout = setTimeout(playNextBar, noteOffset * 4000);
                            setMusicTimerId(nextTimeout);
                          };
                          
                          playNextBar();
                          setIsMusicPlaying(true);
                        } else {
                          // Toggle mute/play
                          if (audioContext.state === "suspended") {
                            audioContext.resume();
                            setIsMusicPlaying(true);
                          } else if (audioContext.state === "running") {
                            audioContext.suspend();
                            setIsMusicPlaying(false);
                          }
                        }
                      } catch (err) {
                        console.error("Audio Context failed: ", err);
                      }
                    }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-mono tracking-widest uppercase transition-all shadow-3xs cursor-pointer z-10 ${
                      isMusicPlaying 
                        ? "bg-[#6D1520] border-[#4D0A11] text-white animate-pulse" 
                        : "bg-[#FCFAF2] border-[#CBB084]/40 text-[#6D1520] hover:bg-[#F2ECE0]"
                    }`}
                  >
                    <Music className={`w-3 h-3 ${isMusicPlaying ? "animate-spin" : ""}`} />
                    {isMusicPlaying ? "مۆسیقا: چالاکە 🎵" : "گوێگرتن لە مۆسیقا"}
                  </motion.button>
                </div>

                {/* Cover Image styled like an antique watercolor master painting frame */}
                <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-[#FAF7F3] border-4 border-double border-[#CBB084] relative shadow-lg group">
                  <img
                    src={imageIllustrationUrl}
                    alt="Bespoke Kurdish Wedding Couple Illustration"
                    className="w-full h-full object-cover object-center transition-transform duration-[12s] ease-out scale-102 group-hover:scale-108 select-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FCFAF9]/30 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Subtle luxurious gold sparkles on the painting edge */}
                  <div className="absolute inset-3 border border-white/30 rounded-lg pointer-events-none" />
                </div>

                {/* Luxury Typography and Flourishes */}
                <div className="text-center font-serif leading-relaxed text-[#1C0F11] text-sm max-w-xs space-y-4 relative z-10 animate-fade-in">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="h-[1px] w-6 bg-[#CBB084] opacity-50" />
                    <Heart className="w-3.5 h-3.5 text-[#6D1520] fill-[#6D1520]" />
                    <span className="h-[1px] w-6 bg-[#CBB084] opacity-50" />
                  </div>

                  <p className="italic text-[#6D1520] text-[13px] font-bold tracking-[0.15em] uppercase">
                    {config.inviteGreeting}
                  </p>
                  
                  <p className="text-[#2C181B] leading-relaxed text-[15px] font-semibold leading-loose text-justify">
                    {config.inviteBody}
                  </p>

                  <div className="flex items-center justify-center py-2">
                    {/* Exquisite custom graphical separator fleur-de-lis block */}
                    <div className="flex items-center gap-1.5 opacity-60">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#CBB084]" />
                      <div className="w-[1.5px] h-6 bg-[#CBB084] skew-x-12" />
                      <div className="w-2 h-2 rotate-45 border-2 border-[#CBB084] bg-[#FCFAF2]" />
                      <div className="w-[1.5px] h-6 bg-[#CBB084] -skew-x-12" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#CBB084]" />
                    </div>
                  </div>

                  <p className="text-[#6D1520] tracking-[0.2em] font-sans font-extrabold uppercase text-[15px] drop-shadow-3xs">
                    {config.dateDisplay}
                  </p>
                  
                  <div className="inline-block bg-[#6D1520]/5 px-4 py-1.5 rounded-full border border-[#6D1520]/20 shadow-3xs text-center">
                    <p className="text-[11px] font-serif tracking-wide uppercase text-[#6D1520] font-bold">
                      {config.eventTime}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Countdown Ticker Box */}
              <motion.div 
                variants={itemVariants}
                className={`rounded-2xl border p-4 text-center shadow-lg ${t.countdownOuter}`}
              >
                <p className={`text-xs tracking-widest uppercase font-serif mb-3 font-semibold ${t.countdownLabel}`}>
                  کاتی ماوە بۆ ڕێوڕەسمەکە
                </p>
                
                <div className="grid grid-cols-4 gap-1.5 max-w-xs mx-auto">
                  {[
                    { val: timeLeft.days, unit: "ڕۆژ" },
                    { val: timeLeft.hours, unit: "کاتژمێر" },
                    { val: timeLeft.minutes, unit: "خولەک" },
                    { val: timeLeft.seconds, unit: "چرکە" }
                  ].map((x, i) => (
                    <div key={i} className={`flex flex-col border p-2 rounded-xl shadow-xs ${t.countdownCell}`}>
                      <span className={`font-serif text-xl font-bold tracking-tight ${t.countdownNum}`}>
                        {String(x.val).padStart(2, "0")}
                      </span>
                      <span className={`text-[10px] font-sans tracking-wide uppercase mt-0.5 font-bold ${t.countdownUnit}`}>
                        {x.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className={`rounded-2xl border backdrop-blur-xs p-5 shadow-sm space-y-4 ${t.venueCard}`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-[#6D1520]/10 border border-[#6D1520]/20 text-[#6D1520]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-serif text-base font-bold text-[#1C0F11]">شوێنی ڕێوڕەسمەکە</h3>
                    <p className="text-xs text-[#2C181B] font-semibold">{config.venueName}</p>
                  </div>
                </div>

                <div className="h-[1px] bg-[#EFCFC7]/40" />

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-[#6D1520]/10 border border-[#6D1520]/20 text-[#6D1520]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-serif text-base font-bold text-[#1C0F11]">کاتی دەستپێکردن</h3>
                    <p className="text-xs text-[#2C181B] font-semibold">{config.scheduleDetails}</p>
                  </div>
                </div>

                {/* Simulated Google Map Widget */}
                <div className="w-full aspect-21/9 rounded-xl overflow-hidden border border-[#CBB084]/35 bg-[#261315] relative mt-2 group">
                  <div className="absolute inset-0 bg-[#FCFAF2]/95 p-4 flex flex-col justify-end text-right">
                    <div className="flex items-center gap-2 mb-1 justify-end">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#6D1520] font-bold">نەخشەی ڕێڕەوی ڕاستەوخۆ (Live GPS)</span>
                      <Map className="w-3.5 h-3.5 text-[#6D1520]" />
                    </div>
                    <p className="text-[10px] text-[#2C181B] font-semibold">{config.mapAddressLine}</p>
                  </div>
                  {/* Subtle graphical map design pattern inside */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
                  <a
                    href={config.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute top-2 left-2 bg-[#FCFAF2] border border-[#CBB084]/40 hover:bg-[#F2ECE0] text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-full shadow-xs font-bold text-[#6D1520] z-10 flex items-center gap-1"
                  >
                    لە نەخشەدا بیکەوە <ChevronRight className="w-2.5 h-2.5 text-[#D4AF37]" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* TAB 2: TIMELINE PANEL */}
          {activeTab === "timeline" && (
            <motion.div
              key="timeline"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="space-y-5"
            >
              <motion.div variants={itemVariants} className="text-center py-2">
                <h3 className={`font-serif text-lg font-bold tracking-wide ${t.timelineTitle}`}>
                  برۆگرامی ڕۆژی گەورە
                </h3>
                <p className={`text-xs mt-1 font-serif italic ${t.timelineSub}`}>
                  {config.timelineDateLabel}
                </p>
              </motion.div>

              <div className={`relative pr-6 space-y-6 before:absolute before:right-2 before:top-2 before:bottom-2 before:w-[1.5px] text-right ${t.timelineLine}`}>
                {config.timeline.map((item, index) => (
                  <motion.div 
                    key={index}
                    variants={timelineItemVariants}
                    className="relative group"
                  >
                    <div className={`absolute -right-[7px] top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center group-hover:scale-115 transition-transform z-10 shadow-xs ${t.timelineNode}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${t.timelineNodeDot}`} />
                    </div>
                    
                    <div className={`border rounded-2xl p-4 shadow-xs transition-all space-y-1 mr-4 ${t.timelineItem}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{item.icon}</span>
                        <span className={`text-[10px] font-mono tracking-wider font-bold px-2.5 py-1 rounded-full border ${t.wineBg}/10 ${t.wine} ${t.cardInner}`}>
                          {item.time}
                        </span>
                      </div>
                      <h4 className={`font-serif text-sm font-bold pt-1 ${t.cardTitle}`}>
                        {item.title}
                      </h4>
                      <p className={`text-xs font-medium leading-relaxed ${t.cardBody}`}>
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: RSVP FORM */}
          {activeTab === "rsvp" && (
            <motion.div
              key="rsvp"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="space-y-4"
            >
              <motion.div 
                variants={itemVariants}
                className="bg-[#FCFAF2]/95 border-2 border-[#CBB084]/65 rounded-3xl p-5 shadow-sm space-y-4 relative"
              >
                <div className="absolute inset-2 border border-[#CBB084]/15 rounded-2xl pointer-events-none" />
                
                <div className="text-center space-y-1 relative z-10">
                  <h3 className="font-serif text-lg font-bold text-[#1C0F11]">
                    پشتڕاستکردنەوەی بەشداریکردن (RSVP)
                  </h3>
                  <p className="text-xs text-[#2C181B] font-semibold">
                    {config.rsvpDeadline}
                  </p>
                </div>

                {rsvpSubmitted ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-10 text-center space-y-3 flex flex-col items-center justify-center relative z-10"
                  >
                    <div className="p-3.5 rounded-full bg-emerald-950/10 text-emerald-800 border border-emerald-800/30">
                      <CheckCircle className="w-8 h-8 animate-bounce text-emerald-700" />
                    </div>
                    <p className="font-serif text-base text-[#1C0F11] font-bold">بە سەرکەوتوویی پشتڕاستکرایەوە!</p>
                    <p className="text-xs text-[#6D1520] font-mono font-bold">سەربەرزمان دەکەن بە هاوبەشی لە دڵخۆشیماندا. ❤️</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleRSVPSubmit} className="space-y-4 relative z-10 text-right">
                    {/* User Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono tracking-wider uppercase text-[#6D1520] flex items-center gap-1.5 font-bold justify-end">
                        ناو و پاشناوی تەواوتان <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="بۆ نموونە: ئارتین زریان"
                        value={rsvpForm.name}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                        className="w-full bg-[#1A0A0C]/5 border-2 border-[#CBB084]/40 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-right text-[#1C0F11] font-semibold"
                      />
                    </div>

                    {/* Attending State Toggle BUTTONS */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono tracking-wider uppercase text-[#6D1520] font-bold block text-right">
                        ئایا ئامادە دەبن لە ئاهەنگەکەدا؟
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setRsvpForm({ ...rsvpForm, isAttending: true })}
                          className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            rsvpForm.isAttending
                                ? "bg-[#6D1520] text-white border-transparent shadow-xs"
                                : "bg-[#FCFAF2] border-2 border-[#CBB084]/40 text-[#6D1520] hover:bg-[#F2ECE0]"
                          }`}
                        >
                          بەڵێ، بە شانازییەوە دێم!
                        </button>
                        <button
                          type="button"
                          onClick={() => setRsvpForm({ ...rsvpForm, isAttending: false })}
                          className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            !rsvpForm.isAttending
                                ? "bg-[#6D1520] text-white border-transparent shadow-xs"
                                : "bg-[#FCFAF2] border-2 border-[#CBB084]/40 text-[#6D1520] hover:bg-[#F2ECE0]"
                          }`}
                        >
                          ببوورن، ناتوانم بێم
                        </button>
                      </div>
                    </div>

                    {/* Optional guest counter if attending */}
                    {rsvpForm.isAttending && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1"
                      >
                        <label className="text-[11px] font-mono tracking-wider uppercase text-[#6D1520] flex items-center gap-1.5 font-bold justify-end">
                          ژمارەی هاوەڵەکانتان <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </label>
                        <select
                          value={rsvpForm.guestsCount}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, guestsCount: Number(e.target.value) })}
                          className="w-full bg-[#1A0A0C]/5 border-2 border-[#CBB084]/40 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-right text-[#1C0F11] font-semibold"
                        >
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? "میوانم" : "میوان"}</option>
                          ))}
                        </select>
                      </motion.div>
                    )}

                    {/* Meal Restrictions */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono tracking-wider uppercase text-[#6D1520] font-bold block text-right">
                        جۆری خواردنی دڵخواز یان هەستیاری (ئەگەر هەیە)
                      </label>
                      <input
                        type="text"
                        placeholder="بۆ نموونە: سەوزەخۆر، بێ گلوتێن، نییە، هتد."
                        value={rsvpForm.dietaryRestrictions}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, dietaryRestrictions: e.target.value })}
                        className="w-full bg-[#1A0A0C]/5 border-2 border-[#CBB084]/40 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-right text-[#1C0F11] font-semibold"
                      />
                    </div>

                    {/* Music request */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono tracking-wider uppercase text-[#6D1520] flex items-center gap-1.5 font-bold justify-end">
                        پێشنیاری گۆرانییەکمان بۆ بکە <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </label>
                      <input
                        type="text"
                        placeholder="بۆ نموونە: گۆرانی سەمای سەرەتایی خۆش..."
                        value={rsvpForm.favoriteSong}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, favoriteSong: e.target.value })}
                        className="w-full bg-[#1A0A0C]/5 border-2 border-[#CBB084]/40 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-right text-[#1C0F11] font-semibold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#6D1520] hover:bg-[#4D0A11] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      ناردنی پشتڕاستکردنەوە <Send className="w-3.5 h-3.5 text-amber-200" />
                    </button>
                  </form>
                )}
              </motion.div>

              {/* Dynamic Attendees counter based on stored data! */}
              <motion.div 
                variants={itemVariants}
                className="bg-[#FCFAF2] border-2 border-[#CBB084]/65 rounded-2xl p-4 flex items-center justify-between shadow-3xs"
              >
                <span className="text-xs font-extrabold text-[#6D1520] bg-[#6D1520]/5 border border-[#CBB084]/40 px-2.5 py-1 rounded-full">
                  {attendingCount} کەس تا ئێستا ناویان نووسیوە
                </span>
                <span className="text-xs text-[#2C181B] font-bold">ئامادەبووانی پشتڕاستکراوە:</span>
              </motion.div>
            </motion.div>
          )}

          {/* TAB 4: WISHES WALL GUESTBOOK */}
          {activeTab === "wishes" && (
            <motion.div
              key="wishes"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="space-y-6"
            >
              {/* Dynamic Comment Form */}
              <motion.div 
                variants={itemVariants}
                className="bg-[#FCFAF2]/95 border-2 border-[#CBB084]/65 rounded-3xl p-5 shadow-sm space-y-4 relative"
              >
                <div className="absolute inset-2 border border-[#CBB084]/15 rounded-2xl pointer-events-none" />
                
                <h3 className="font-serif text-base font-bold text-[#1C0F11] text-center relative z-10">
                  نامەی پیرۆزبایی بنووسە ✍️
                </h3>
                
                <form onSubmit={handleCommentSubmit} className="space-y-3.5 relative z-10 text-right">
                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      placeholder="ناوی بەڕێزتان"
                      value={guestbookForm.name}
                      onChange={(e) => setGuestbookForm({ ...guestbookForm, name: e.target.value })}
                      className="w-full bg-[#1A0A0C]/5 border-2 border-[#CBB084]/40 rounded-xl px-4 py-2.5 text-xs text-right focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-[#1C0F11] font-semibold"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <textarea
                      required
                      rows={3}
                      placeholder="پەیامی پڕ لە خۆشەویستی و پیرۆزبایی دڵسۆزانەتان لێرە بنووسن..."
                      value={guestbookForm.message}
                      onChange={(e) => setGuestbookForm({ ...guestbookForm, message: e.target.value })}
                      className="w-full bg-[#1A0A0C]/5 border-2 border-[#CBB084]/40 rounded-xl px-4 py-2.5 text-xs text-right focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none text-[#1C0F11] font-semibold"
                    />
                  </div>

                  {/* Reaction Selector */}
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="text-[10px] font-mono tracking-wider text-[#6D1520] font-bold uppercase shrink-0">
                      پەرچەکرداری ئیمۆجی:
                    </span>
                    <div className="flex items-center gap-1.5 grow justify-around">
                      {["❤️", "🥂", "💍", "✨", "🎉", "🌸"].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setGuestbookForm({ ...guestbookForm, emoji })}
                          className={`text-lg p-1.5 rounded-lg transition-transform hover:scale-120 active:scale-90 cursor-pointer ${
                            guestbookForm.emoji === emoji ? "bg-[#6D1520]/15 scale-110" : ""
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#6D1520] hover:bg-[#4D0A11] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    ناردنی مۆر و پیرۆزبایی <Send className="w-3 h-3 text-amber-200" />
                  </button>
                </form>
              </motion.div>

              {/* Stored Comments Loop */}
              <motion.div variants={itemVariants} className="space-y-3.5 text-right">
                <div className="flex items-center justify-between border-b border-[#CBB084]/40 pb-1.5 flex-row-reverse">
                  <h4 className="text-[11px] font-mono tracking-wider uppercase text-[#CBB084] font-extrabold text-right">
                    نامەکانی پیرۆزبایی ({comments.length})
                  </h4>
                  <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37] animate-pulse" />
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {comments.map((comment) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -15 }}
                        key={comment.id}
                        className="p-4 bg-[#FCFAF2]/95 border border-[#CBB084]/35 rounded-2xl relative space-y-1.5 shadow-xs text-right pr-4 pl-12"
                      >
                        <div className="flex items-center justify-between flex-row-reverse">
                          <span className="font-serif text-xs font-extrabold text-[#1C0F11]">
                            {comment.name}
                          </span>
                          <span className="text-[9px] font-mono text-[#6D1520] font-bold">
                            {comment.timestamp}
                          </span>
                        </div>
                        
                        <p className="text-[#2C181B] font-semibold text-xs leading-relaxed text-right pr-2">
                          {comment.message}
                        </p>

                        <div className="absolute bottom-3 left-2.5 text-xs opacity-95 select-none bg-[#6D1520]/5 px-2 py-0.5 rounded-lg border border-[#CBB084]/30 shadow-3xs">
                          {comment.emoji}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Elegant Fixed Bottom Navigation Ribbons/Tabs */}
      <div
        className={`shrink-0 border-t py-2 sm:py-3.5 px-2 sm:px-4 z-20 flex justify-between select-none shadow-[0_-4px_16px_rgba(0,0,0,0.45)] ${t.nav}`}
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        {[
          { id: "invite" as const, label: "بانگهێشت", icon: <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
          { id: "timeline" as const, label: "بەرنامە", icon: <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
          { id: "rsvp" as const, label: "بەشداری", icon: <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
          { id: "wishes" as const, label: "پیرۆزبایی", icon: <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-0.5 sm:gap-1.5 py-1 sm:py-1.5 px-1 sm:px-2.5 rounded-xl transition-all grow min-w-0 cursor-pointer ${
              activeTab === tab.id ? `${t.navActive} font-bold` : t.navInactive
            }`}
          >
            <div className={`p-1 sm:p-1.5 rounded-lg transition-all ${
              activeTab === tab.id ? `${t.navIconActive} shadow-xs ring-1` : ""
            }`}>
              {tab.icon}
            </div>
            <span className="text-[8px] sm:text-[10px] uppercase tracking-wide font-extrabold truncate max-w-full">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}
