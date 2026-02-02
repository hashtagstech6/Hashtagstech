"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Props for useCounterAnimation hook
 */
interface UseCounterAnimationProps {
  /** Target value to count to */
  endValue: number;
  /** Starting value (default: 0) */
  startValue?: number;
  /** Duration in seconds (default: 2) */
  duration?: number;
  /** Number of decimal places (default: 0) */
  decimals?: number;
  /** Whether to start animation automatically (default: true) */
  autoStart?: boolean;
}

/**
 * Hook to animate a number from start to end value using GSAP
 *
 * This hook uses GSAP to smoothly animate a number value from a start value
 * to an end value. It respects the user's prefers-reduced-motion setting.
 *
 * @example
 * ```tsx
 * function StatsCounter() {
 *   const { value, ref, start } = useCounterAnimation({
 *     endValue: 100,
 *     duration: 2,
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       <span>{value}</span>+
 *     </div>
 *   );
 * }
 * ```
 */
export function useCounterAnimation({
  endValue,
  startValue = 0,
  duration = 2,
  decimals = 0,
  autoStart = true,
}: UseCounterAnimationProps) {
  const [currentValue, setCurrentValue] = useState(startValue);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const animationRef = useRef<gsap.core.Tween | null>(null);

  // Format number with specified decimal places
  const formatValue = (value: number): string => {
    return value.toFixed(decimals);
  };

  // Start the counter animation
  const start = () => {
    if (hasAnimated || prefersReducedMotion) {
      // If reduced motion is preferred, jump to end value immediately
      setCurrentValue(endValue);
      setHasAnimated(true);
      return;
    }

    // Create a proxy object for GSAP to animate
    const proxy = { value: startValue };

    animationRef.current = gsap.to(proxy, {
      value: endValue,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        setCurrentValue(proxy.value);
      },
      onComplete: () => {
        setHasAnimated(true);
      },
    });
  };

  // Auto-start animation when ref is attached
  useEffect(() => {
    if (autoStart && ref.current && !hasAnimated) {
      start();
    }

    return () => {
      // Clean up animation on unmount
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [autoStart, endValue]);

  // Reset animation if endValue changes
  useEffect(() => {
    if (hasAnimated && autoStart) {
      setHasAnimated(false);
      setCurrentValue(startValue);
    }
  }, [endValue]);

  return {
    /** Current animated value (formatted) */
    value: formatValue(currentValue),
    /** Ref to attach to the element that triggers animation */
    ref,
    /** Manually start the animation */
    start,
    /** Whether animation has completed */
    hasAnimated,
    /** Current raw numeric value */
    rawValue: currentValue,
  };
}

export default useCounterAnimation;
