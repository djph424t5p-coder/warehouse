/*
  Премиум-заглушки вместо фотографий: тёмные тёплые градиенты +
  графика тонкими линиями. TODO: заменить на реальные изображения
  (next/image + /public/assets/...), сетка компонентов не изменится.
*/

type PlaceholderImageProps = {
  variant?: "facade" | "interior" | "court";
  className?: string;
};

const BACKDROPS: Record<string, string> = {
  facade:
    "linear-gradient(165deg, #2c2820 0%, #181510 55%, #0f0e0b 100%)",
  interior:
    "radial-gradient(120% 90% at 70% 20%, #3a332a 0%, #1c1813 45%, #0e0d0b 100%)",
  court:
    "radial-gradient(110% 100% at 30% 80%, #232a22 0%, #161811 50%, #0e0d0b 100%)",
};

export default function PlaceholderImage({
  variant = "facade",
  className = "",
}: PlaceholderImageProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative h-full w-full ${className}`}
      style={{ background: BACKDROPS[variant] }}
    >
      {variant === "facade" && (
        <svg
          viewBox="0 0 300 400"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
        >
          <g stroke="#b8975c" strokeOpacity="0.28" strokeWidth="1" fill="none">
            {Array.from({ length: 7 }, (_, i) => (
              <line key={`v${i}`} x1={30 + i * 40} y1="0" x2={30 + i * 40} y2="400" />
            ))}
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={40 + i * 40} x2="300" y2={40 + i * 40} />
            ))}
          </g>
          <rect x="110" y="120" width="80" height="120" fill="#ffc98a" opacity="0.12" />
        </svg>
      )}
    </div>
  );
}
