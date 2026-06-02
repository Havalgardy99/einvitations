export interface TimelineItem {
  icon: string;
  time: string;
  title: string;
  desc: string;
}

export interface RSVP {
  id: string;
  name: string;
  isAttending: boolean;
  guestsCount: number;
  dietaryRestrictions: string;
  favoriteSong: string;
  timestamp: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  emoji: string;
  timestamp: string;
}

export type OrderStatus = "new" | "confirmed" | "done";

export interface TemplateOrder {
  id: string;
  templateKey: string;
  templateName: string;
  customerName: string;
  phone: string;
  notes: string;
  status: OrderStatus;
  createdAt: string;
}

/** Full template owned by each invitation account */
export interface InvitationLinks {
  main: string;
  guest: string;
}

import type {
  CustomTemplateCategory,
  TemplateThemeColors
} from "./templateCategories.js";

export type { CustomTemplateCategory, TemplateThemeColors };
export type { TemplateLayoutType } from "./templateCategories.js";

export interface InvitationTemplate {
  id: string;
  slug: string;
  templateKey?: string;
  /** Opening fullscreen video (cinematic template), e.g. /video/intro.mp4 */
  introVideoUrl?: string;
  /** Per-invitation color overrides (merged on top of category theme) */
  themeOverrides?: Partial<TemplateThemeColors>;
  /** Display name in dashboard, e.g. "Hawr" */
  accountName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  coupleName1: string;
  coupleName2: string;
  monogram: string;
  dateDisplay: string;
  timelineDateLabel: string;
  locationShort: string;

  coverImageUrl: string;
  inviteGreeting: string;
  inviteBody: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  scheduleDetails: string;
  mapUrl: string;
  mapAddressLine: string;

  /** ISO 8601 — used for countdown */
  countdownDate: string;
  timeline: TimelineItem[];
  rsvpDeadline: string;
}

export interface InvitationRecord extends InvitationTemplate {
  rsvps: RSVP[];
  guestbook: GuestbookEntry[];
}

export interface DatabaseSchema {
  adminTokenHash: string | null;
  invitations: InvitationRecord[];
  orders: TemplateOrder[];
  customTemplateCategories: CustomTemplateCategory[];
}

export function createDefaultTemplate(
  partial?: Partial<InvitationTemplate> & { accountName?: string }
): InvitationTemplate {
  const now = new Date().toISOString();
  const countdown = new Date();
  countdown.setMonth(8); // September
  countdown.setDate(12);
  countdown.setFullYear(2026);
  countdown.setHours(16, 30, 0, 0);
  if (countdown.getTime() < Date.now()) {
    countdown.setFullYear(countdown.getFullYear() + 1);
  }

  return {
    id: partial?.id ?? "",
    slug: partial?.slug ?? "",
    templateKey: partial?.templateKey,
    introVideoUrl: partial?.introVideoUrl,
    themeOverrides: partial?.themeOverrides,
    accountName: partial?.accountName ?? "بانگهێشتنامەی نوێ",
    isActive: partial?.isActive ?? true,
    createdAt: partial?.createdAt ?? now,
    updatedAt: partial?.updatedAt ?? now,

    coupleName1: partial?.coupleName1 ?? "دانیال",
    coupleName2: partial?.coupleName2 ?? "ئیلیرا",
    monogram: partial?.monogram ?? "D & E",
    dateDisplay: partial?.dateDisplay ?? "١٢ی ئەیلوولی ٢٠٢٦",
    timelineDateLabel:
      partial?.timelineDateLabel ?? "شەممە، ١٢ی ئەیلوولی ٢٠٢٦",
    locationShort: partial?.locationShort ?? "پریشتینا، کۆسۆڤۆ",

    coverImageUrl:
      partial?.coverImageUrl ??
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    inviteGreeting: partial?.inviteGreeting ?? "بە خۆشەویستی و دڵخۆشییەوە",
    inviteBody:
      partial?.inviteBody ??
      "بە کەیف و خۆشحاڵییەکی بێپایانەوە بانگهێشتی ئێوەی دۆست و ئازیزمان دەکەین بۆ دەستپێکی بەشە نوێیەکەی ژیانمان، کە هەمیشە ئاوێتەی خۆشەویستی، تەبایی و بەختەوەریی بێسنوورە. حزوورتان ڕووناکی بە ئاهەنگەکەمان دەبەخشێت.",
    eventTime: partial?.eventTime ?? "کات: ١٦:٣٠ی ئێوارە",
    venueName: partial?.venueName ?? "تەلاری مەلەکی، هۆڵی ڕۆیاڵ هیڵ، پریشتینا",
    venueAddress:
      partial?.venueAddress ?? "شەقامی پریشتینا-میترۆڤیچا، کیلۆمەتری ٧، کۆسۆڤۆ",
    scheduleDetails:
      partial?.scheduleDetails ??
      "کاتی پێشوازی لە میوانان: ١٦:٣٠ | خوانی شێو: ١٩:٠٠",
    mapUrl: partial?.mapUrl ?? "https://maps.google.com",
    mapAddressLine:
      partial?.mapAddressLine ??
      "شەقامی پریشتینا-میترۆڤیچا، کیلۆمەتری ٧، کۆسۆڤۆ",

    countdownDate: partial?.countdownDate ?? countdown.toISOString(),
    rsvpDeadline: partial?.rsvpDeadline ?? "تکایە پێش ١٥ی ئابی ٢٠٢٦ ئاگادارمان بکەنەوە",
    timeline: partial?.timeline ?? [
      {
        icon: "💍",
        time: "16:30",
        title: "ڕێوڕەسمی مارەبڕین فەرمی",
        desc: "بەستنی پەیمانی هاوسەرگیری هەمیشەیی و گۆڕینەوەی ئەڵقەکان لە باخچەی مەلەکی."
      },
      {
        icon: "🥂",
        time: "17:30",
        title: "پێشکەشکردنی کۆکتێل و گرتنی وێنە",
        desc: "خواردنەوەی بەشە کۆکتێلی بەخێرهاتن و وێنەگرتنی یادگاری لەگەڵ میوانان."
      },
      {
        icon: "🍽️",
        time: "19:00",
        title: "خوانی شێوی شاهانە",
        desc: "پێشکەشکردنی بەتامترین خواردنەکانی سەر مێز بۆ یادکردنەوەی ئاهەنگەکە."
      },
      {
        icon: "💃",
        time: "20:30",
        title: "سەمای یەکەم و دەستپێکی شایی",
        desc: "یەکەمین سەمای ڕۆمانسی هاوسەران و گەرمکردنی بەرگی تەلاری سەما."
      },
      {
        icon: "🎂",
        time: "23:00",
        title: "بڕینی کێکی هاوسەرگیری",
        desc: "دابەشکردنی کێکی گەورە و هاوبەشکردنی خۆشی کۆتایی شەو."
      }
    ]
  };
}

export function templateToPublic(record: InvitationRecord): InvitationTemplate {
  const { rsvps: _r, guestbook: _g, ...template } = record;
  return template;
}
