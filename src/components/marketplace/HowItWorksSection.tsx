import { marketplaceSteps } from "../../../shared/marketplaceContent";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="space-y-8 scroll-mt-24">
      <div className="market-divider mb-6" />
      <div className="text-center space-y-2">
        <h2 className="section-title">چۆن کار دەکات</h2>
        <p className="section-subtitle max-w-lg mx-auto">
          لە ٤ هەنگاوێکی سادەدا بانگهێشتنامەی دیجیتاڵیت وەربگرە
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {marketplaceSteps.map((step, i) => (
          <article key={step.step} className="relative market-stat text-center space-y-3">
            {i < marketplaceSteps.length - 1 && (
              <div className="hidden lg:block absolute top-6 -left-3 w-6 h-px bg-[#F0EBE6]" aria-hidden />
            )}
            <div className="step-badge mx-auto">{step.step}</div>
            <h3 className="font-serif text-lg text-[#2D2A26]">{step.title}</h3>
            <p className="text-sm text-[#7A7268] leading-relaxed">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
