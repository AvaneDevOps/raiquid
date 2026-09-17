"use client";

import { useEffect, useState } from "react";

export function useCoolDown(seconds: number) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [remaining]);

  return { remaining, start: () => setRemaining(seconds) };
}
