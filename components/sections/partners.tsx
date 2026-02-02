"use client";

import { useRef, useEffect, useState } from "react";
import { partners } from "@/data/partners";
import { cn } from "@/lib/utils";

/**
 * Partners Section Component
 *
 * Displays partner/client logos in a continuous marquee animation.
 * Features infinite scrolling with GSAP.
 *
 * Features:
 * - Infinite horizontal marquee animation
 * - Logo grid with hover effects
 * - Responsive design
 * - Pause animation on hover
 *
 * @example
 * ```tsx
 * <Partners />
 * ```
 */

export default function Partners() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // GSAP marquee animation will be added in animation phase
    // For now, using CSS animation as fallback
    const animation = marqueeRef.current?.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-50%)" },
      ],
      {
        duration: 30000,
        iterations: Infinity,
        easing: "linear",
      }
    );

    if (animation && isPaused) {
      animation.pause();
    } else if (animation) {
      animation.play();
    }

    return () => {
      animation?.cancel();
    };
  }, [isPaused]);

  // Duplicate partners array for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section
      ref={sectionRef}
      id="partners"
      className="py-16 bg-surface-muted overflow-hidden"
      aria-labelledby="partners-heading"
    >
      <div className="container mx-auto px-4 mb-8">
        {/* Section Header */}
        <div className="text-center">
          <h2
            id="partners-heading"
            className="text-2xl font-semibold tracking-tight text-foreground mb-2"
          >
            Trusted by Leading Companies
          </h2>
          <p className="text-sm text-foreground-muted">
            We've had the privilege of working with innovative businesses worldwide
          </p>
        </div>
      </div>

      {/* Marquee Container */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface-muted to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface-muted to-transparent z-10 pointer-events-none" />

        {/* Scrolling Marquee */}
        <div
          ref={marqueeRef}
          className="flex items-center space-x-12 whitespace-nowrap"
          style={{ width: "fit-content" }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className={cn(
                "flex-shrink-0 flex items-center justify-center",
                "grayscale opacity-60 hover:grayscale-0 hover:opacity-100",
                "transition-all duration-300",
                "h-16 w-32"
              )}
            >
              {partner.website ? (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${partner.name} website`}
                >
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="max-h-full max-w-full object-contain"
                  />
                </a>
              ) : (
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
