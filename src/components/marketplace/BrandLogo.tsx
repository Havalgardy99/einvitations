import { mediaUrl } from "../../api/base";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { brand } from "../../../shared/brand";

interface Props {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { img: 32, title: "text-base", subtitle: "text-[10px]" },
  md: { img: 40, title: "text-lg", subtitle: "text-xs" },
  lg: { img: 56, title: "text-2xl", subtitle: "text-sm" }
};

function DefaultLogoSvg({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden className="shrink-0">
      <rect width="48" height="48" rx="14" fill="url(#logo-bg)" />
      <path
        d="M24 12C18 12 14 16.5 14 21.5C14 28 24 36 24 36C24 36 34 28 34 21.5C34 16.5 30 12 24 12Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M24 16C20.5 16 18 18.8 18 22C18 26 24 31 24 31C24 31 30 26 30 22C30 18.8 27.5 16 24 16Z"
        fill="url(#logo-heart)"
      />
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="48" y2="48">
          <stop stopColor="#E8A0A8" />
          <stop offset="1" stopColor="#C2556A" />
        </linearGradient>
        <linearGradient id="logo-heart" x1="18" y1="16" x2="30" y2="31">
          <stop stopColor="#F5C6CB" />
          <stop offset="1" stopColor="#D4868C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function BrandLogo({ size = "md", showText = true, className = "" }: Props) {
  const settings = useSiteSettings();
  const s = sizes[size];
  const nameEn = settings.nameEn || brand.nameEn;
  const nameKu = settings.nameKu || brand.nameKu;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {settings.logoUrl ? (
        <img
          src={mediaUrl(settings.logoUrl)}
          alt={nameEn}
          className="shrink-0 rounded-xl object-cover"
          style={{ width: s.img, height: s.img }}
        />
      ) : (
        <DefaultLogoSvg size={s.img} />
      )}
      {showText && (
        <div className="text-right leading-tight">
          <p className={`font-serif ${s.title} text-[#2D2A26] tracking-wide`}>{nameEn}</p>
          <p className={`${s.subtitle} text-[#C2556A] font-medium`}>{nameKu}</p>
        </div>
      )}
    </div>
  );
}
