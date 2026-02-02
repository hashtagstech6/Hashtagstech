/**
 * Animation Tokens and Configuration
 *
 * This file contains all animation duration tokens and easing functions
 * used throughout the application. All animations should reference these
 * constants to ensure consistent animation behavior.
 */

/**
 * Animation Duration Tokens (in milliseconds)
 *
 * These values align with UX best practices and are tiered by interaction type:
 * - Hover: Micro-interactions (button hover, link states)
 * - Transition: UI state changes (modal open, panel slide)
 * - Scroll: Content reveal animations (scroll-triggered effects)
 */
export const DURATION = {
  /** Instant feedback: 100-200ms */
  hover: 150,
  /** Fast transitions: 300-400ms */
  transition: 350,
  /** Smooth scroll reveals: 500-800ms */
  scroll: 650,
} as const;

/**
 * Animation Easing Functions
 *
 * CSS cubic-bezier values for smooth, natural motion
 */
export const EASING = {
  /** Default ease: smooth start and end */
  ease: "cubic-bezier(0.4, 0, 0.2, 1)" as const,
  /** Ease out: fast start, smooth end */
  easeOut: "cubic-bezier(0, 0, 0.2, 1)" as const,
  /** Ease in: smooth start, fast end */
  easeIn: "cubic-bezier(0.4, 0, 1, 1)" as const,
  /** Ease in-out: smooth start and end */
  easeInOut: "cubic-bezier(0.4, 0, 0.6, 1)" as const,
  /** Bounce: playful spring effect */
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)" as const,
} as const;

/**
 * Animation Transition Presets
 *
 * Pre-configured transition objects for common use cases
 */
export const TRANSITIONS = {
  /** Fast hover effect */
  hover: {
    duration: DURATION.hover / 1000,
    ease: EASING.ease,
  },
  /** Smooth panel/modal transition */
  panel: {
    duration: DURATION.transition / 1000,
    ease: EASING.easeInOut,
  },
  /** Scroll reveal animation */
  scroll: {
    duration: DURATION.scroll / 1000,
    ease: EASING.easeOut,
  },
} as const;

/**
 * Stagger Delays for List Animations
 *
 * Delay values for animating multiple items in sequence
 */
export const STAGGER = {
  /** Fast stagger: 50ms between items */
  fast: 50,
  /** Normal stagger: 100ms between items */
  normal: 100,
  /** Slow stagger: 150ms between items */
  slow: 150,
} as const;

/**
 * GSAP ScrollTrigger Defaults
 *
 * Default configuration for GSAP ScrollTrigger animations
 */
export const SCROLL_TRIGGER = {
  start: "top 80%", // Animation starts when top of element hits 80% of viewport
  end: "bottom 20%", // Animation ends when bottom of element hits 20% of viewport
  toggleActions: "play none none reverse", // Play on enter, reverse on exit
} as const;

/**
 * Reduced Motion Check
 *
 * Returns true if user prefers reduced motion
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get animation duration respecting reduced motion preference
 *
 * @param duration - Duration in milliseconds
 * @returns Duration (0 if reduced motion is preferred)
 */
export function getDuration(duration: number): number {
  return shouldReduceMotion() ? 0 : duration;
}

/**
 * Get transition object respecting reduced motion preference
 *
 * @param transition - Transition object
 * @returns Transition object (with duration 0 if reduced motion is preferred)
 */
export function getTransition<T extends { duration: number }>(
  transition: T
): T {
  if (shouldReduceMotion()) {
    return { ...transition, duration: 0 };
  }
  return transition;
}
