"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Client Slider Component
 *
 * Displays partner/client logos in a continuous marquee animation.
 * Fetches partners from Sanity CMS API.
 * Features infinite scrolling with GSAP.
 */

interface Partner {
  _id: string;
  name: string;
  logo: {
    asset?: { url?: string };
    alt?: string;
  };
  website?: string;
  country?: string;
  partnerType?: string;
  description?: string;
  isActive: boolean;
}

export default function ClientSlider() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);

  const animationRef = useRef<Animation | undefined>(undefined);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const response = await fetch("/api/global-partners?partnerType=client");
        if (!response.ok) throw new Error("Failed to fetch partners");
        const data = await response.json();
        setPartners(data);
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    }
    fetchPartners();
  }, []);

  useEffect(() => {
    // Create animation once
    if (marqueeRef.current && partners.length > 0) {
      animationRef.current = marqueeRef.current.animate(
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
    }

    return () => {
      animationRef.current?.cancel();
    };
  }, [partners.length]);

  // Control playback based on hover state
  useEffect(() => {
    if (isPaused) {
      animationRef.current?.pause();
    } else {
      animationRef.current?.play();
    }
  }, [isPaused]);

  // Duplicate partners array for seamless infinite scroll
  const duplicatedPartners = partners.length > 0 ? [...partners, ...partners, ...partners] : [];

  // Map partner data to component format
  const displayPartners = duplicatedPartners.map(partner => ({
    id: partner._id,
    name: partner.name,
    logo: partner.logo?.asset?.url || "/placeholder.svg",
    website: partner.website,
  }));

  if (partners.length === 0) {
    return null; // Or show a loading skeleton
  }

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
            Our Valued Clients
          </h2>
          <p className="text-sm text-foreground-muted">
             Serving innovative businesses worldwide
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
          {displayPartners.map((partner, index) => (
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
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={128}
                    height={64}
                    className="max-h-full max-w-full object-contain"
                  />
                </a>
              ) : (
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={128}
                  height={64}
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
