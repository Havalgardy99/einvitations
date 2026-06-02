import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { marketplaceFaqs } from "../../../shared/marketplaceContent";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="space-y-8 scroll-mt-24">
      <div className="market-divider mb-6" />
      <div className="text-center space-y-2">
        <h2 className="section-title">پرسیارە باوەکان</h2>
        <p className="section-subtitle max-w-lg mx-auto">
          وەڵامی پرسیارە ئاساییەکان دەربارەی خزمەتگوزاریەکەمان
        </p>
      </div>
      <div className="max-w-2xl mx-auto space-y-3">
        {marketplaceFaqs.map((faq, i) => {
          const open = openIndex === i;
          return (
            <article key={faq.question} className="market-card rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-right"
              >
                <span className="font-serif text-[#2D2A26] text-sm sm:text-base">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#C2556A] shrink-0 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-[#7A7268] leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
