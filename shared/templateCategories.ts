/** Layout engine for a template category */
export type TemplateLayoutType = "luxury" | "cinematic";

/** Editable color palette — applied to luxury/cinematic UI */
export interface TemplateThemeColors {
  shell: string;
  accent: string;
  wine: string;
  cardBg: string;
  textOnShell: string;
  textOnCard: string;
}

export const DEFAULT_THEME_COLORS: TemplateThemeColors = {
  shell: "#1A0A0C",
  accent: "#D4AF37",
  wine: "#6D1520",
  cardBg: "#FCFAF2",
  textOnShell: "#F5E6D3",
  textOnCard: "#2C181B"
};

export interface CustomTemplateCategory {
  id: string;
  /** Unique key used as templateKey on invitations (a-z0-9-) */
  key: string;
  name: string;
  subtitle: string;
  description: string;
  previewImageUrl: string;
  layoutType: TemplateLayoutType;
  introVideoUrl?: string;
  theme: TemplateThemeColors;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function defaultCategoryForm(): Omit<
  CustomTemplateCategory,
  "id" | "createdAt" | "updatedAt"
> {
  return {
    key: "",
    name: "",
    subtitle: "",
    description: "",
    previewImageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    layoutType: "luxury",
    introVideoUrl: "",
    theme: { ...DEFAULT_THEME_COLORS },
    isActive: true
  };
}
