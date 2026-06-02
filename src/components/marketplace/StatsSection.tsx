import { marketplaceStats } from "../../../shared/marketplaceContent";

export default function StatsSection() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {marketplaceStats.map((stat) => (
        <div key={stat.label} className="stat-card text-center">
          <p className="font-serif text-3xl sm:text-4xl text-[#D4AF37]">{stat.value}</p>
          <p className="text-xs sm:text-sm text-[#A39081] mt-1">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}
