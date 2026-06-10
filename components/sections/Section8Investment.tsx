import Counter from "@/components/ui/Counter";
import PriceChart from "@/components/ui/PriceChart";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { INVESTMENT } from "@/lib/constants";

export default function Section8Investment() {
  return (
    <section id="investment" className="bg-bone text-ink section-pad">
      <div className="container-luxe">
        <div className="grid items-start gap-16 lg:grid-cols-[2fr_3fr]">
          <div>
            <SectionHeading
              kicker={INVESTMENT.kicker}
              title={INVESTMENT.title}
              className="[&_h2]:text-forest"
            />
            <Reveal as="p" mode="block" className="mt-10 max-w-130 text-stone">
              {INVESTMENT.body}
            </Reveal>
          </div>

          <div>
            <dl className="grid gap-10 sm:grid-cols-3">
              {INVESTMENT.counters.map((counter) => (
                <div key={counter.label}>
                  <dd className="display-2 tabular-nums text-forest">
                    <Counter
                      value={counter.value}
                      suffix={counter.suffix}
                      decimals={
                        "decimals" in counter ? counter.decimals : 0
                      }
                    />
                  </dd>
                  <dt className="mt-2 text-sm text-stone">{counter.label}</dt>
                </div>
              ))}
            </dl>

            <div className="mt-16 hairline-t pt-10">
              <p className="kicker">Динамика цены м², индекс</p>
              <div className="mt-6">
                <PriceChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
