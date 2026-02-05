"use client";

import { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Magnetic Button Component
 * 
 * Adds an expanding circle hover effect to any button.
 * Does NOT change the button's border-radius or border-width - 
 * those should be passed via className to preserve original styling.
 * 
 * Variants affect only the colors:
 * - primary: Red filled button
 * - outline: Transparent with dark border
 * - white: White button (for colored backgrounds)
 * - white-outline: Transparent with white border
 * 
 * @example
 * ```tsx
 * <MagneticButton variant="primary" className="rounded-full">Our Services</MagneticButton>
 * ```
 */

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: "outline" | "primary" | "white" | "white-outline";
  href?: string;
  className?: string;
}

type ButtonProps = MagneticButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkProps = MagneticButtonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

const MagneticButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps | LinkProps>(
  ({ children, variant = "primary", href, className, ...props }, ref) => {
    // Base styles - default 10px border-radius
    const baseStyles = cn(
      "relative inline-flex items-center justify-center gap-2 px-6 py-3 font-medium",
      "rounded-[10px] overflow-hidden transition-colors duration-300",
      "no-underline hover:no-underline",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "group"
    );

    const variantStyles = {
      // Primary: Filled red button, becomes dark on hover
      primary: cn(
        "bg-primary text-primary-foreground",
        "hover:text-white"
      ),
      // Outline: Transparent with border, fills with dark on hover
      outline: cn(
        "bg-transparent text-foreground border border-foreground",
        "hover:text-white hover:border-foreground"
      ),
      // White: For use on colored backgrounds
      white: cn(
        "bg-white text-primary",
        "hover:text-white"
      ),
      // White Outline: Transparent with white border
      "white-outline": cn(
        "bg-transparent text-white border border-white",
        "hover:text-white hover:border-foreground"
      ),
    };

    // Circle - starts from top-right corner, expands as a proper circle
    const circleStyles = cn(
      "absolute rounded-full",
      "top-0 right-0 -translate-y-1/2 translate-x-1/2",
      "w-0 h-0 opacity-0",
      "bg-foreground",
      "transition-all duration-700 ease-out",
      "group-hover:w-[1000px] group-hover:h-[1000px] group-hover:opacity-100"
    );

    const content = (
      <>
        {/* Expanding circle - only appears on hover */}
        <span className={circleStyles} aria-hidden="true" />
        {/* Text content - always above the circle */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={cn(baseStyles, variantStyles[variant], className)}
          {...(props as Omit<LinkProps, "href" | "children" | "variant" | "className">)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...(props as Omit<ButtonProps, "children" | "variant" | "className" | "href">)}
      >
        {content}
      </button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";

export default MagneticButton;
