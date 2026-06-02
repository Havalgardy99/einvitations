import React from "react";

export function DashField({
  label,
  value,
  onChange,
  dir,
  type = "text",
  autoComplete
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  dir?: "ltr" | "rtl";
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[#6b7280] block text-right">{label}</label>
      <input
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        className="dash-input"
      />
    </div>
  );
}

export function DashBadge({
  children,
  variant = "default"
}: {
  children: React.ReactNode;
  variant?: "default" | "danger";
}) {
  return (
    <span
      className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
        variant === "danger"
          ? "border-rose-200 text-rose-600 bg-rose-50"
          : "border-[#bbf7d0] text-[#16a34a] bg-[#f0fdf4]"
      }`}
    >
      {children}
    </span>
  );
}

export function ColorField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1 block">
      <span className="text-xs text-[#6b7280]">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 rounded border border-[#e5e7eb] bg-white"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="dash-input text-xs"
          dir="ltr"
        />
      </div>
    </label>
  );
}
