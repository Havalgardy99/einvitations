export interface SiteSettings {
  logoUrl: string | null;
  nameEn: string;
  nameKu: string;
  tagline: string;
  taglineEn: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoUrl: null,
  nameEn: "Hawre",
  nameKu: "هاورێ",
  tagline: "بانگهێشتنامەی دیجیتاڵی هاوسەرگیری",
  taglineEn: "Digital Wedding Invitations"
};
