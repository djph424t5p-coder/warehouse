type LineIconProps = {
  name: string;
  className?: string;
};

/* Кастомные тонкие line-иконки (1.5px stroke), без emoji и сторонних паков */
const PATHS: Record<string, React.ReactNode> = {
  spa: (
    <>
      <path d="M6 26c0-7 4-13 10-16 6 3 10 9 10 16" />
      <path d="M4 26h24" />
      <path d="M16 10V4" />
    </>
  ),
  concierge: (
    <>
      <circle cx="16" cy="10" r="4" />
      <path d="M6 27c1.5-6 5-9 10-9s8.5 3 10 9" />
      <path d="M22 5l2-2M10 5 8 3" />
    </>
  ),
  wine: (
    <>
      <path d="M11 4h10l-1 9a4 4 0 0 1-8 0z" />
      <path d="M16 17v8M11 28h10" />
      <path d="M11.5 9h9" opacity="0.6" />
    </>
  ),
  cinema: (
    <>
      <rect x="4" y="8" width="24" height="16" />
      <path d="M4 13h24" opacity="0.6" />
      <path d="M13 17l6 3.5-6 3.5z" transform="translate(0 -3.5)" />
    </>
  ),
  garden: (
    <>
      <path d="M16 28V14" />
      <path d="M16 14c-6 0-9-4-9-9 6 0 9 4 9 9z" />
      <path d="M16 18c5 0 8-3.5 8-8-5 0-8 3.5-8 8z" />
      <path d="M9 28h14" />
    </>
  ),
  parking: (
    <>
      <rect x="6" y="5" width="20" height="22" />
      <path d="M13 21v-9h4.5a3 3 0 0 1 0 6H13" />
    </>
  ),
};

export default function LineIcon({ name, className = "" }: LineIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
