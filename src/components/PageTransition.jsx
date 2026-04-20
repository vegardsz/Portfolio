import { useEffect, useLayoutEffect, useRef } from "react";
import { instantScrollToTop } from "../instantScrollToTop";

const FADE_DELAY_MS = 80;
const DURATION_MS = 360;

/**
 * Entry-only opacity fade after route change, started after a brief delay so layout/scroll can settle.
 * When `resetScrollOnEntry` is true (navigating to a real project page), scrolls to top synchronously
 * before opacity setup — not when returning to landing. Overlays portal to `document.body`.
 */
export default function PageTransition({ pathname, resetScrollOnEntry, children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (resetScrollOnEntry) {
      instantScrollToTop();
    }

    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.style.transition = "none";
      el.style.opacity = "1";
      return;
    }

    el.style.transition = "none";
    el.style.opacity = "0";
  }, [pathname, resetScrollOnEntry]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      el.style.transition = `opacity ${DURATION_MS}ms ease-out`;
      el.style.opacity = "1";
    }, FADE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div ref={ref} className="min-h-0">
      {children}
    </div>
  );
}
