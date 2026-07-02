"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate, useReducedMotion } from "framer-motion";

/** Animates a "5,000+" / "6 yrs" style stat from 0 once it scrolls into view. */
export function CountUpStat({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduceMotion = useReducedMotion();
  const match = value.match(/^([\d,]+)(.*)$/);
  const target = match ? Number(match[1].replace(/,/g, "")) : null;
  const suffix = match ? match[2] : "";
  const [display, setDisplay] = useState(target !== null ? `0${suffix}` : value);

  useEffect(() => {
    if (!inView || target === null || reduceMotion) {
      if (target !== null) setDisplay(value);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate(v) {
        setDisplay(`${Math.round(v).toLocaleString()}${suffix}`);
      },
    });
    return () => controls.stop();
  }, [inView, target, suffix, value, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
