import { Check } from "lucide-react";
import { marketplacePricing } from "../../../shared/marketplaceContent";

interface Props {
  onSelectPlan: (planKey: string) => void;
}

export default function PricingSection({ onSelectPlan }: Props) {
  return (
    <section id="pricing" className="space-y-8 scroll-mt-24">
      <div className="market-divider mb-6" />
      <div className="text-center space-y-2">
        <h2 className="section-title">نرخەکان</h2>
        <p className="section-subtitle max-w-lg mx-auto">
          پلانی گونجاو بۆ هەموو جۆرە ئاهەنگێک هەڵبژێرە
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {marketplacePricing.map((plan) => (
          <article
            key={plan.key}
            className={`rounded-2xl p-6 flex flex-col space-y-5 ${
              plan.highlighted
                ? "market-panel pricing-highlight scale-[1.02]"
                : "market-card"
            }`}
          >
            {plan.highlighted && (
              <span className="badge-popular self-center">بەناوبانگترین</span>
            )}
            <div className="text-center space-y-1">
              <h3 className="font-serif text-2xl text-[#2D2A26]">{plan.name}</h3>
              <p className="text-xs text-[#7A7268]">{plan.description}</p>
            </div>
            <div className="text-center">
              <span className="font-serif text-4xl text-[#C2556A]">{plan.price}</span>
              <span className="text-sm text-[#7A7268] mr-1">{plan.period}</span>
            </div>
            <ul className="space-y-2.5 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#7A7268]">
                  <Check className="w-4 h-4 text-[#C2556A] shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onSelectPlan(plan.key)}
              className={`w-full py-3 rounded-full text-sm font-medium ${
                plan.highlighted ? "btn-primary" : "btn-outline"
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
