type SectionHeadingProps = {
  kicker: string;
  title?: string;
  className?: string;
};

/* Единый ритм заголовков секций: лейбл латунью + дисплейный заголовок */
export default function SectionHeading({
  kicker,
  title,
  className = "",
}: SectionHeadingProps) {
  return (
    <header className={className}>
      <p className="kicker">{kicker}</p>
      {title && <h2 className="display-1 mt-8 max-w-[20ch]">{title}</h2>}
    </header>
  );
}
