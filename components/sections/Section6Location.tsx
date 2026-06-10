import LocationMap from "@/components/ui/LocationMap";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { LOCATION } from "@/lib/constants";

export default function Section6Location() {
  return (
    <section id="location" className="bg-forest section-pad">
      <div className="container-luxe">
        <div className="grid items-start gap-16 lg:grid-cols-[2fr_3fr]">
          <div>
            <SectionHeading kicker={LOCATION.kicker} title={LOCATION.title} />
            <Reveal as="p" mode="block" className="mt-10 max-w-130 text-stone">
              {LOCATION.body}
            </Reveal>

            <ul className="mt-14 hairline-t">
              {LOCATION.pois.map((poi, index) => (
                <Reveal
                  as="li"
                  mode="block"
                  delay={index * 0.07}
                  key={poi.id}
                  className="flex items-baseline justify-between gap-6 py-4 hairline-b"
                >
                  <span className="text-sm">{poi.label}</span>
                  <span className="kicker tabular-nums shrink-0">
                    {poi.minutes} мин
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden border border-line">
            <LocationMap />
          </div>
        </div>
      </div>
    </section>
  );
}
