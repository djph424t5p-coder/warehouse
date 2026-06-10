/* Киношное зерно поверх всего сайта, ~3.5% opacity */

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='128' height='128' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden opacity-[0.035]"
    >
      <div
        className="absolute -inset-1/2"
        style={{
          backgroundImage: NOISE_SVG,
          animation: "grain-shift 0.9s steps(2) infinite",
        }}
      />
    </div>
  );
}
