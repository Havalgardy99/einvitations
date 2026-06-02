import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { marketplaceFaqs } from "../../../shared/marketplaceContent";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="space-y-6 scroll-mt-24">
      <div className="gold-divider mb-6" />
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#D4AF37]">پرسیارە باوەکان</h2>
        <p className="text-sm text-[#A39081] max-w-lg mx-auto">
          وەڵامی پرسیارە ئاساییەکان دەربارەی خزمەتگوزاریەکەمان
        </p>
      </div>
      <div className="max-w-2xl mx-auto space-y-3">
        {marketplaceFaqs.map((faq, i) => {
          const open = openIndex === i;
          return (
            <article key={faq.question} className="invite-card rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-right"
              >
                <span className="font-serif text-[#F3EFE9] text-sm sm:text-base">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#D4AF37] shrink-0 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-[#A39081] leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
