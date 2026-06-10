import SectionHeading from "@/components/ui/SectionHeading";
import { LOCATION } from "@/lib/constants";

export default function Section6Location() {
  return (
    <section id="location" className="bg-forest section-pad">
      <div className="container-luxe">
        <div className="grid items-start gap-16 lg:grid-cols-[2fr_3fr]">
          <div>
            <SectionHeading kicker={LOCATION.kicker} title={LOCATION.title} />
            <p className="mt-10 max-w-130 text-stone">{LOCATION.body}</p>

            <ul className="mt-14 hairline-t">
              {LOCATION.pois.map((poi) => (
                <li
                  key={poi.id}
                  className="flex items-baseline justify-between gap-6 py-4 hairline-b"
                >
                  <span className="text-sm">{poi.label}</span>
                  <span className="kicker tabular-nums shrink-0">
                    {poi.minutes} мин
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* TODO(M9): стилизованная SVG-карта с анимированными POI и линиями */}
          <div className="relative aspect-[4/3] border border-line">
            <div className="absolute inset-0 grid place-items-center">
              <p className="kicker text-stone">Карта квартала</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
