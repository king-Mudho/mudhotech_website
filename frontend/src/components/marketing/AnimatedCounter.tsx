"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({ target, suffix = "", duration = 2 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  // Reduced motion means the final figure, immediately — a number ticking up
  // for two seconds is exactly the kind of movement that setting asks to
  // switch off, and MotionConfig cannot reach a setInterval.
  const [count, setCount] = useState(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }
    if (!isInView) return;

    let start = 0;
    const step = Math.ceil(target / (duration * 60));
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [isInView, target, duration, prefersReducedMotion]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4 }}
      // The count animates one digit at a time; announcing every frame would
      // flood a screen reader. The final value is in the accessible name.
      aria-label={`${target}${suffix}`}
    >
      <span aria-hidden="true">
        {count}
        {suffix}
      </span>
    </motion.span>
  );
}
