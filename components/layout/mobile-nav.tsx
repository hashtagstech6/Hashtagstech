"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
            <div className="flex h-full flex-col pt-16">
              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
                <nav className="space-y-4 mb-8" aria-label="Mobile navigation">
                  {navigation.map((item, index) => (
                    <motion.div
                       key={item.name}
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: 0.1 + index * 0.1 }}
                    >
                        <Link
                          href={item.href}
                          ref={index === navigation.length - 1 ? lastFocusableRef : null}
                          className="block text-2xl font-bold text-foreground hover:text-primary transition-colors focus-visible:outline-none"
                          onClick={onClose}
                        >
                          {item.name}
                        </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Company Info & Socials */}
                <div className="space-y-6 pt-6 border-t border-border/50">
                    <Image
                      src="/logo-horizontal.webp"
                      alt="Hashtag Tech Logo"
                      width={120}
                      height={32}
                      className="h-8 w-auto opacity-80"
                    />
                    <p className="text-sm text-foreground/60 leading-relaxed max-w-xs">
                       We build world-class web and mobile applications powered by cutting-edge AI technology. Partner with us to transform your digital presence.
                    </p>
                    
                    {/* Social Icons */}
                   <div className="flex space-x-4">
                     {[
                        {
                          name: "LinkedIn",
                          href: "https://linkedin.com/company/hashtag-tech",
                          icon: (
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          ),
                        },
                        {
                          name: "Twitter",
                          href: "https://twitter.com/hashtagtech",
                          icon: (
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          ),
                        },
                        {
                          name: "Instagram",
                          href: "https://instagram.com/hashtagtech",
                          icon: (
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          ),
                        },
                      ].map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground/60 hover:text-primary transition-colors p-2 -ml-2 rounded-full hover:bg-accent"
                          aria-label={`Follow us on ${social.name}`}
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>
                </div>
              </div>

              {/* Book Meeting CTA */}
              <div className="border-t border-border p-4 bg-muted/30">
                <Link
                  href="/contact"
                  className="block w-full rounded-xl bg-primary px-4 py-4 text-center text-sm font-bold tracking-wider uppercase text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-lg hover:shadow-xl transition-all"
                  onClick={onClose}
                >
                  Book A Meeting
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
