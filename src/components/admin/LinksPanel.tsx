import React, { useState } from "react";
import { Link2, Copy, Check, ExternalLink, Heart, Mail, Users } from "lucide-react";
import type { InvitationLinks } from "../../../shared/invitation";
import { toAbsoluteUrl } from "../../lib/urls";

interface LinksPanelProps {
  links: InvitationLinks;
  id: string;
}

export default function LinksPanel({ links, id }: LinksPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (key: string, path: string) => {
    const url = toAbsoluteUrl(path);
    await navigator.clipboard.writeText(url);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const items = [
    {
      key: "main",
      icon: <Mail className="w-4 h-4" />,
      label: "بانگهێشتنامەی تەواو",
      desc: "مۆر، بەرنامە، هەموو بەشەکان",
      path: links.main
    },
    {
      key: "guest",
      icon: <Users className="w-4 h-4" />,
      label: "بەشداری + پیرۆزبایی",
      desc: "یەک لینک — RSVP و هەموو نامەکان لە یەک پەڕە",
      path: links.guest,
      highlight: true
    }
  ];

  return (
    <section className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 text-[#D4AF37]">
        <Link2 className="w-5 h-5" />
        <h2 className="font-serif text-lg">لینکەکان بۆ میوانان</h2>
      </div>
      <p className="text-xs text-[#A39081] leading-relaxed">
        لینکەکان بەپێی ئەو ئامێرەی کە داشبۆرد لەسەر کراوە درووست دەبن (وەک IP یان localhost)
      </p>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.key}
            className={`rounded-xl border p-4 space-y-2 ${
              item.highlight
                ? "border-[#D4AF37]/40 bg-[#6D1520]/15"
                : "border-[#D4AF37]/15 bg-[#0c0a09]/40"
            }`}
          >
            <div className="flex items-start gap-3 flex-row-reverse">
              <div className="w-9 h-9 rounded-lg bg-[#6D1520]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 text-right min-w-0">
                <p className="font-semibold text-sm text-[#F3EFE9] flex items-center gap-2 justify-end">
                  {item.label}
                  {item.highlight && (
                    <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
                  )}
                </p>
                <p className="text-[11px] text-[#A39081] mt-0.5">{item.desc}</p>
              </div>
            </div>
            <input
              readOnly
              dir="ltr"
              value={toAbsoluteUrl(item.path)}
              className="input-luxury font-mono text-[11px] text-[#D4AF37]/90"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => copy(item.key, item.path)}
                className="btn-gold-outline flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold"
              >
                {copied === item.key ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                کۆپی
              </button>
              <a
                href={toAbsoluteUrl(item.path)}
                target="_blank"
                rel="noreferrer"
                className="btn-gold-outline flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
