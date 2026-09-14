"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element once, the first time it scrolls into view, via
 * IntersectionObserver. Reduced motion is handled separately, in CSS
 * (`motion-reduce:` variants on the consuming component) rather than
 * here — this hook only ever calls setState from inside the observer's
 * callback, never synchronously in the effect body.
 *
 * Landing-area only for now per CONTRIBUTING.md #3 — promote to
 * shared/ if a second app area wants the same scroll-reveal pattern.
 */
export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
