import {
  LayoutGrid,
  Layers3,
  LogOut,
  Menu,
  Plus,
  Settings,
  ShoppingBag,
  X
} from "lucide-react";
import { useState } from "react";
import BrandLogo from "../marketplace/BrandLogo";
import { mediaUrl } from "../../api/base";
import type { SiteSettings } from "../../../shared/siteSettings";

export type AdminTab =
  | "overview"
  | "create"
  | "categories"
  | "accounts"
  | "orders"
  | "settings";

interface SidebarProps {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
  onLogout: () => void;
  onCreate: () => void;
  stats: { accounts: number; rsvps: number; wishes: number; newOrders: number };
  siteSettings?: SiteSettings;
}

const allTabs: { id: AdminTab; label: string; icon?: typeof LayoutGrid }[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "create", label: "نوێ", icon: Plus },
  { id: "categories", label: "کەتەگۆری", icon: Layers3 },
  { id: "accounts", label: "ئەکاونت", icon: Settings },
  { id: "orders", label: "ئۆردەر", icon: ShoppingBag },
  { id: "settings", label: "ڕێکخستن", icon: Settings }
];

function SidebarBrand({ siteSettings }: { siteSettings?: SiteSettings }) {
  if (siteSettings?.logoUrl) {
    return (
      <div className="flex items-center gap-2.5">
        <img
          src={mediaUrl(siteSettings.logoUrl)}
          alt={siteSettings.nameEn}
          className="w-10 h-10 rounded-xl object-cover"
        />
        <div className="text-right leading-tight">
          <p className="font-semibold text-[#1a1d1f]">{siteSettings.nameEn}</p>
          <p className="text-[11px] text-[#22c55e]">{siteSettings.nameKu}</p>
        </div>
      </div>
    );
  }
  return <BrandLogo size="sm" />;
}

export function AdminMobileNav({ active, onChange, onLogout, onCreate, stats, siteSettings }: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden dash-card p-3 flex items-center justify-between gap-2 mb-4">
        <BrandLogo size="sm" showText={false} />
        <div className="flex-1 overflow-x-auto scrollbar-thin flex gap-1.5 px-1 min-w-0">
          {allTabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`shrink-0 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition ${
                active === id ? "bg-[#22c55e] text-white" : "bg-[#f4f6f8] text-[#6b7280]"
              }`}
            >
              {label}
              {id === "orders" && stats.newOrders > 0 && (
                <span className="mr-1 inline-flex w-4 h-4 items-center justify-center rounded-full bg-white/30 text-[9px]">
                  {stats.newOrders}
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-2 rounded-xl border border-[#eef1f4] text-[#6b7280] shrink-0"
          aria-label="مێنو"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="داخستن"
          />
          <aside className="absolute top-0 bottom-0 right-0 w-[min(280px,85vw)] dash-sidebar flex flex-col h-full shadow-2xl p-4">
            <div className="flex justify-between items-center pb-4 border-b border-[#eef1f4]">
              <SidebarBrand siteSettings={siteSettings} />
              <button type="button" onClick={() => setOpen(false)} className="p-2 text-[#6b7280]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 pt-4 space-y-1 overflow-y-auto">
              {allTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    onChange(id);
                    setOpen(false);
                  }}
                  className={`dash-nav-item w-full ${active === id ? "dash-nav-active" : ""}`}
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0" />}
                  <span>{label}</span>
                </button>
              ))}
            </nav>
            <div className="pt-4 space-y-2 border-t border-[#eef1f4]">
              <button type="button" onClick={onCreate} className="dash-fab w-full flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </button>
              <button type="button" onClick={onLogout} className="dash-nav-item w-full text-[#ef4444]">
                <LogOut className="w-4 h-4" />
                <span>دەرچوون</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export function AdminDesktopSidebar({
  active,
  onChange,
  onLogout,
  onCreate,
  stats,
  siteSettings
}: SidebarProps) {
  const mainNav = allTabs.slice(0, 4);
  const accountNav = allTabs.slice(4);

  return (
    <aside className="dash-sidebar flex flex-col h-full">
      <div className="pb-5 border-b border-[#eef1f4]">
        <SidebarBrand siteSettings={siteSettings} />
      </div>
      <nav className="flex-1 pt-4 space-y-1 overflow-y-auto">
        {mainNav.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`dash-nav-item w-full ${active === id ? "dash-nav-active" : ""}`}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            <span>{label}</span>
          </button>
        ))}
        <p className="text-[10px] uppercase tracking-widest text-[#9ca3af] px-3 pt-5 pb-2">Accounts</p>
        {accountNav.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`dash-nav-item w-full text-sm ${active === id ? "dash-nav-active" : ""}`}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0 opacity-60" />}
            <span className="flex-1 text-right">{label}</span>
            {id === "accounts" && (
              <span className="text-xs text-[#22c55e] font-medium">{stats.accounts}</span>
            )}
            {id === "orders" && stats.newOrders > 0 && (
              <span className="text-xs bg-[#22c55e] text-white px-1.5 py-0.5 rounded-full">
                {stats.newOrders}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="pt-4 space-y-2 border-t border-[#eef1f4]">
        <button type="button" onClick={onCreate} className="dash-fab w-full flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </button>
        <button type="button" onClick={onLogout} className="dash-nav-item w-full text-[#ef4444]">
          <LogOut className="w-4 h-4" />
          <span>دەرچوون</span>
        </button>
      </div>
    </aside>
  );
}

export default function AdminSidebar(props: SidebarProps) {
  return (
    <>
      <AdminMobileNav {...props} />
      <div className="hidden lg:block">
        <AdminDesktopSidebar {...props} />
      </div>
    </>
  );
}
