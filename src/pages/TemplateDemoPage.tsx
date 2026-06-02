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
      <div className="admin-root min-h-screen flex items-center justify-center">
        <p className="text-[#CBB084] text-sm">کردنەوەی demo...</p>
      </div>
    );
  }
  if (error || !config) return <Navigate to="/" replace />;

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4 z-[100]">
        <Link
          to="/"
          className={
            layoutType === "cinematic"
              ? "inline-flex items-center px-4 py-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/25 text-white text-xs font-bold hover:bg-black/65 transition-colors"
              : "btn-gold-outline px-4 py-2 rounded-lg text-sm"
          }
        >
          گەڕانەوە بۆ تێمپلەیتەکان
        </Link>
      </div>
      <App config={config} slug={config.slug} />
    </div>
  );
}
