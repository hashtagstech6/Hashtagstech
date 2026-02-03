"use client";

import { aiServices } from "@/data/ai-services";
import { Check, ArrowRight } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "@/components/animations/scroll-reveal";
import MagneticButton from "@/components/ui/magnetic-button";

/**
 * AI Services Section Component
 *
 * Three-column layout matching screenshot (6.png):
 * - "Your Partner In AI Transformation" subtitle
 * - "10x Your Business with AI!" main heading
 * - 3 columns: AI Voice Agents, AI Smart Chatbots, Custom AI Agents
 * - Each column has title with numbered badge, description, features with red checkmarks
 * - No card borders - clean flat design
 *
 * @example
 * ```tsx
 * <AIServices />
 * ```
 */
export default function AIServices() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header - Matching screenshot */}
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-4">
              Your Partner In AI Transformation
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              10x Your Business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-deep">AI!</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* AI Services Grid - 3 Columns */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {aiServices.map((service, index) => (
            <AIServiceColumn key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Chess CTA Section - Integrated for consistent spacing */}
        <div className="mt-8">
          <ScrollReveal>
            <div className="bg-white rounded-lg border border-border/30 shadow-sm p-4 md:p-2">
              <div className="flex flex-col md:flex-row items-center md:px-2  gap-6 md:gap-10">
                {/* Left - Chess Knight Image */}
                <div className="flex-shrink-0">
                  <div className="w-60 h-60 md:w-24 md:h-24 relative">
                    <Image
                      src="/placeholder.svg"
                      alt="Chess Knight"
                      fill
                      className="object-cover md:object-contain"
                    />
                  </div>
                </div>

                {/* Middle - Text Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    Do You Want Us To Checkmate Your Software Challenges?
                  </h3>
                  <p className="text-base md:text-lg text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-deep font-medium">
                    Get Call from FREYA our AI Assistant Now Within 60 Seconds!!
                  </p>
                </div>

                {/* Right - CTA Button */}
                <div className="flex-shrink-0 md:p-8">
                  <MagneticButton href="/contact" variant="primary" className="px-8">
                    GET CALL NOW
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/**
 * Individual AI Service Column Component
 * Clean layout without card borders - matching screenshot
 */
function AIServiceColumn({
  service,
  index,
}: {
  service: (typeof aiServices)[0];
  index: number;
}) {
  return (
    <ScrollReveal direction="up" delay={index * 0.1}>
      <div className="h-full flex flex-col space-y-6 p-6 rounded-lg bg-background border border-border/50 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
        {/* Title with Badge */}
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-foreground">
            {service.title}
          </h3>
          {/* Numbered Badge */}
          <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary to-primary-deep text-primary-foreground text-sm font-bold rounded">
            {service.number}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {service.shortDescription}
        </p>

        {/* Features List with Red Checkmarks */}
        <ul className="space-y-3">
          {service.features.map((feature, featureIndex) => (
            <li
              key={featureIndex}
              className="flex items-start gap-3 text-sm text-foreground"
            >
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </ScrollReveal>
  );
}
