import SectionHeading from "@/components/ui/SectionHeading";
import { INTERIORS } from "@/lib/constants";

/*
  TODO: заменить градиентные плейсхолдеры на реальные фотографии интерьеров
  (/public/assets/interiors/*.jpg) — тёмные, тёплые, без водяных знаков.
*/
const PLACEHOLDER_BACKDROPS = [
  "radial-gradient(120% 90% at 70% 20%, #3a332a 0%, #1c1813 45%, #0e0d0b 100%)",
  "radial-gradient(110% 100% at 30% 80%, #2e2c24 0%, #181610 50%, #0e0d0b 100%)",
  "radial-gradient(130% 110% at 50% 0%, #33291c 0%, #1a1510 48%, #0e0d0b 100%)",
];

export default function Section5Interiors() {
  return (
    <section id="interiors" className="bg-ink section-pad">
      <div className="container-luxe">
        <SectionHeading kicker={INTERIORS.kicker} title={INTERIORS.title} />
      </div>

      {/* TODO(M8): полноэкранная галерея с clip-path reveal и ken-burns */}
      <div className="mt-16 flex flex-col gap-6">
        {INTERIORS.slides.map((slide, index) => (
          <figure
            key={slide.id}
            className="relative flex min-h-[70svh] items-end overflow-hidden"
            style={{ background: PLACEHOLDER_BACKDROPS[index % 3] }}
          >
            <figcaption className="container-luxe relative z-10 pb-14">
              <p className="kicker">{slide.title}</p>
              <p className="mt-3 max-w-100 text-sm text-stone">{slide.text}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
