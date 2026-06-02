import type { InvitationTemplate } from "./invitation.js";

export type TemplatePresetKey =
  | "royal"
  | "garden"
  | "night"
  | "minimal"
  | "sunset"
  | "classic"
  | "cinematic";

/** Default intro video for cinematic template */
export const DEFAULT_CINEMATIC_VIDEO = "/video/intro.mp4";

export interface TemplatePreset {
  key: TemplatePresetKey;
  name: string;
  subtitle: string;
  description: string;
  previewImageUrl: string;
  defaults: Partial<InvitationTemplate>;
}

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    key: "royal",
    name: "Royal Gold",
    subtitle: "کلاسیکی شاهانە",
    description: "شێوازێکی فەرمی و گەورە بۆ ئاهەنگی فاخر.",
    previewImageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    defaults: {
      coverImageUrl:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
      inviteGreeting: "بە ڕێز و خۆشەویستییەوە",
      locationShort: "ئەربیل، کوردستان"
    }
  },
  {
    key: "garden",
    name: "Garden Bloom",
    subtitle: "نەرم و سروشتی",
    description: "ڕەنگی گڵەکان و هەستی بەهاری بۆ هاوسەرگیرییەکی خۆش.",
    previewImageUrl:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80",
    defaults: {
      coverImageUrl:
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80",
      inviteGreeting: "بە دڵی خۆش و بەهاری خۆشەویستی",
      locationShort: "سلێمانی، کوردستان"
    }
  },
  {
    key: "night",
    name: "Velvet Night",
    subtitle: "رۆمانسی شەوانە",
    description: "شێوازێکی مودێرن و گەشەی شەو بۆ ئەو کەسانەی سادەیی خۆش دەوێت.",
    previewImageUrl:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
    defaults: {
      coverImageUrl:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
      inviteGreeting: "بە خۆشەویستییەکی بێ کۆتایی",
      locationShort: "دهۆک، کوردستان"
    }
  },
  {
    key: "minimal",
    name: "Minimal Pearl",
    subtitle: "سادە و پاک",
    description: "دیزاینێکی مینیمال بۆ کەسانێک کە سادەیی و نەرمیان پێ خۆشە.",
    previewImageUrl:
      "https://images.unsplash.com/photo-1507502707541-f369a3b18502?w=1200&q=80",
    defaults: {
      coverImageUrl:
        "https://images.unsplash.com/photo-1507502707541-f369a3b18502?w=1200&q=80",
      inviteGreeting: "بە سادەیی و خۆشەویستی",
      locationShort: "هەولێر، کوردستان"
    }
  },
  {
    key: "sunset",
    name: "Sunset Rose",
    subtitle: "گەرمی ئاوابوون",
    description: "ڕەنگی گەرم و ڕۆمانسی بۆ ئاهەنگێکی پڕ لە هەست.",
    previewImageUrl:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1200&q=80",
    defaults: {
      coverImageUrl:
        "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1200&q=80",
      inviteGreeting: "بە گەرمیی دڵ و جوانیی ئێوارە",
      locationShort: "کەرکوک، کوردستان"
    }
  },
  {
    key: "classic",
    name: "Classic White",
    subtitle: "کلاسیکی سپی",
    description: "شێوازێکی هەمیشە مدرن و پاک بۆ هەموو جۆرە ئاهەنگێک.",
    previewImageUrl:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1200&q=80",
    defaults: {
      coverImageUrl:
        "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1200&q=80",
      inviteGreeting: "بە ڕێزی زۆرەوە",
      locationShort: "هەڵەبجە، کوردستان"
    }
  },
  {
    key: "cinematic",
    name: "Cinematic Video",
    subtitle: "ڤیدیۆی سینەمایی",
    description:
      "سەرەتا ڤیدیۆی فول سکرین، دواتر بانگهێشتنامەی تەواو بە ئەنیمەیشن و ناوەڕۆک.",
    previewImageUrl:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
    defaults: {
      coverImageUrl:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
      introVideoUrl: DEFAULT_CINEMATIC_VIDEO,
      inviteGreeting: "بە خۆشەویستی و دڵخۆشییەوە",
      locationShort: "کوردستان"
    }
  }
];

export function getTemplatePreset(key?: string): TemplatePreset {
  return (
    TEMPLATE_PRESETS.find((preset) => preset.key === key) ?? TEMPLATE_PRESETS[0]
  );
}
