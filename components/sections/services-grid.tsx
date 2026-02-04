"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/animations/scroll-reveal";
import MagneticButton from "@/components/ui/magnetic-button";

interface Service {
  _id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  features: string[];
  ctaText: string;
  ctaStyle: "primary" | "secondary";
  order: number;
  icon?: string;
}

/**
 * Services Grid Section Component
 *
 * Fetches services from Sanity CMS API and displays them in a three-column layout.
 */
export default function ServicesGrid() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("/api/services");
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  if (loading) {
    return null; // Or show a loading skeleton
  }

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header - Matching screenshot */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-4">
              Our Popular Services
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Development & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-deep">Marketing</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ScrollReveal key={service._id} direction="up" delay={index * 0.1}>
              <ServiceColumn service={service} index={index} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Individual Service Column Component
 * Matching screenshot layout - no card borders
 */
function ServiceColumn({ service, index }: { service: Service; index: number }) {
  // Middle card in each row (index 1 and 4) gets primary filled button
  const isPrimary = index === 1 || index === 4;

  return (
    <div className="space-y-6 p-6 rounded-lg bg-background border border-border/50 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
      {/* Title */}
      <h3 className="text-xl font-bold text-foreground">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {service.shortDescription}
      </p>

      {/* CTA Button - Outlined for sides, filled for middle */}
      <MagneticButton
        href={`/services/${service.slug}`}
        variant={isPrimary ? "primary" : "outline"}
        className="rounded-full"
      >
        {service.ctaText}
        <ArrowRight className="w-4 h-4" />
      </MagneticButton>

      {/* Features List with Red Checkmarks */}
      <ul className="space-y-3 pt-4">
        {service.features.map((feature, featureIndex) => (
          <li
            key={featureIndex}
            className="flex items-start gap-3 text-sm text-foreground"
          >
            <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
