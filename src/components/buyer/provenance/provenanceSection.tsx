import { provenanceItems } from "./index";
import { ProvenanceCard } from "./provenanceCard";

export default function ProvenanceSection() {
  return (
    <section className="border-t border-[#29251d] px-6 py-16 md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-xl">
          <p className="font-mono tracking-[0.2em] text-[#746d61] uppercase">
            Why provenance matters
          </p>

          <h2 className="mt-3 font-serif text-2xl leading-[1.15] font-semibold text-[#eee5d7] md:text-3xl">
            Buyers build a record every time they pay.
          </h2>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {provenanceItems.map((item) => (
            <ProvenanceCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
