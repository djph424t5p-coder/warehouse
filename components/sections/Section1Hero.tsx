import { PROJECT } from "@/lib/constants";

export default function Section1Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-svh flex-col justify-end overflow-hidden"
    >
      {/* TODO(M4): процедурная 3D-стройка (HeroCanvas) */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest/40 via-ink to-ink" />

      <div className="container-luxe relative z-10 pb-[10vh]">
        <p className="kicker">{PROJECT.kicker}</p>
        <h1 className="display-hero mt-6">{PROJECT.name}</h1>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-8 hairline-t pt-8">
          <p className="max-w-130 text-stone">{PROJECT.tagline}</p>
          <p className="kicker text-stone">Листайте вниз</p>
        </div>
      </div>
    </section>
  );
}
