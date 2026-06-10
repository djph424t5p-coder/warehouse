"use client";

import type { ReactNode } from "react";
import SmoothScrollProvider from "./SmoothScrollProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
