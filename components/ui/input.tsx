"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Props for Input component
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Error state */
  error?: boolean;
  /** Helper text to display below input */
  helperText?: string;
}

/**
 * Input Component with focus states
 *
 * A reusable input component with proper focus states using brand-primary ring color.
 * Includes error state and helper text support.
 *
 * @example
 * ```tsx
 * <Input
 *   type="text"
 *   placeholder="Enter your name"
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 *   error={hasError}
 *   helperText={errorMessage}
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, type = "text", ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            // Base styles
            "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm",
            "placeholder:text-muted-foreground",
            // Focus states
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            // Disabled state
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Error state
            error && "border-error focus-visible:ring-error",
            // File input specific
            type === "file" && "file:mr-4 file:h-8 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium",
            // Custom classes
            className
          )}
          ref={ref}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={helperText ? `${props.id}-helper` : undefined}
          {...props}
        />
        {helperText && (
          <p
            id={`${props.id}-helper`}
            className={cn(
              "mt-1 text-xs",
              error ? "text-error" : "text-muted-foreground"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
