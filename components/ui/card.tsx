"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Props for Card component
 */
export interface CardProps extends HTMLMotionProps<"div"> {
  /** Enable elevation hover effect */
  elevation?: boolean;
  /** Disable hover animation */
  noAnimation?: boolean;
}

/**
 * Card Component with Motion.dev elevation effect
 *
 * A reusable card component with optional elevation hover effect.
 * Uses Framer Motion for smooth animations that respect reduced motion preferences.
 *
 * @example
 * ```tsx
 * <Card elevation className="p-6">
 *   <h3>Card Title</h3>
 *   <p>Card content goes here...</p>
 * </Card>
 *
 * <Card noAnimation className="p-4">
 *   <p>Static card without animation</p>
 * </Card>
 * ```
 */
export function Card({
  elevation = true,
  noAnimation = false,
  className,
  children,
  ...props
}: CardProps) {
  const prefersReducedMotion = useReducedMotion();

  // Elevation hover animation
  const elevationAnimation =
    elevation && !noAnimation && !prefersReducedMotion
      ? {
          y: -4,
          transition: { duration: 0.2 },
        }
      : {};

  return (
    <motion.div
      className={cn(
        "rounded-lg border bg-background shadow-sm",
        elevation && !noAnimation && "transition-shadow duration-200",
        className
      )}
      whileHover={elevationAnimation}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Card;
