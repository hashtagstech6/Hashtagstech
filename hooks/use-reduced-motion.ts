import { useEffect, useState } from "react";

/**
 * Hook to detect if user prefers reduced motion
 *
 * This hook checks the `prefers-reduced-motion` media query and returns
 * a boolean indicating whether animations should be reduced or disabled.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const prefersReducedMotion = useReducedMotion();
 *
 *   return (
 *     <motion.div
 *       animate={prefersReducedMotion ? { opacity: 1 } : { x: 100 }}
 *       transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * }
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return;

    // Initial check
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }

    return () => {};
  }, []);

  return prefersReducedMotion;
}

export default useReducedMotion;
