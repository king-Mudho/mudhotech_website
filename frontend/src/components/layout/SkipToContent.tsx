/**
 * WCAG 2.4.1 "Bypass Blocks".
 *
 * The header carries seven nav links, a theme toggle, and a CTA — without
 * this, every keyboard and screen-reader visitor tabs through all of them
 * again on every single page before reaching the content they came for.
 *
 * Hidden by moving it off-screen rather than with `sr-only` + `focus:not-sr-only`:
 * `not-sr-only` sets `padding: 0`, and because it lands on a `:focus`
 * compound selector it out-specifies the `px-4 py-2` here — so the revealed
 * link would appear as bare unpadded text on a coloured block. Translating
 * it out of view keeps every other style intact and just slides it in.
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="fixed left-4 top-4 z-[100] -translate-y-[200%] rounded-md bg-accent px-4 py-2 font-heading text-sm font-semibold text-accent-foreground shadow-lg transition-transform duration-150 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}
