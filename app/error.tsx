"use client";

import { useEffect } from "react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Bug
} from "lucide-react";

/**
 * Next.js Error Boundary Component
 *
 * Catches errors in Client Components and displays a user-friendly error page.
 * T152 Add error boundaries for client components
 *
 * @example
 * ```tsx
 * // This file is automatically picked up by Next.js
 * ```
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging (could be sent to error tracking service)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
        </div>

        {/* Error Title */}
        <Heading level="h1" className="text-3xl md:text-4xl font-bold mb-4">
          Oops! Something went wrong
        </Heading>

        {/* Error Message */}
        <p className="text-muted-foreground text-lg mb-2">
          We encountered an unexpected error while processing your request.
        </p>

        {/* Technical Details (in development) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="bg-muted rounded-lg p-4 mb-8 text-left">
            <p className="text-sm font-mono text-destructive">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            variant="default"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>

          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go home
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-4">
            If this problem persists, please contact our support team:
          </p>
          <a
            href="mailto:support@hashtagstech.com"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Bug className="w-4 h-4" />
            Report this issue
          </a>
        </div>
      </div>
    </div>
  );
}
