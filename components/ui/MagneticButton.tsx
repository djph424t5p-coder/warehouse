"use client";

import { useRef, type ReactNode } from "react";
import useMagnetic from "@/hooks/useMagnetic";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
};

/*
  Magnetic-кнопка: внешний слой тянется сильнее, внутренний ярлык — слабее
  (двухслойный параллакс-эффект).
*/
export default function MagneticButton({
  children,
  className = "",
  onClick,
  href,
}: MagneticButtonProps) {
  const outerRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  useMagnetic(outerRef, 0.3);
  useMagnetic(innerRef, 0.12);

  const baseClass =
    "kicker inline-flex items-center justify-center gap-4 border border-brass/40 " +
    "px-10 py-5 text-bone transition-colors duration-500 " +
    "hover:border-brass hover:text-brass " +
    className;

  const label = <span ref={innerRef}>{children}</span>;

  if (href) {
    return (
      <a
        ref={outerRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={(event) => {
          if (onClick) {
            event.preventDefault();
            onClick();
          }
        }}
        data-cursor="hover"
        className={baseClass}
      >
        {label}
      </a>
    );
  }

  return (
    <button
      ref={outerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      data-cursor="hover"
      className={baseClass}
    >
      {label}
    </button>
  );
}
