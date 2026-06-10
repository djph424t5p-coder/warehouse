import ArchViewer from "@/components/three/ArchViewer";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ARCHITECTURE } from "@/lib/constants";

export default function Section3Architecture() {
  return (
    <section id="architecture" className="bg-ink section-pad">
      <div className="container-luxe">
        <div className="grid items-start gap-16 lg:grid-cols-[2fr_3fr]">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              kicker={ARCHITECTURE.kicker}
              title={ARCHITECTURE.title}
            />
            <Reveal as="p" mode="block" className="mt-10 max-w-130 text-stone">
              {ARCHITECTURE.body}
            </Reveal>
            <p className="kicker mt-12 text-stone">
              Вращайте модель · наведите на маркеры
            </p>
          </div>

          {/* интерактивная башня: drag-вращение + хотспоты */}
          <div className="relative aspect-[4/5] border border-line sm:aspect-square">
            <ArchViewer />
            {/* hairline-разметка в духе чертежа */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-1/2 h-px bg-line"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-8 left-1/2 w-px bg-line"
            />
          </div>
        </div>

        <ul className="mt-20 grid gap-px hairline-t sm:grid-cols-2 lg:grid-cols-4">
          {ARCHITECTURE.hotspots.map((spot, index) => (
            <Reveal
              as="li"
              mode="block"
              delay={index * 0.09}
              key={spot.id}
              className="py-8 sm:pr-10"
            >
              <p className="kicker tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 font-display text-xl">{spot.title}</h3>
              <p className="mt-2 text-sm text-stone">{spot.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
