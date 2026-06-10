"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ArchCanvas = dynamic(() => import("@/components/three/ArchCanvas"), {
  ssr: false,
});

/* Монтирует тяжёлую сцену только при приближении секции к вьюпорту */
export default function ArchViewer() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full w-full">
      {near && <ArchCanvas />}
    </div>
  );
}
