"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Props for MobileNav component
 */
export interface MobileNavProps {
  /** Whether the mobile menu is open */
  isOpen: boolean;
  /** Callback when menu is closed */
  onClose: () => void;
  /** Navigation items */
  navigation: Array<{ name: string; href: string }>;
}

/**
 * Mobile Navigation Drawer Component
 *
 * Slide-in drawer menu for mobile devices with hamburger menu,
 * focus trap, and escape-to-close functionality.
 *
 * Features:
 * - Slide-in animation from right
 * - Focus trap when open
 * - Close on escape key
 * - Close on backdrop click
 * - Proper ARIA attributes for accessibility
 *
 * @example
 * ```tsx
 * <MobileNav
 *   isOpen={isMobileMenuOpen}
 *   onClose={() => setIsMobileMenuOpen(false)}
 *   navigation={navigation}
 * />
 * ```
 */
export default function MobileNav({
  isOpen,
  onClose,
  navigation,
}: MobileNavProps) {
  const prefersReducedMotion = useReducedMotion();
  const backdropRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLAnchorElement>(null);

  // Focus trap when menu is open
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = menuRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);

    // Focus first element when menu opens
    firstFocusableRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Animation variants
  const backdropVariants = prefersReducedMotion
    ? {
        open: { opacity: 1 },
        closed: { opacity: 0 },
      }
    : {
        open: { opacity: 1 },
        closed: { opacity: 0 },
      };

  const menuVariants = prefersReducedMotion
    ? {
        open: { x: 0 },
        closed: { x: "100%" },
      }
    : {
        open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
        closed: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={backdropRef}
            className="fixed inset-0 z-50 bg-black/50"
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu Drawer */}
          <motion.div
            ref={menuRef}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-background shadow-xl"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <img
                  src="/logo-horizontal.webp"
                  alt="Hashtag Tech Logo"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                />
                <button
                  ref={firstFocusableRef}
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={onClose}
                  aria-label="Close menu"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <nav className="space-y-2" aria-label="Mobile navigation">
                  {navigation.map((item, index) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      ref={index === navigation.length - 1 ? lastFocusableRef : null}
                      className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      onClick={onClose}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Book Meeting CTA */}
              <div className="border-t border-border p-4">
                <Link
                  href="/contact"
                  className="block w-full rounded-md bg-primary px-4 py-3 text-center text-base font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={onClose}
                >
                  BOOK MEETING
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
