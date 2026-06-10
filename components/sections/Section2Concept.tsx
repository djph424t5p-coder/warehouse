import { CONCEPT } from "@/lib/constants";

export default function Section2Concept() {
  return (
    <section id="concept" className="bg-bone text-ink section-pad">
      <div className="container-luxe">
        <p className="kicker">{CONCEPT.kicker}</p>

        <h2 className="display-1 mt-10 text-forest">
          {CONCEPT.manifest.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <div className="mt-20 grid gap-12 md:grid-cols-2">
          {CONCEPT.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-stone">
              {paragraph}
            </p>
          ))}
        </div>

        <dl className="mt-24 grid gap-10 hairline-t pt-10 sm:grid-cols-3">
          {CONCEPT.stats.map((stat) => (
            <div key={stat.label}>
              <dd className="display-2 tabular-nums text-forest">
                {stat.value}
              </dd>
              <dt className="mt-2 text-sm text-stone">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
