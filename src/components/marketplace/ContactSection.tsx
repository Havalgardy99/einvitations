import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import { marketplaceContact } from "../../../shared/marketplaceContent";
import type { PublicTemplateCard } from "../../api/client";

interface Props {
  templates: PublicTemplateCard[];
  selectedTemplate: string | null;
  selectedPlan: string | null;
  customerName: string;
  phone: string;
  notes: string;
  loading: boolean;
  done: boolean;
  onTemplateChange: (key: string) => void;
  onCustomerNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onNotesChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const planLabels: Record<string, string> = {
  basic: "بنەڕەتی",
  premium: "پریمیۆم",
  vip: "VIP"
};

export default function ContactSection({
  templates,
  selectedTemplate,
  selectedPlan,
  customerName,
  phone,
  notes,
  loading,
  done,
  onTemplateChange,
  onCustomerNameChange,
  onPhoneChange,
  onNotesChange,
  onSubmit
}: Props) {
  const selected = templates.find((t) => t.key === selectedTemplate);

  return (
    <section id="contact" className="space-y-8 scroll-mt-24">
      <div className="market-divider mb-6" />
      <div className="text-center space-y-2">
        <h2 className="section-title">ئۆردەر و پەیوەندی</h2>
        <p className="section-subtitle max-w-lg mx-auto">
          فۆڕمەکە پڕبکەرەوە یان ڕاستەوخۆ پەیوەندیمان پێوە بکە
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="market-panel p-6 space-y-4">
            <h3 className="font-serif text-xl text-[#2D2A26]">زانیاری پەیوەندی</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${marketplaceContact.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-sm text-[#7A7268] hover:text-[#C2556A] transition-colors"
                  dir="ltr"
                >
                  <Phone className="w-4 h-4 text-[#C2556A]" />
                  {marketplaceContact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${marketplaceContact.email}`}
                  className="flex items-center gap-3 text-sm text-[#7A7268] hover:text-[#C2556A] transition-colors"
                  dir="ltr"
                >
                  <Mail className="w-4 h-4 text-[#C2556A]" />
                  {marketplaceContact.email}
                </a>
              </li>
              <li>
                <a
                  href={marketplaceContact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-[#7A7268] hover:text-[#C2556A] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#C2556A]" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
          <div className="market-stat space-y-2">
            <p className="text-xs text-[#7A7268]">کاتی وەڵامدانەوە</p>
            <p className="font-serif text-lg text-[#2D2A26]">٢٤/٧ — لە ماوەی ٢ کاتژمێردا</p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="lg:col-span-3 market-panel p-6 sm:p-8 space-y-4"
        >
          {selected && (
            <div className="bg-[#F5E6E8]/60 border border-[#F0EBE6] rounded-xl p-4 text-sm">
              <span className="text-[#7A7268]">تێمپلەیت: </span>
              <span className="text-[#2D2A26] font-serif">{selected.name}</span>
            </div>
          )}
          {selectedPlan && (
            <div className="bg-[#F5E6E8]/60 border border-[#F0EBE6] rounded-xl p-4 text-sm">
              <span className="text-[#7A7268]">پلان: </span>
              <span className="text-[#2D2A26] font-serif">
                {planLabels[selectedPlan] ?? selectedPlan}
              </span>
            </div>
          )}

          <div>
            <label htmlFor="template-select" className="block text-xs text-[#7A7268] mb-1.5">
              تێمپلەیت
            </label>
            <select
              id="template-select"
              className="market-input"
              value={selectedTemplate ?? ""}
              onChange={(e) => onTemplateChange(e.target.value)}
              required
            >
              <option value="" disabled>
                تێمپلەیت هەڵبژێرە
              </option>
              {templates.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customer-name" className="block text-xs text-[#7A7268] mb-1.5">
                ناوی تەواو
              </label>
              <input
                id="customer-name"
                className="market-input"
                placeholder="ناوی تەواو"
                value={customerName}
                onChange={(e) => onCustomerNameChange(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs text-[#7A7268] mb-1.5">
                ژمارەی مۆبایل
              </label>
              <input
                id="phone"
                className="market-input"
                placeholder="07xx xxx xxxx"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                required
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-xs text-[#7A7268] mb-1.5">
              تێبینی (ئارەزوومەندانە)
            </label>
            <textarea
              id="notes"
              className="market-input min-h-[90px]"
              placeholder="پلان، ڕۆژی ئاهەنگ، یان هەر تێبینییەک..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedTemplate}
            className="btn-primary w-full rounded-full px-5 py-3.5 font-bold disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              "چاوەڕێبە..."
            ) : (
              <>
                <Send className="w-4 h-4" />
                ناردنی ئۆردەر
              </>
            )}
          </button>

          {done && (
            <p className="text-emerald-600 text-sm text-center bg-emerald-50 rounded-xl py-3">
              ئۆردەرەکەت بە سەرکەوتوویی نێردرا. لە زوترین کاتدا پەیوەندیت پێوە دەکرێت.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
