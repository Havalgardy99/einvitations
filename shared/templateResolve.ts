import type { InvitationTemplate } from "./invitation.js";
import type {
  CustomTemplateCategory,
  TemplateLayoutType,
  TemplateThemeColors
} from "./templateCategories.js";
import { DEFAULT_THEME_COLORS } from "./templateCategories.js";
import { getTemplatePreset, type TemplatePresetKey } from "./templates.js";

export interface ResolvedTemplateMeta {
  layoutType: TemplateLayoutType;
  presetKey?: TemplatePresetKey;
  theme?: TemplateThemeColors;
  introVideoUrl?: string;
  categoryName?: string;
}

const PRESET_KEYS = new Set([
  "royal",
  "garden",
  "night",
  "minimal",
  "sunset",
  "classic",
  "cinematic"
]);

export function isBuiltinTemplateKey(key: string): key is TemplatePresetKey {
  return PRESET_KEYS.has(key);
}

export function resolveTemplateMeta(
  inv: Pick<
    InvitationTemplate,
    "templateKey" | "introVideoUrl" | "themeOverrides"
  >,
  categories: CustomTemplateCategory[]
): ResolvedTemplateMeta {
  const key = inv.templateKey ?? "royal";
  const custom = categories.find((c) => c.key === key && c.isActive);

  if (custom) {
    return {
      layoutType: custom.layoutType,
      theme: { ...custom.theme, ...(inv.themeOverrides ?? {}) },
      introVideoUrl: inv.introVideoUrl?.trim() || custom.introVideoUrl,
      categoryName: custom.name
    };
  }

  if (isBuiltinTemplateKey(key)) {
    return {
      layoutType: key === "cinematic" ? "cinematic" : "luxury",
      presetKey: key,
      introVideoUrl: inv.introVideoUrl,
      categoryName: getTemplatePreset(key).name
    };
  }

  return {
    layoutType: "luxury",
    presetKey: "royal",
    introVideoUrl: inv.introVideoUrl,
    theme: { ...DEFAULT_THEME_COLORS, ...(inv.themeOverrides ?? {}) }
  };
}
