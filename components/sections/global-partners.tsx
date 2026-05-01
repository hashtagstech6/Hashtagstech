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
 * - Responsive grid of cards (2 cols mobile → 3 cols tablet → 4 cols desktop)
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

/**
 * Country code to full name mapping.
 * The Sanity schema stores 2-letter ISO codes; this maps them to display names.
 */
const countryCodeToName: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  MX: "Mexico",
  BR: "Brazil",
  AR: "Argentina",
  CO: "Colombia",
  CL: "Chile",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  CH: "Switzerland",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  PL: "Poland",
  BE: "Belgium",
  AT: "Austria",
  AE: "UAE",
  SA: "Saudi Arabia",
  QA: "Qatar",
  KW: "Kuwait",
  OM: "Oman",
  BH: "Bahrain",
  IL: "Israel",
  TR: "Turkey",
  EG: "Egypt",
  IN: "India",
  PK: "Pakistan",
  CN: "China",
  JP: "Japan",
  KR: "South Korea",
  SG: "Singapore",
  HK: "Hong Kong",
  MY: "Malaysia",
  TH: "Thailand",
  ID: "Indonesia",
  PH: "Philippines",
  VN: "Vietnam",
  AU: "Australia",
  NZ: "New Zealand",
  ZA: "South Africa",
  NG: "Nigeria",
  KE: "Kenya",
  MA: "Morocco",
  RU: "Russia",
  UA: "Ukraine",
  CY: "Cyprus",
};

/**
 * Returns the full country name from a country code.
 * Strips invisible/zero-width characters that Sanity may inject,
 * then does a case-insensitive lookup.
 */
function getCountryName(code?: string): string {
  if (!code) return "Global";
  // Strip all non-printable / zero-width characters, keep only ASCII letters
  const clean = code.replace(/[^A-Za-z]/g, "").toUpperCase();
  return countryCodeToName[clean] || code.trim();
}

export default function GlobalPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const response = await fetch("/api/global-partners");
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-[5/6] rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Map partner data to component format — show ALL partners (no slice limit)
  const displayPartners = partners.map(partner => ({
    id: partner._id,
    name: partner.name,
    country: getCountryName(partner.country),
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

        {/* Partners Grid — Responsive: 2 cols → 3 cols → 4 cols */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 transition-all duration-300 ease-out opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0">
                  <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl p-3 sm:p-4 shadow-lg">
                    <h3 className="text-secondary text-lg sm:text-xl font-bold leading-tight">
                      {partner.name}
                    </h3>
                    <p className="text-primary text-xs font-bold uppercase tracking-wider mt-1">
                      Partner from {partner.country}
                    </p>
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
