import PlanSketch from "@/components/ui/PlanSketch";
import type { RESIDENCES } from "@/lib/constants";

type Residence = (typeof RESIDENCES.items)[number];

type ResidenceCardProps = {
  residence: Residence;
  index: number;
};

export default function ResidenceCard({
  residence,
  index,
}: ResidenceCardProps) {
  return (
    <article className="group flex h-full flex-col border border-line bg-ink p-8 transition-colors duration-500 hover:border-brass/50">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl">{residence.name}</h3>
        <p className="kicker tabular-nums">{residence.floor}</p>
      </div>

      <div className="my-8 text-brass/40 transition-colors duration-500 group-hover:text-brass">
        <PlanSketch variant={index} className="w-full" />
      </div>

      <dl className="mt-auto grid grid-cols-3 gap-4 hairline-t pt-6">
        <div>
          <dd className="font-display text-3xl tabular-nums">
            {residence.area}
          </dd>
          <dt className="mt-1 text-xs text-stone">м²</dt>
        </div>
        <div>
          <dd className="font-display text-3xl tabular-nums">
            {residence.bedrooms}
          </dd>
          <dt className="mt-1 text-xs text-stone">спальни</dt>
        </div>
        <div>
          <dd className="font-display text-3xl tabular-nums">
            {residence.ceiling}
          </dd>
          <dt className="mt-1 text-xs text-stone">потолки</dt>
        </div>
      </dl>

      <p className="mt-6 text-sm text-stone">{residence.view}</p>
    </article>
  );
}
