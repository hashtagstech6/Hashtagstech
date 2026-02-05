"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ScrollReveal from "@/components/animations/scroll-reveal";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Global Partners Section Component
 *
 * Displays key partners/representatives from different regions.
 * Fetches partners from Sanity CMS API.
 * Layout:
 * - Title: "We Are Operating Globally" / "OUR PARTNERS"
 * - Grid of cards
 * - Card: Person Image (with flag background in image) + Overlay details
 */

interface Partner {
  _id: string;
  name: string;
  country?: string;
  partnerType?: string;
  logo?: {
    asset?: { url?: string };
    alt?: string;
  };
  photo?: {
    asset?: { url?: string };
    alt?: string;
  };
  website?: string;
  description?: string;
  isActive: boolean;
  order?: number;
}

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  photo?: {
    asset?: { url?: string };
    alt?: string;
  };
  country?: string;
}

export default function GlobalPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const response = await fetch("/api/global-partners?partnerType=strategic");
        if (!response.ok) throw new Error("Failed to fetch partners");
        const data = await response.json();
        setPartners(data);
      } catch (error) {
        console.error("Error fetching global partners:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section id="team" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
             <Skeleton className="h-4 w-48 mb-2 opacity-50" />
             <Skeleton className="h-10 w-64" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-[5/6] rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Map partner data to component format
  const displayPartners = partners.slice(0, 4).map(partner => ({
    id: partner._id,
    name: partner.name,
    country: partner.country || "Global",
    role: "Partner",
    image: partner.photo?.asset?.url || "/placeholder.svg",
  }));

  return (
    <section id="team" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-12">
            <p className="text-sm text-foreground-muted uppercase tracking-wide mb-2">
              We Are Operating Globally
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight">
              OUR PARTNERS
            </h2>
          </div>
        </ScrollReveal>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          {displayPartners.map((partner, index) => (
            <ScrollReveal key={partner.id} direction="up" delay={index * 0.1}>
              <div className="group relative aspect-[5/6] overflow-hidden rounded-xl bg-muted shadow-md">
                {/* Person Image (with flag background already in image) */}
                <Image
                  src={partner.image}
                  alt={partner.name}
                  fill
                  className="object-cover object-bottom transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Info Overlay - Glassmorphism Card */}
                <div className="absolute bottom-6 left-6 right-6 transition-all duration-300 ease-out opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0">
                  <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white shadow-lg">
                    <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
                      {partner.role}
                    </p>
                    <h3 className="text-secondary text-xl font-bold leading-tight">
                      {partner.name}
                    </h3>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
