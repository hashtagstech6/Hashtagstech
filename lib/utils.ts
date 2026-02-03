import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with clsx
 *
 * This function combines clsx for conditional class names with tailwind-merge
 * to handle Tailwind CSS class conflicts. The last class wins when there are conflicts.
 *
 * @example
 * ```tsx
 * cn("px-4 py-2", isActive && "bg-primary", "px-6") // => "py-2 bg-primary px-6"
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with commas for thousands
 *
 * @example
 * formatNumber(1000) // => "1,000"
 * formatNumber(1234567) // => "1,234,567"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Format a date to a readable string
 *
 * @example
 * formatDate(new Date("2024-01-15")) // => "January 15, 2024"
 * formatDate("2024-01-15T10:00:00Z") // => "January 15, 2024"
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Truncate text to a maximum length with ellipsis
 *
 * @example
 * truncate("This is a long text", 10) // => "This is a..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Debounce a function call
 *
 * @example
 * const debouncedSearch = debounce((query: string) => console.log(query), 300)
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if the code is running on the client side
 */
export function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Check if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (!isClient()) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
