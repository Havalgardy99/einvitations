import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { PublicTemplateCard } from "../api/client";
import ContactSection from "../components/marketplace/ContactSection";
import FaqSection from "../components/marketplace/FaqSection";
import FeaturesSection from "../components/marketplace/FeaturesSection";
import HeroSection from "../components/marketplace/HeroSection";
import HowItWorksSection from "../components/marketplace/HowItWorksSection";
import MarketplaceFooter from "../components/marketplace/MarketplaceFooter";
import MarketplaceNavbar from "../components/marketplace/MarketplaceNavbar";
import PricingSection from "../components/marketplace/PricingSection";
import StatsSection from "../components/marketplace/StatsSection";
import TemplatesSection from "../components/marketplace/TemplatesSection";
import TestimonialsSection from "../components/marketplace/TestimonialsSection";

export default function HomePage() {
  const [templates, setTemplates] = useState<PublicTemplateCard[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.listTemplateCards().then(setTemplates).catch(() => setTemplates([]));
  }, []);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOrder = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    setDone(false);
    scrollToContact();
  };

  const handleSelectPlan = (planKey: string) => {
    setSelectedPlan(planKey);
    if (planKey !== "vip" && !selectedTemplate && templates.length > 0) {
      setSelectedTemplate(templates[0].key);
    }
    const planNote = `پلان: ${planKey}`;
    setNotes((prev) => (prev.includes("پلان:") ? prev : prev ? `${prev}\n${planNote}` : planNote));
    setDone(false);
    scrollToContact();
  };

  const onSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !customerName.trim() || !phone.trim()) return;
    setLoading(true);
    try {
      const planInfo = selectedPlan ? ` [پلان: ${selectedPlan}]` : "";
      await api.createOrder({
        templateKey: selectedTemplate,
        customerName: customerName.trim(),
        phone: phone.trim(),
        notes: (notes.trim() + planInfo).trim() || undefined
      });
      setDone(true);
      setCustomerName("");
      setPhone("");
      setNotes("");
      setSelectedPlan(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="admin-root min-h-screen">
      <div className="admin-noise" aria-hidden />
      <MarketplaceNavbar />
      <main className="relative z-10 max-w-6xl mx-auto px-4 pt-24 pb-8 sm:pt-28 sm:pb-12 space-y-16 sm:space-y-20">
        <HeroSection />
        <StatsSection />
        <TemplatesSection templates={templates} onOrder={handleOrder} />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection onSelectPlan={handleSelectPlan} />
        <FaqSection />
        <ContactSection
          templates={templates}
          selectedTemplate={selectedTemplate}
          selectedPlan={selectedPlan}
          customerName={customerName}
          phone={phone}
          notes={notes}
          loading={loading}
          done={done}
          onTemplateChange={(key) => {
            setSelectedTemplate(key);
            setDone(false);
          }}
          onCustomerNameChange={setCustomerName}
          onPhoneChange={setPhone}
          onNotesChange={setNotes}
          onSubmit={onSubmitOrder}
        />
      </main>
      <MarketplaceFooter />
    </div>
  );
}
