"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import MobileNav from "./mobile-nav";
import MagneticButton from "@/components/ui/magnetic-button";
import Modal from "@/components/ui/modal";
import BookingForm from "@/components/forms/booking-form";

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
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const pathname = usePathname();

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
    setIsBookingOpen(false);
  }, [pathname]);

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
    { name: "ABOUT", href: "/about" },
    { name: "SERVICES", href: "/#services" },
    { name: "TEAM", href: "/team" },
    { name: "CAREER", href: "/career" },
    { name: "BLOG", href: "/blog" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[999] transition-all duration-300",
          isScrolled
            ? "bg-white shadow-sm"
            : pathname === "/"
            ? "bg-white/10 backdrop-blur-sm"
            : "bg-white"
        )}
      >
        <nav className="container mx-auto px-4" aria-label="Main navigation">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex h-16 items-center justify-between"
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md filter-none drop-shadow-none"
            >
              <Image
                src="/logo-horizontal.webp"
                alt="Hashtag Tech Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1 relative group no-underline hover:no-underline"
                    style={{ textShadow: "none" }}
                  >
                    {item.name}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                </motion.div>
              ))}
              <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.5, duration: 0.3 }}
              >
                  <MagneticButton 
                    variant="primary" 
                    className="px-5 py-3 text-xs rounded-lg" 
                    style={{ textShadow: "none" }}
                    onClick={() => setIsBookingOpen(true)}
                  >
                    BOOK MEETING
                  </MagneticButton>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:inline-flex md:hidden p-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 z-[1000] relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial="closed"
                animate={isMobileMenuOpen ? "open" : "closed"}
              >
                <motion.line
                  x1="4" y1="6" x2="20" y2="6"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 6 }
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ transformOrigin: "center" }}
                />
                <motion.line
                  x1="4" y1="12" x2="20" y2="12"
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.line
                  x1="4" y1="18" x2="20" y2="18"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -6 }
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ transformOrigin: "center" }}
                />
              </motion.svg>
            </button>
          </motion.div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={navigation}
      />

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        title="Book a Meeting"
      >
        <BookingForm onSuccess={() => setIsBookingOpen(false)} />
      </Modal>
    </>
  );
}
