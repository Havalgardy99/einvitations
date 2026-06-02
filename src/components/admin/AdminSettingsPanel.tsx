import { useEffect, useState } from "react";
import { ImageIcon, Save } from "lucide-react";
import { api } from "../../api/client";
import { mediaUrl } from "../../api/base";
import ImageUpload from "./ImageUpload";
import { useRefreshSiteSettings } from "../../context/SiteSettingsContext";
import type { SiteSettings } from "../../../shared/siteSettings";
import { DEFAULT_SITE_SETTINGS } from "../../../shared/siteSettings";

interface Props {
  onSaved?: (settings: SiteSettings) => void;
}

export default function AdminSettingsPanel({ onSaved }: Props) {
  const refreshSiteSettings = useRefreshSiteSettings();
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api
      .getAdminSettings()
      .then(setForm)
      .catch(() => setForm(DEFAULT_SITE_SETTINGS))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setDone(false);
    try {
      const saved = await api.updateSiteSettings(form);
      setForm(saved);
      setDone(true);
      onSaved?.(saved);
      await refreshSiteSettings();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="dash-card p-8 text-center text-[#6b7280]">بارکردن...</div>;
  }

  return (
    <div className="dash-card p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="font-serif text-xl text-[#1a1d1f]">ڕێکخستنی ماڵپەڕ</h2>
        <p className="text-sm text-[#6b7280] mt-1">لۆگۆ و ناوی سایت لە navbar و footer دەردەکەوێت</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5 max-w-lg">
        <div className="space-y-3">
          <label className="text-xs font-medium text-[#6b7280] block">لۆگۆ</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#e5e7eb] flex items-center justify-center overflow-hidden bg-[#f9fafb]">
              {form.logoUrl ? (
                <img
                  src={mediaUrl(form.logoUrl)}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-[#d1d5db]" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <ImageUpload
                label="وێنەی لۆگۆ باربکە"
                value={form.logoUrl ?? ""}
                onChange={(url) => setForm((p) => ({ ...p, logoUrl: url || null }))}
              />
              {form.logoUrl && (
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, logoUrl: null }))}
                  className="text-xs text-[#ef4444] hover:underline"
                >
                  لۆگۆ بسڕەوە (گەڕانەوە بۆ default)
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[#6b7280] block mb-1.5">ناوی ئینگلیزی</label>
            <input
              className="dash-input"
              value={form.nameEn}
              onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))}
              dir="ltr"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b7280] block mb-1.5">ناوی کوردی</label>
            <input
              className="dash-input"
              value={form.nameKu}
              onChange={(e) => setForm((p) => ({ ...p, nameKu: e.target.value }))}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-[#6b7280] block mb-1.5">Tagline (کوردی)</label>
          <input
            className="dash-input"
            value={form.tagline}
            onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-[#6b7280] block mb-1.5">Tagline (English)</label>
          <input
            className="dash-input"
            value={form.taglineEn}
            onChange={(e) => setForm((p) => ({ ...p, taglineEn: e.target.value }))}
            dir="ltr"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-dash-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? "پاشەکەوت..." : "پاشەکەوتکردن"}
        </button>

        {done && (
          <p className="text-sm text-[#22c55e] bg-[#f0fdf4] rounded-xl px-4 py-3">
            ڕێکخستنەکان پاشەکەوت کران. لۆگۆ و ناو لە ماڵپەڕەکەدا نوێکرانەوە.
          </p>
        )}
      </form>
    </div>
  );
}
