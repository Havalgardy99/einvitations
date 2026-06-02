import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import App from "../App";
import type { InvitationTemplate } from "../../shared/invitation";
import type { TemplateLayoutType } from "../../shared/templateCategories";
import { api } from "../api/client";

export default function TemplateDemoPage() {
  const { templateKey } = useParams<{ templateKey: string }>();
  const [config, setConfig] = useState<InvitationTemplate | null>(null);
  const [layoutType, setLayoutType] = useState<TemplateLayoutType>("luxury");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!templateKey) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    api
      .getTemplateDemo(templateKey)
      .then((data) => {
        setConfig(data.config);
        setLayoutType(data.layoutType);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [templateKey]);

  if (!templateKey) return <Navigate to="/" replace />;
  if (loading) {
    return (
      <div className="dashboard-root min-h-dvh flex items-center justify-center">
        <p className="text-[#6b7280] text-sm">کردنەوەی demo...</p>
      </div>
    );
  }
  if (error || !config) return <Navigate to="/" replace />;

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        className="absolute z-[100] left-4 right-4 sm:left-auto sm:right-4 flex justify-center sm:justify-end pointer-events-none"
        style={{ top: "max(1rem, env(safe-area-inset-top))" }}
      >
        <Link
          to="/"
          className={`pointer-events-auto inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold transition-colors ${
            layoutType === "cinematic"
              ? "bg-black/50 backdrop-blur-md border border-white/25 text-white hover:bg-black/65"
              : "bg-white/90 backdrop-blur-md border border-[#eef1f4] text-[#1a1d1f] hover:bg-white shadow-sm"
          }`}
        >
          گەڕانەوە بۆ تێمپلەیتەکان
        </Link>
      </div>
      <App config={config} slug={config.slug} />
    </div>
  );
}
