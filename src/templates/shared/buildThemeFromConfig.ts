import type { TemplateThemeColors } from "../../../shared/templateCategories";
import type { InvitationThemeClasses } from "./invitationThemes";

/** Build full Tailwind theme classes from hex colors (custom categories) */
export function buildThemeFromConfig(c: TemplateThemeColors): InvitationThemeClasses {
  const shell = c.shell;
  const accent = c.accent;
  const wine = c.wine;
  const card = c.cardBg;
  const onShell = c.textOnShell;
  const onCard = c.textOnCard;

  return {
    shell: `bg-[${shell}] text-[${onShell}]`,
    glow1: `bg-[${wine}]/20`,
    glow2: `bg-[${accent}]/10`,
    header: `bg-[${shell}]/95 border-[${wine}]/40`,
    headerLabel: `text-[${accent}]`,
    monogram: `text-[${onShell}]`,
    couple: `text-[${accent}]`,
    resetBtn: `text-[${accent}] border-[${accent}]/35 bg-white/5 hover:bg-white/10`,
    card: `border-[${accent}]/50 bg-[${card}]`,
    cardCorner: `border-[${accent}]`,
    cardInner: `border-[${accent}]/20`,
    cardTitle: `text-[${wine}]`,
    cardBody: `text-[${onCard}]`,
    cardAccent: `text-[${wine}]`,
    wine: `text-[${wine}]`,
    wineBg: `bg-[${wine}]`,
    wineBorder: `border-[${wine}]`,
    gold: `text-[${accent}]`,
    goldSoft: `text-[${accent}]`,
    countdownOuter: `bg-[${shell}] border-[${wine}]/40`,
    countdownLabel: `text-[${onShell}]/80`,
    countdownCell: `bg-[${card}] border-[${accent}]/40`,
    countdownNum: `text-[${onCard}]`,
    countdownUnit: `text-[${wine}]`,
    venueCard: `border-[${accent}]/35 bg-[${card}]/95`,
    timelineTitle: `text-[${onShell}]`,
    timelineSub: `text-[${accent}]`,
    timelineLine: `before:bg-[${accent}]/50`,
    timelineNode: `bg-[${card}] border-[${accent}]`,
    timelineNodeDot: `bg-[${wine}]`,
    timelineItem: `bg-[${card}] border-[${accent}]/40 hover:border-[${accent}]/60`,
    nav: `bg-[${shell}] border-[${wine}]/40`,
    navActive: `text-[${accent}]`,
    navInactive: `text-[${accent}]/65 hover:text-[${onShell}]`,
    navIconActive: `bg-[${card}]/10 ring-[${accent}]/35`,
    input: `border-[${accent}]/40 bg-[${shell}]/5 text-[${onCard}] focus:border-[${accent}] focus:ring-[${accent}]`,
    submitBtn: `bg-[${wine}] hover:opacity-90 text-white`
  };
}
