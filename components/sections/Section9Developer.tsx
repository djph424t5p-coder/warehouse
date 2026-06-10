import Counter from "@/components/ui/Counter";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { DEVELOPER } from "@/lib/constants";

export default function Section9Developer() {
  return (
    <section id="developer" className="bg-ink section-pad">
      <div className="container-luxe">
        <SectionHeading kicker={DEVELOPER.kicker} title={DEVELOPER.title} />
        <Reveal as="p" mode="block" className="mt-10 max-w-150 text-stone">
          {DEVELOPER.body}
        </Reveal>

        <dl className="mt-20 grid gap-10 hairline-t pt-10 sm:grid-cols-3">
          {DEVELOPER.stats.map((stat) => (
            <div key={stat.label}>
              <dd className="display-2 tabular-nums">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mt-2 text-sm text-stone">{stat.label}</dt>
            </div>
          ))}
        </dl>

        {/*
          Награды: приглушены, проявляются на hover.
          TODO: заменить текст на SVG-логотипы (grayscale -> цвет на hover).
        */}
        <ul className="mt-20 flex flex-wrap gap-x-14 gap-y-6 hairline-t pt-10">
          {DEVELOPER.awards.map((award, index) => (
            <Reveal
              as="li"
              mode="block"
              delay={index * 0.08}
              key={award}
              className="kicker text-stone transition-colors duration-500 hover:text-brass"
            >
              {award}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
