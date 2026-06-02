import { marketplaceSteps } from "../../../shared/marketplaceContent";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="space-y-6 scroll-mt-24">
      <div className="gold-divider mb-6" />
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#D4AF37]">چۆن کار دەکات</h2>
        <p className="text-sm text-[#A39081] max-w-lg mx-auto">
          لە ٤ هەنگاوێکی سادەدا بانگهێشتنامەی دیجیتاڵیت وەربگرە
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {marketplaceSteps.map((step) => (
          <article key={step.step} className="relative stat-card text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
              <span className="font-serif text-xl text-[#D4AF37]">{step.step}</span>
            </div>
            <h3 className="font-serif text-lg text-[#F3EFE9]">{step.title}</h3>
            <p className="text-sm text-[#A39081] leading-relaxed">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
