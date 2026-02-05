"use client";

import { useRef } from "react";
import ScrollReveal from "@/components/animations/scroll-reveal";
import MagneticButton from "@/components/ui/magnetic-button";

/**
 * CTA Banner Section Component
 *
 * Call-to-action banner encouraging users to book a meeting.
 * Features bold design with primary background and clear CTA.
 *
 * Features:
 * - Full-width section with primary (red) background
 * - Centered heading and CTA button
 * - Scroll-triggered reveal animation
 * - Responsive padding
 *
 * @example
 * ```tsx
 * <CTABanner />
 * ```
 */

export default function CTABanner() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-gradient-to-b from-primary to-primary-deep"
      aria-labelledby="cta-banner-heading"
    >
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto">
            {/* Heading */}
            <h2
              id="cta-banner-heading"
              className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6"
            >
              Ready to Transform Your Digital Presence?
            </h2>

            {/* Subtext */}
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Let's discuss how Hashtag Tech can help you achieve your business
              goals with cutting-edge software solutions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <MagneticButton href="/contact" variant="white">
                Book a Free Consultation
              </MagneticButton>
              <MagneticButton href="#portfolio" variant="white-outline">
                View Our Work
              </MagneticButton>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
