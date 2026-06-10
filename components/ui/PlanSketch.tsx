type PlanSketchProps = {
  variant?: number;
  className?: string;
};

/*
  Абстрактный архитектурный план-эскиз (плейсхолдер).
  TODO: заменить на реальные SVG-планировки резиденций.
*/
export default function PlanSketch({
  variant = 0,
  className = "",
}: PlanSketchProps) {
  const mirrored = variant % 2 === 1;

  return (
    <svg
      viewBox="0 0 200 140"
      fill="none"
      aria-hidden="true"
      className={className}
      style={mirrored ? { transform: "scaleX(-1)" } : undefined}
    >
      <g stroke="currentColor" strokeWidth="1">
        {/* внешний контур */}
        <rect x="10" y="10" width="180" height="120" />
        {/* несущие стены */}
        <path d="M80 10 V70 M80 70 H10" />
        <path d="M140 130 V80 M140 80 H190" />
        {/* комнаты */}
        <path d="M80 40 H132" strokeDasharray="3 4" opacity="0.6" />
        <path d="M40 70 V130" strokeDasharray="3 4" opacity="0.6" />
        {/* проёмы окон */}
        <path d="M30 10 H58 M104 10 H136 M160 10 H182" strokeWidth="3" opacity="0.5" />
        <path d="M190 36 V64 M190 92 V118" strokeWidth="3" opacity="0.5" />
        {/* сантехнический блок */}
        <rect x="148" y="16" width="34" height="26" opacity="0.7" />
      </g>
    </svg>
  );
}
