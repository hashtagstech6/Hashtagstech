"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Props for ScrollReveal component
 */
export interface ScrollRevealProps {
  /** Content to reveal on scroll */
  children: ReactNode;
  /** Direction of animation */
  direction?: "up" | "down" | "left" | "right" | "fade";
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Duration of animation (seconds) */
  duration?: number;
  /** Custom className */
  className?: string;
}

/**
 * ScrollReveal Component
 *
 * Wrapper component that reveals content with animation when scrolled into view.
 * Uses GSAP ScrollTrigger for smooth scroll-triggered animations.
 * Respects prefers-reduced-motion setting.
 *
 * @example
 * ```tsx
 * <ScrollReveal direction="up">
 *   <h2>This content fades in from bottom when scrolled into view</h2>
 * </ScrollReveal>
 *
 * <ScrollReveal direction="fade" delay={0.2}>
 *   <p>This content fades in with a delay</p>
 * </ScrollReveal>
 * ```
 */
export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.65,
  className = "",
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    // Set initial state based on direction
    const getInitialState = () => {
      switch (direction) {
        case "up":
          return { y: 50, opacity: 0 };
        case "down":
          return { y: -50, opacity: 0 };
        case "left":
          return { x: 50, opacity: 0 };
        case "right":
          return { x: -50, opacity: 0 };
        case "fade":
          return { opacity: 0 };
        default:
          return { y: 50, opacity: 0 };
      }
    };

    // Set final state
    const getFinalState = () => {
      switch (direction) {
        case "up":
        case "down":
          return { y: 0, opacity: 1 };
        case "left":
        case "right":
          return { x: 0, opacity: 1 };
        case "fade":
          return { opacity: 1 };
        default:
          return { y: 0, opacity: 1 };
      }
    };

    // Set initial state
    gsap.set(element, getInitialState());

    // Create animation
    const animation = gsap.to(element, {
      ...getFinalState(),
      duration,
      delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%", // Animation starts when top of element hits 80% of viewport
        end: "bottom 20%",
        toggleActions: "play none none reverse", // Play on enter, reverse on exit
      },
    });

    // Cleanup
    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [direction, delay, duration, prefersReducedMotion]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

/**
 * StaggerChildrenReveal Component
 *
 * Reveals multiple children with staggered animation delay.
 *
 * @example
 * ```tsx
 * <StaggerChildrenReveal stagger={0.1}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </StaggerChildrenReveal>
 * ```
 */
export function StaggerChildrenReveal({
  children,
  stagger = 0.1,
  direction = "up",
  className = "",
}: {
  children: ReactNode;
  stagger?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const children = Array.from(container.children);

    // Set initial state based on direction
    const getInitialState = () => {
      switch (direction) {
        case "up":
          return { y: 50, opacity: 0 };
        case "down":
          return { y: -50, opacity: 0 };
        case "left":
          return { x: 50, opacity: 0 };
        case "right":
          return { x: -50, opacity: 0 };
        case "fade":
          return { opacity: 0 };
        default:
          return { y: 50, opacity: 0 };
      }
    };

    // Set initial state for all children
    gsap.set(children, getInitialState());

    // Create staggered animation
    const animation = gsap.to(children, {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.65,
      stagger,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      animation.kill();
    };
  }, [stagger, direction, prefersReducedMotion]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
