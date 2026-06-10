import LineIcon from "@/components/ui/LineIcon";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { AMENITIES } from "@/lib/constants";

export default function Section7Amenities() {
  return (
    <section id="amenities" className="bg-ink section-pad">
      <div className="container-luxe">
        <SectionHeading kicker={AMENITIES.kicker} title={AMENITIES.title} />

        <ul className="mt-16 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.items.map((item, index) => (
            <Reveal
              as="li"
              mode="block"
              delay={(index % 3) * 0.09}
              key={item.id}
              className="group bg-ink p-10 transition-colors duration-500 hover:bg-forest/60"
            >
              <LineIcon
                name={item.icon}
                className="h-8 w-8 text-brass transition-transform duration-500 group-hover:-translate-y-1"
              />
              <h3 className="mt-8 font-display text-xl">{item.title}</h3>
              {/* описание раскрывается на hover (desktop), всегда видно на touch */}
              <p className="mt-3 text-sm text-stone lg:mt-0 lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:transition-all lg:duration-500 lg:group-hover:mt-3 lg:group-hover:max-h-24 lg:group-hover:opacity-100">
                {item.text}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
