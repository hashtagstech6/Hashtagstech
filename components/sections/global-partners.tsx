"use client";

import Image from "next/image";
import { globalPartners } from "@/data/global-partners";
import ScrollReveal from "@/components/animations/scroll-reveal";

/**
 * Global Partners Section Component
 *
 * Displays key partners/representatives from different regions.
 * Layout:
 * - Title: "We Are Operating Globally" / "OUR PARTNERS"
 * - Grid of cards
 * - Card: Flag background + Person Image + Overlay details
 */
export default function GlobalPartners() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {globalPartners.map((partner, index) => (
            <ScrollReveal key={partner.id} direction="up" delay={index * 0.1}>
              <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-md">
                {/* Background - Country Flag */}
                <div className="absolute inset-0">
                  <Image
                    src={partner.flag}
                    alt={`${partner.country} Flag`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                </div>

                {/* Foreground - Person Image */}
                <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                  <div className="relative w-full h-[90%] transition-transform duration-500 ease-out group-hover:scale-105">
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      fill
                      className="object-cover object-bottom"
                    />
                  </div>
                </div>

                {/* Info Overlay - Glassmorphism Card */}
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
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
