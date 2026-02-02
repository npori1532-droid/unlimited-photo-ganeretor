import * as React from "react";

import { cn } from "@/lib/utils";

type NeonFieldProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Signature moment: pointer-reactive neon field (respects reduced motion).
 * Updates CSS vars --mx/--my which are used by the bg-hero utility.
 */
export function NeonField({ className, children }: NeonFieldProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const onMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", `${x.toFixed(2)}%`);
      el.style.setProperty("--my", `${y.toFixed(2)}%`);
    },
    [reducedMotion],
  );

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={cn("bg-hero", className)}
    >
      {children}
    </div>
  );
}
