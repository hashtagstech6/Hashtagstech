"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Button variant types
 */
export type ButtonVariant = "primary" | "secondary" | "ghost";

/**
 * Button size types
 */
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Props for Button component
 */
export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "asChild"> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Full width button */
  fullWidth?: boolean;
  /** Disable hover animation */
  noAnimation?: boolean;
}

/**
 * Button sizes configuration
 */
const buttonSizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

/**
 * Button variant styles
 */
const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
  ghost:
    "bg-transparent hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
};

/**
 * Button Component with Motion.dev animations
 *
 * A reusable button component with variants for primary, secondary, and ghost styles.
 * Includes hover animations using Framer Motion that respect reduced motion preferences.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Get Started
 * </Button>
 *
 * <Button variant="ghost" noAnimation>
 *   Skip Animation
 * </Button>
 * ```
 */
export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  noAnimation = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  // Animation variants
  const hoverAnimation = noAnimation || prefersReducedMotion
    ? {}
    : {
        scale: 1.02,
        transition: { duration: 0.15 },
      };

  const tapAnimation = noAnimation || prefersReducedMotion
    ? {}
    : {
        scale: 0.98,
        transition: { duration: 0.1 },
      };

  return (
    <motion.button
      className={cn(
        // Base styles
        "inline-flex items-center justify-center rounded-md font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "transition-colors duration-150",
        // Variant styles
        buttonVariants[variant],
        // Size styles
        buttonSizes[size],
        // Full width
        fullWidth && "w-full",
        // Custom classes
        className
      )}
      disabled={disabled}
      whileHover={disabled ? undefined : hoverAnimation}
      whileTap={disabled ? undefined : tapAnimation}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
