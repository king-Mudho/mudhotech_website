/**
 * Shared entrance animation. Import this rather than redeclaring variants
 * per component (docs/11-coding-standards.md §2).
 *
 * `margin` starts the animation before the element reaches the viewport, so
 * content has settled by the time it is actually on screen — without it, a
 * fast scroll lands on blocks that are still at opacity 0.
 */
export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -12% 0px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

/**
 * Staggered variant for grids — index-based delay, capped so long lists
 * don't leave later items hanging invisible.
 */
export function fadeUpDelayed(index: number) {
  return {
    ...fadeUp,
    transition: { ...fadeUp.transition, delay: Math.min(index * 0.07, 0.35) },
  };
}
