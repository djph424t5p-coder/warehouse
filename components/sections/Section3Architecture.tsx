import SectionHeading from "@/components/ui/SectionHeading";
import { ARCHITECTURE } from "@/lib/constants";

export default function Section3Architecture() {
  return (
    <section id="architecture" className="bg-ink section-pad">
      <div className="container-luxe">
        <div className="grid items-start gap-16 lg:grid-cols-[2fr_3fr]">
          <div>
            <SectionHeading
              kicker={ARCHITECTURE.kicker}
              title={ARCHITECTURE.title}
            />
            <p className="mt-10 max-w-130 text-stone">{ARCHITECTURE.body}</p>
          </div>

          {/* TODO(M7): интерактивная 3D-модель с drag-вращением и хотспотами */}
          <div className="relative aspect-square border border-line">
            <div className="absolute inset-0 grid place-items-center">
              <p className="kicker text-stone">3D-модель здания</p>
            </div>
          </div>
        </div>

        <ul className="mt-20 grid gap-px hairline-t sm:grid-cols-2 lg:grid-cols-4">
          {ARCHITECTURE.hotspots.map((spot, index) => (
            <li key={spot.id} className="py-8 sm:pr-10">
              <p className="kicker tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 font-display text-xl">{spot.title}</h3>
              <p className="mt-2 text-sm text-stone">{spot.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
