import { type Href, router } from 'expo-router';
import { useCallback, useRef } from 'react';

const DEFAULT_COOLDOWN_MS = 400;

/** Push without stacking duplicate screens; debounces rapid taps. */
export function useNavigateOnce(cooldownMs = DEFAULT_COOLDOWN_MS) {
  const lastNavAt = useRef(0);

  return useCallback(
    (href: Href) => {
      const now = Date.now();
      if (now - lastNavAt.current < cooldownMs) return;
      lastNavAt.current = now;
      router.push(href);
    },
    [cooldownMs],
  );
}
