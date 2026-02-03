"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./use-reduced-motion";

// Register ScrollTrigger plugin (client-side only)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  /** Enable ScrollTrigger for scroll-based animation (default: false) */
  scrollTrigger?: boolean;
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
  scrollTrigger = false,
}: UseCounterAnimationProps) {
  const [currentValue, setCurrentValue] = useState(startValue);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

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

    // Clean up existing animation and ScrollTrigger
    if (animationRef.current) {
      animationRef.current.kill();
    }
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
    }

    // Create GSAP tween configuration
    const tweenConfig: gsap.TweenVars = {
      value: endValue,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        setCurrentValue(proxy.value);
      },
      onComplete: () => {
        setHasAnimated(true);
      },
    };

    // Add ScrollTrigger if enabled
    if (scrollTrigger && ref.current) {
      // Find parent section element for scroll trigger
      const sectionElement = ref.current.closest<HTMLElement>("section");

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: sectionElement || ref.current,
        start: "top 80%", // Start animation when top of element is at 80% of viewport
        onEnter: () => {
          animationRef.current = gsap.to(proxy, tweenConfig);
        },
        once: true, // Only animate once
      });
    } else {
      // Start immediately without ScrollTrigger
      animationRef.current = gsap.to(proxy, tweenConfig);
    }
  };

  // Auto-start animation when ref is attached
  useEffect(() => {
    if (autoStart && ref.current && !hasAnimated) {
      start();
    }

    return () => {
      // Clean up animation and ScrollTrigger on unmount
      if (animationRef.current) {
        animationRef.current.kill();
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
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
