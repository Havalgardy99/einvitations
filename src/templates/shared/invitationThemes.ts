import type { TemplatePresetKey } from "../../../shared/templates";

/** Tailwind class bundles — same layout as Royal, different palette per template */
export interface InvitationThemeClasses {
  shell: string;
  glow1: string;
  glow2: string;
  header: string;
  headerLabel: string;
  monogram: string;
  couple: string;
  resetBtn: string;
  card: string;
  cardCorner: string;
  cardInner: string;
  cardTitle: string;
  cardBody: string;
  cardAccent: string;
  wine: string;
  wineBg: string;
  wineBorder: string;
  gold: string;
  goldSoft: string;
  countdownOuter: string;
  countdownLabel: string;
  countdownCell: string;
  countdownNum: string;
  countdownUnit: string;
  venueCard: string;
  timelineTitle: string;
  timelineSub: string;
  timelineLine: string;
  timelineNode: string;
  timelineNodeDot: string;
  timelineItem: string;
  nav: string;
  navActive: string;
  navInactive: string;
  navIconActive: string;
  input: string;
  submitBtn: string;
}

const royal: InvitationThemeClasses = {
  shell: "bg-[#1A0A0C] text-[#F5E6D3]",
  glow1: "bg-[#801824]/20",
  glow2: "bg-[#D4AF37]/8",
  header: "bg-[#210D0F]/95 border-[#3D1A1E]",
  headerLabel: "text-[#D4AF37]",
  monogram: "text-[#F5E6D3]",
  couple: "text-[#CBB084]",
  resetBtn: "text-[#D4AF37] border-[#D4AF37]/35 bg-white/5 hover:bg-white/10",
  card: "border-[#CBB084]/65 bg-[#FCFAF2]",
  cardCorner: "border-[#D4AF37]",
  cardInner: "border-[#CBB084]/15",
  cardTitle: "text-[#6D1520]",
  cardBody: "text-[#2C181B]",
  cardAccent: "text-[#6D1520]",
  wine: "text-[#6D1520]",
  wineBg: "bg-[#6D1520]",
  wineBorder: "border-[#6D1520]",
  gold: "text-[#D4AF37]",
  goldSoft: "text-[#CBB084]",
  countdownOuter: "bg-[#2D1418] border-[#4D2429]",
  countdownLabel: "text-[#FCFAF2]/80",
  countdownCell: "bg-[#FCFAF2] border-[#CBB084]/40",
  countdownNum: "text-[#1C0F11]",
  countdownUnit: "text-[#6D1520]",
  venueCard: "border-[#CBB084]/35 bg-[#FCFAF2]/95",
  timelineTitle: "text-[#F5E6D3]",
  timelineSub: "text-[#CBB084]",
  timelineLine: "before:bg-[#D4AF37]/50",
  timelineNode: "bg-[#FCFAF2] border-[#D4AF37]",
  timelineNodeDot: "bg-[#6D1520]",
  timelineItem: "bg-[#FCFAF2] border-[#CBB084]/40 hover:border-[#D4AF37]/60",
  nav: "bg-[#210D0F] border-[#3D1A1E]",
  navActive: "text-[#D4AF37]",
  navInactive: "text-[#CBB084]/65 hover:text-[#FCFAF2]",
  navIconActive: "bg-[#FCFAF2]/10 ring-[#D4AF37]/35",
  input: "border-[#CBB084]/40 bg-[#1A0A0C]/5 text-[#1C0F11] focus:border-[#D4AF37] focus:ring-[#D4AF37]",
  submitBtn: "bg-[#6D1520] hover:bg-[#4D0A11] text-white"
};

const garden: InvitationThemeClasses = {
  shell: "bg-[#0a1f14] text-[#ecfdf5]",
  glow1: "bg-emerald-500/15",
  glow2: "bg-lime-400/10",
  header: "bg-[#14532d]/95 border-emerald-800/50",
  headerLabel: "text-lime-300",
  monogram: "text-emerald-50",
  couple: "text-emerald-200",
  resetBtn: "text-lime-300 border-lime-400/40 bg-white/5 hover:bg-white/10",
  card: "border-emerald-600/50 bg-[#f0fdf4]",
  cardCorner: "border-emerald-500",
  cardInner: "border-emerald-300/30",
  cardTitle: "text-emerald-900",
  cardBody: "text-emerald-950",
  cardAccent: "text-emerald-800",
  wine: "text-emerald-800",
  wineBg: "bg-emerald-700",
  wineBorder: "border-emerald-700",
  gold: "text-lime-500",
  goldSoft: "text-emerald-600",
  countdownOuter: "bg-emerald-950/80 border-emerald-700/50",
  countdownLabel: "text-emerald-100/90",
  countdownCell: "bg-[#f0fdf4] border-emerald-400/50",
  countdownNum: "text-emerald-950",
  countdownUnit: "text-emerald-800",
  venueCard: "border-emerald-500/35 bg-[#f0fdf4]/95",
  timelineTitle: "text-emerald-50",
  timelineSub: "text-lime-300",
  timelineLine: "before:bg-lime-400/50",
  timelineNode: "bg-[#f0fdf4] border-lime-400",
  timelineNodeDot: "bg-emerald-700",
  timelineItem: "bg-[#f0fdf4] border-emerald-400/40 hover:border-lime-400/60",
  nav: "bg-[#14532d] border-emerald-800/50",
  navActive: "text-lime-300",
  navInactive: "text-emerald-300/65 hover:text-emerald-50",
  navIconActive: "bg-emerald-50/10 ring-lime-400/35",
  input: "border-emerald-400/50 bg-emerald-950/5 text-emerald-950 focus:border-lime-500 focus:ring-lime-400",
  submitBtn: "bg-emerald-700 hover:bg-emerald-800 text-white"
};

const night: InvitationThemeClasses = {
  shell: "bg-[#070b18] text-indigo-100",
  glow1: "bg-indigo-500/20",
  glow2: "bg-cyan-400/10",
  header: "bg-[#0f172a]/95 border-indigo-500/30",
  headerLabel: "text-cyan-300",
  monogram: "text-indigo-50",
  couple: "text-indigo-300",
  resetBtn: "text-cyan-300 border-cyan-400/35 bg-white/5 hover:bg-white/10",
  card: "border-indigo-400/40 bg-indigo-950/40 backdrop-blur-md",
  cardCorner: "border-cyan-400",
  cardInner: "border-indigo-400/20",
  cardTitle: "text-cyan-200",
  cardBody: "text-indigo-100",
  cardAccent: "text-cyan-300",
  wine: "text-cyan-300",
  wineBg: "bg-indigo-600",
  wineBorder: "border-indigo-500",
  gold: "text-cyan-300",
  goldSoft: "text-indigo-300",
  countdownOuter: "bg-indigo-950/90 border-indigo-500/40",
  countdownLabel: "text-indigo-200/80",
  countdownCell: "bg-indigo-900/60 border-cyan-400/30",
  countdownNum: "text-cyan-100",
  countdownUnit: "text-indigo-300",
  venueCard: "border-indigo-400/30 bg-indigo-950/50 backdrop-blur-sm",
  timelineTitle: "text-indigo-50",
  timelineSub: "text-cyan-300/80",
  timelineLine: "before:bg-cyan-400/40",
  timelineNode: "bg-indigo-900 border-cyan-400",
  timelineNodeDot: "bg-cyan-400",
  timelineItem: "bg-indigo-950/50 border-indigo-400/35 hover:border-cyan-400/50",
  nav: "bg-[#0f172a] border-indigo-500/25",
  navActive: "text-cyan-300",
  navInactive: "text-indigo-400/70 hover:text-indigo-100",
  navIconActive: "bg-cyan-400/10 ring-cyan-400/35",
  input: "border-indigo-400/40 bg-indigo-950/50 text-indigo-50 focus:border-cyan-400 focus:ring-cyan-400",
  submitBtn: "bg-gradient-to-l from-indigo-600 to-cyan-700 hover:from-indigo-500 hover:to-cyan-600 text-white"
};

const minimal: InvitationThemeClasses = {
  shell: "bg-neutral-950 text-neutral-100",
  glow1: "bg-neutral-500/10",
  glow2: "bg-white/5",
  header: "bg-neutral-900/95 border-neutral-700",
  headerLabel: "text-neutral-400",
  monogram: "text-white",
  couple: "text-neutral-400",
  resetBtn: "text-neutral-300 border-neutral-600 bg-white/5 hover:bg-white/10",
  card: "border-neutral-600 bg-neutral-100",
  cardCorner: "border-neutral-800",
  cardInner: "border-neutral-300/50",
  cardTitle: "text-neutral-900",
  cardBody: "text-neutral-700",
  cardAccent: "text-neutral-900",
  wine: "text-neutral-900",
  wineBg: "bg-neutral-900",
  wineBorder: "border-neutral-800",
  gold: "text-neutral-600",
  goldSoft: "text-neutral-500",
  countdownOuter: "bg-neutral-900 border-neutral-700",
  countdownLabel: "text-neutral-300/80",
  countdownCell: "bg-white border-neutral-300",
  countdownNum: "text-neutral-900",
  countdownUnit: "text-neutral-600",
  venueCard: "border-neutral-400 bg-neutral-100/95",
  timelineTitle: "text-neutral-100",
  timelineSub: "text-neutral-400",
  timelineLine: "before:bg-neutral-500/50",
  timelineNode: "bg-white border-neutral-600",
  timelineNodeDot: "bg-neutral-900",
  timelineItem: "bg-neutral-100 border-neutral-300 hover:border-neutral-500",
  nav: "bg-neutral-900 border-neutral-700",
  navActive: "text-white",
  navInactive: "text-neutral-500 hover:text-neutral-200",
  navIconActive: "bg-white/10 ring-neutral-400/35",
  input: "border-neutral-400 bg-white text-neutral-900 focus:border-neutral-900 focus:ring-neutral-700",
  submitBtn: "bg-neutral-900 hover:bg-neutral-800 text-white"
};

const sunset: InvitationThemeClasses = {
  shell: "bg-[#2a1208] text-orange-50",
  glow1: "bg-orange-500/20",
  glow2: "bg-rose-400/12",
  header: "bg-[#7c2d12]/90 border-orange-400/30",
  headerLabel: "text-amber-200",
  monogram: "text-orange-50",
  couple: "text-orange-200",
  resetBtn: "text-amber-200 border-amber-300/40 bg-white/5 hover:bg-white/10",
  card: "border-orange-300/50 bg-[#fff7ed]",
  cardCorner: "border-amber-400",
  cardInner: "border-orange-200/40",
  cardTitle: "text-orange-950",
  cardBody: "text-orange-900",
  cardAccent: "text-orange-800",
  wine: "text-orange-900",
  wineBg: "bg-orange-800",
  wineBorder: "border-orange-700",
  gold: "text-amber-500",
  goldSoft: "text-orange-600",
  countdownOuter: "bg-orange-950/80 border-orange-600/40",
  countdownLabel: "text-orange-100/85",
  countdownCell: "bg-[#fff7ed] border-amber-400/45",
  countdownNum: "text-orange-950",
  countdownUnit: "text-orange-800",
  venueCard: "border-orange-400/35 bg-[#fff7ed]/95",
  timelineTitle: "text-orange-50",
  timelineSub: "text-amber-200",
  timelineLine: "before:bg-amber-400/50",
  timelineNode: "bg-[#fff7ed] border-amber-400",
  timelineNodeDot: "bg-orange-700",
  timelineItem: "bg-[#fff7ed] border-orange-300/45 hover:border-amber-400/55",
  nav: "bg-[#7c2d12] border-orange-500/30",
  navActive: "text-amber-200",
  navInactive: "text-orange-300/70 hover:text-orange-50",
  navIconActive: "bg-orange-50/10 ring-amber-300/35",
  input: "border-orange-300/50 bg-orange-950/5 text-orange-950 focus:border-amber-500 focus:ring-amber-400",
  submitBtn: "bg-orange-800 hover:bg-orange-900 text-white"
};

const classic: InvitationThemeClasses = {
  shell: "bg-[#0d1b2a] text-[#e0e1dd]",
  glow1: "bg-[#c9a227]/15",
  glow2: "bg-[#778da9]/15",
  header: "bg-[#1b263b]/95 border-[#c9a227]/40",
  headerLabel: "text-[#c9a227]",
  monogram: "text-[#e0e1dd]",
  couple: "text-[#a8b2c1]",
  resetBtn: "text-[#c9a227] border-[#c9a227]/40 bg-white/5 hover:bg-white/10",
  card: "border-[#778da9]/40 bg-[#e0e1dd]",
  cardCorner: "border-[#c9a227]",
  cardInner: "border-[#778da9]/25",
  cardTitle: "text-[#1b263b]",
  cardBody: "text-[#415a77]",
  cardAccent: "text-[#1b263b]",
  wine: "text-[#1b263b]",
  wineBg: "bg-[#1b263b]",
  wineBorder: "border-[#1b263b]",
  gold: "text-[#c9a227]",
  goldSoft: "text-[#778da9]",
  countdownOuter: "bg-[#1b263b] border-[#778da9]/50",
  countdownLabel: "text-[#e0e1dd]/85",
  countdownCell: "bg-[#e0e1dd] border-[#c9a227]/35",
  countdownNum: "text-[#1b263b]",
  countdownUnit: "text-[#415a77]",
  venueCard: "border-[#778da9]/35 bg-[#e0e1dd]/95",
  timelineTitle: "text-[#e0e1dd]",
  timelineSub: "text-[#c9a227]",
  timelineLine: "before:bg-[#c9a227]/50",
  timelineNode: "bg-[#e0e1dd] border-[#c9a227]",
  timelineNodeDot: "bg-[#1b263b]",
  timelineItem: "bg-[#e0e1dd] border-[#778da9]/40 hover:border-[#c9a227]/55",
  nav: "bg-[#1b263b] border-[#c9a227]/30",
  navActive: "text-[#c9a227]",
  navInactive: "text-[#a8b2c1]/70 hover:text-[#e0e1dd]",
  navIconActive: "bg-[#e0e1dd]/10 ring-[#c9a227]/35",
  input: "border-[#778da9]/50 bg-white text-[#1b263b] focus:border-[#c9a227] focus:ring-[#c9a227]",
  submitBtn: "bg-[#1b263b] hover:bg-[#0d1b2a] text-[#c9a227]"
};

const cinematic: InvitationThemeClasses = {
  shell: "bg-[#0a0608] text-[#F5E6D3]",
  glow1: "bg-[#801824]/25",
  glow2: "bg-[#D4AF37]/12",
  header: "bg-[#1a0a0e]/95 border-[#3D1A1E]",
  headerLabel: "text-[#D4AF37]",
  monogram: "text-[#F5E6D3]",
  couple: "text-[#CBB084]",
  resetBtn: "text-[#D4AF37] border-[#D4AF37]/35 bg-white/5 hover:bg-white/10",
  card: "border-[#CBB084]/65 bg-[#FCFAF2]",
  cardCorner: "border-[#D4AF37]",
  cardInner: "border-[#CBB084]/15",
  cardTitle: "text-[#6D1520]",
  cardBody: "text-[#2C181B]",
  cardAccent: "text-[#6D1520]",
  wine: "text-[#6D1520]",
  wineBg: "bg-[#6D1520]",
  wineBorder: "border-[#6D1520]",
  gold: "text-[#D4AF37]",
  goldSoft: "text-[#CBB084]",
  countdownOuter: "bg-[#2D1418] border-[#4D2429]",
  countdownLabel: "text-[#FCFAF2]/80",
  countdownCell: "bg-[#FCFAF2] border-[#CBB084]/40",
  countdownNum: "text-[#1C0F11]",
  countdownUnit: "text-[#6D1520]",
  venueCard: "border-[#CBB084]/35 bg-[#FCFAF2]/95",
  timelineTitle: "text-[#F5E6D3]",
  timelineSub: "text-[#CBB084]",
  timelineLine: "before:bg-[#D4AF37]/50",
  timelineNode: "bg-[#FCFAF2] border-[#D4AF37]",
  timelineNodeDot: "bg-[#6D1520]",
  timelineItem: "bg-[#FCFAF2] border-[#CBB084]/40 hover:border-[#D4AF37]/60",
  nav: "bg-[#210D0F] border-[#3D1A1E]",
  navActive: "text-[#D4AF37]",
  navInactive: "text-[#CBB084]/65 hover:text-[#FCFAF2]",
  navIconActive: "bg-[#FCFAF2]/10 ring-[#D4AF37]/35",
  input: "border-[#CBB084]/40 bg-[#1A0A0C]/5 text-[#1C0F11] focus:border-[#D4AF37] focus:ring-[#D4AF37]",
  submitBtn: "bg-[#6D1520] hover:bg-[#4D0A11] text-white"
};

export const invitationThemes: Record<TemplatePresetKey, InvitationThemeClasses> = {
  royal,
  garden,
  night,
  minimal,
  sunset,
  classic,
  cinematic
};

export function getInvitationTheme(id?: string): InvitationThemeClasses {
  const key = (id ?? "royal") as TemplatePresetKey;
  return invitationThemes[key] ?? royal;
}
