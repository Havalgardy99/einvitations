import { marketplaceStats } from "../../../shared/marketplaceContent";

export default function StatsSection() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {marketplaceStats.map((stat) => (
        <div key={stat.label} className="market-stat text-center">
          <p className="font-serif text-3xl sm:text-4xl text-[#C2556A]">{stat.value}</p>
          <p className="text-xs sm:text-sm text-[#7A7268] mt-1">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}
