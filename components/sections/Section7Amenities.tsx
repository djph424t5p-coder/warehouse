import LineIcon from "@/components/ui/LineIcon";
import SectionHeading from "@/components/ui/SectionHeading";
import { AMENITIES } from "@/lib/constants";

export default function Section7Amenities() {
  return (
    <section id="amenities" className="bg-ink section-pad">
      <div className="container-luxe">
        <SectionHeading kicker={AMENITIES.kicker} title={AMENITIES.title} />

        {/* TODO(M10): stagger-reveal карточек, hover-раскрытие описания */}
        <ul className="mt-16 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.items.map((item) => (
            <li
              key={item.id}
              className="group bg-ink p-10 transition-colors duration-500 hover:bg-forest/60"
            >
              <LineIcon
                name={item.icon}
                className="h-8 w-8 text-brass transition-transform duration-500 group-hover:-translate-y-1"
              />
              <h3 className="mt-8 font-display text-xl">{item.title}</h3>
              <p className="mt-3 text-sm text-stone">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
