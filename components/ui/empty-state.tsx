"use client";

import { cn } from "@/lib/utils";

/**
 * Empty State Component
 * 
 * A reusable empty state UI with animated icon, headline, and description.
 * Use this when content is not available (no posts, no jobs, etc.)
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   icon="briefcase"
 *   title="No Open Positions"
 *   description="We don't have any openings at the moment."
 *   hint="Follow us on social media for updates"
 * />
 * ```
 */

interface EmptyStateProps {
  /** Icon type to display */
  icon?: "briefcase" | "pencil" | "star" | "message" | "trophy" | "search";
  /** Main headline */
  title: string;
  /** Supporting description */
  description: string;
  /** Optional hint text at bottom */
  hint?: string;
  /** Additional className for wrapper */
  className?: string;
}

const icons = {
  briefcase: (
    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  pencil: (
    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  star: (
    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  message: (
    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  trophy: (
    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  search: (
    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
};

export default function EmptyState({
  icon = "search",
  title,
  description,
  hint,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-16 max-w-md mx-auto", className)}>
      {/* Animated Icon */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div 
          className="absolute inset-0 bg-primary/5 rounded-full animate-ping" 
          style={{ animationDuration: '3s' }} 
        />
        <div className="absolute inset-2 bg-primary/10 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          {icons[icon]}
        </div>
      </div>
      
      {/* Headline */}
      <h3 className="text-2xl font-bold text-foreground mb-3">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-muted-foreground text-lg mb-6">
        {description}
      </p>
      
      {/* Optional Hint */}
      {hint && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {hint}
        </div>
      )}
    </div>
  );
}
