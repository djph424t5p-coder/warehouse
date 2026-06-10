import Parallax from "@/components/ui/Parallax";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Reveal from "@/components/ui/Reveal";
import { CONCEPT } from "@/lib/constants";

export default function Section2Concept() {
  return (
    <section id="concept" className="bg-bone text-ink section-pad">
      <div className="container-luxe">
        <p className="kicker">{CONCEPT.kicker}</p>

        <Reveal as="h2" className="display-1 mt-10 text-forest">
          {CONCEPT.manifest.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </Reveal>

        <div className="mt-24 grid items-start gap-16 lg:grid-cols-[5fr_4fr]">
          <div className="space-y-12">
            {CONCEPT.body.map((paragraph, index) => (
              <Reveal
                as="p"
                mode="block"
                delay={index * 0.12}
                key={paragraph.slice(0, 24)}
                className="max-w-130 text-stone"
              >
                {paragraph}
              </Reveal>
            ))}

            <Reveal mode="block" delay={0.2}>
              <dl className="grid gap-10 hairline-t pt-10 sm:grid-cols-3">
                {CONCEPT.stats.map((stat) => (
                  <div key={stat.label}>
                    <dd className="display-2 tabular-nums text-forest">
                      {stat.value}
                    </dd>
                    <dt className="mt-2 text-sm text-stone">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* деталь фасада уезжает медленнее текста */}
          <Parallax className="aspect-[3/4]" amount={9}>
            <PlaceholderImage variant="facade" />
          </Parallax>
        </div>
      </div>
    </section>
  );
}
