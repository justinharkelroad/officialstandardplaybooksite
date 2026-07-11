import * as React from "react";

/**
 * Cursor-following spotlight. Returns an onPointerMove handler that writes the
 * cursor's local position into --spot-x/--spot-y on the target element. Pair it
 * with the `.spotlight` class (see index.css) on any element you want to glow —
 * buttons, cards, tiles, panels.
 *
 * No state, so no re-render. Composes with an existing onPointerMove if passed.
 */
export function useSpotlight<T extends HTMLElement = HTMLElement>(
  onPointerMove?: React.PointerEventHandler<T>
) {
  return React.useCallback(
    (e: React.PointerEvent<T>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
      onPointerMove?.(e);
    },
    [onPointerMove]
  );
}
