"use client";

import { services } from "@/data/services";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/animations/scroll-reveal";
import MagneticButton from "@/components/ui/magnetic-button";

/**
 * Services Grid Section Component
 *
 * Three-column layout matching screenshot (9.png):
 * - "Our Popular Services" subtitle
 * - "Development & Marketing" heading with red accent
 * - 3 columns: Web Development, Social Media Marketing, App Development
 * - Each column has title, description, outlined "Get Started" button, feature list
 * - Middle column (Marketing) has filled red button, others have outlined
 * - Features with red checkmarks
 *
 * @example
 * ```tsx
 * <ServicesGrid />
 * ```
 */
export default function ServicesGrid() {
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
            <ScrollReveal key={service.id} direction="up" delay={index * 0.1}>
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
function ServiceColumn({ service, index }: { service: (typeof services)[0]; index: number }) {
  // Middle card (index 1) gets primary filled button, others get outlined
  const isPrimary = index === 1;

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
