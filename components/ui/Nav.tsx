"use client";

import { useLenis } from "@/hooks/useLenis";
import { NAV_LINKS, PROJECT } from "@/lib/constants";
import { useAppStore } from "@/lib/stores";

/*
  Минималистичная фиксированная навигация.
  mix-blend-difference — читаемость и на тёмных, и на светлых секциях.
*/
export default function Nav() {
  const lenis = useLenis();
  const phase = useAppStore((state) => state.phase);

  const scrollTo = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(`#${id}`, { duration: 1.6 });
    } else {
      document.getElementById(id)?.scrollIntoView();
    }
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 mix-blend-difference transition-opacity duration-1000 ${
        phase === "loading" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="container-luxe flex items-center justify-between py-7">
        <a
          href="#hero"
          onClick={scrollTo("hero")}
          data-cursor="hover"
          className="font-display text-lg tracking-[0.08em] text-bone"
        >
          {PROJECT.name}
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={scrollTo(link.id)}
                data-cursor="hover"
                className="kicker text-bone! transition-opacity duration-300 hover:opacity-60"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          onClick={scrollTo("contact")}
          data-cursor="hover"
          className="kicker hidden text-bone! underline decoration-bone/30 underline-offset-8 transition-colors duration-300 sm:block"
        >
          Запросить показ
        </a>
      </div>
    </nav>
  );
}
