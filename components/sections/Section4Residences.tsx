import ResidenceCard from "@/components/ui/ResidenceCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { RESIDENCES } from "@/lib/constants";

export default function Section4Residences() {
  return (
    <section id="residences" className="bg-ink section-pad">
      <div className="container-luxe">
        <SectionHeading kicker={RESIDENCES.kicker} title={RESIDENCES.title} />
      </div>

      {/* TODO(M6): pinned горизонтальный скролл (GSAP); пока — нативная лента */}
      <div className="mt-16 overflow-x-auto pb-4">
        <div className="container-luxe flex w-max gap-6">
          {RESIDENCES.items.map((residence, index) => (
            <div key={residence.id} className="w-[min(82vw,420px)] shrink-0">
              <ResidenceCard residence={residence} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
