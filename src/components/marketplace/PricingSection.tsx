import { Check } from "lucide-react";
import { marketplacePricing } from "../../../shared/marketplaceContent";

interface Props {
  onSelectPlan: (planKey: string) => void;
}

export default function PricingSection({ onSelectPlan }: Props) {
  return (
    <section id="pricing" className="space-y-6 scroll-mt-24">
      <div className="gold-divider mb-6" />
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#D4AF37]">نرخەکان</h2>
        <p className="text-sm text-[#A39081] max-w-lg mx-auto">
          پلانی گونجاو بۆ هەموو جۆرە ئاهەنگێک هەڵبژێرە
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {marketplacePricing.map((plan) => (
          <article
            key={plan.key}
            className={`rounded-2xl p-6 flex flex-col space-y-5 ${
              plan.highlighted
                ? "glass-panel ring-2 ring-[#D4AF37]/40 scale-[1.02]"
                : "invite-card"
            }`}
          >
            {plan.highlighted && (
              <span className="self-center text-xs font-mono tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full">
                بەناوبانگترین
              </span>
            )}
            <div className="text-center space-y-1">
              <h3 className="font-serif text-2xl text-[#F3EFE9]">{plan.name}</h3>
              <p className="text-xs text-[#A39081]">{plan.description}</p>
            </div>
            <div className="text-center">
              <span className="font-serif text-4xl text-[#D4AF37]">{plan.price}</span>
              <span className="text-sm text-[#A39081] mr-1">{plan.period}</span>
            </div>
            <ul className="space-y-2.5 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#CBB084]">
                  <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onSelectPlan(plan.key)}
              className={`w-full py-3 rounded-xl text-sm font-medium ${
                plan.highlighted
                  ? "btn-wine text-white"
                  : "btn-gold-outline"
              }`}
            >
              {plan.cta}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
