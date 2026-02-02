"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import MobileNav from "./mobile-nav";
import MagneticButton from "@/components/ui/magnetic-button";

/**
 * Header Component
 *
 * Sticky navigation header with scroll shadow detection.
 * Includes HOME/SERVICES/TEAM/CAREER links and BOOK MEETING button.
 *
 * Features:
 * - Sticky positioning that stays at top when scrolling
 * - Shadow appears when scrolled down
 * - Mobile hamburger menu
 * - Keyboard navigation support
 * - Accessible focus states
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detect scroll position for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navigation = [
    { name: "HOME", href: "/" },
    { name: "SERVICES", href: "/#services" },
    { name: "TEAM", href: "/#team" },
    { name: "CAREER", href: "/career" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/50 backdrop-blur-md shadow-sm"
            : "bg-white/10 backdrop-blur-sm"
        )}
      >
        <nav className="container mx-auto px-4" aria-label="Main navigation">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            >
              <img
                src="/logo-horizontal.jpeg"
                alt="Hashtag Tech Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1"
                >
                  {item.name}
                </Link>
              ))}
              <MagneticButton href="/contact" variant="primary">
                BOOK MEETING
              </MagneticButton>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:inline-flex md:hidden p-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Open main menu"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={navigation}
      />
    </>
  );
}
