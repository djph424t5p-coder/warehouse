"use client";

import { useEffect, useState } from "react";

/* Гидрация: всё, что зависит от window, рендерим только после маунта */
export default function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
