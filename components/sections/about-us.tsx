"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, Zap, MessageSquare, ShieldCheck, TrendingUp } from "lucide-react";
import ScrollReveal from "@/components/animations/scroll-reveal";
import MagneticButton from "@/components/ui/magnetic-button";
import TiltCard from "@/components/ui/tilt-card";

/**
 * About Us Section Component
 *
 * Highlights Hashtag Tech's mission, values, and unique approach.
 * Layout: Image Left | Content Right
 */

const aboutBenefits = [
  {
    id: "1",
    title: "Rapid Development",
    description: "Accelerated delivery without compromising quality",
    icon: Zap,
  },
  {
    id: "2",
    title: "Transparent Communication",
    description: "Real-time updates and collaborative workflow",
    icon: MessageSquare,
  },
  {
    id: "3",
    title: "Quality Assurance",
    description: "Comprehensive testing and code reviews",
    icon: ShieldCheck,
  },
  {
    id: "4",
    title: "Scalable Solutions",
    description: "Built to grow with your business",
    icon: TrendingUp,
  },
];

export default function AboutUs() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="about-us"
      className="py-20"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Visual */}
          <ScrollReveal>
             {/* Added aspect-square wrapper to constrain height if needed, 
                 but TiltCard usually takes full h/w. 
                 AboutUs image block has 'relative aspect-square' 
                 so we wrap THAT or put TiltCard inside it. 
                 The existing div is "relative aspect-square rounded-2xl ...". 
                 Best to put TiltCard OUTSIDE or INSIDE? 
                 TiltCard returns a motion.div w-full h-full. 
                 So we should replace the wrapping div with:
                 <div className="aspect-square ..."> <TiltCard> <div...image...> </TiltCard> 
                 OR wrap the whole thing. 
                 
                 Let's put TiltCard INSIDE the aspect-ratio container to maintain layout, 
                 and move the 'rounded-2xl overflow-hidden' to the INNER div. 
             */}
            <div className="relative aspect-square">
              <TiltCard>
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-muted/30">
                  <Image
                    src="/images/about-team.png"
                    alt="About Hashtag Tech"
                    fill
                    className="object-contain md:p-8"
                  />
                </div>
              </TiltCard>
            </div>
          </ScrollReveal>

          {/* Right Column - Content */}
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col justify-center h-full">
              {/* Badge */}
              <div className="inline-flex items-center py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 w-fit">
                About Us
              </div>

              {/* Heading */}
              <h2
                id="about-heading"
                className="text-4xl font-bold tracking-tight text-foreground mb-6"
              >
                Who We Are
              </h2>

              {/* Description */}
              <p className="text-lg text-foreground-muted leading-relaxed mb-8">
                We are a team of passionate developers and designers dedicated to
                delivering exceptional digital solutions. Our approach combines agile
                best practices with AI-powered tools to deliver results faster and
                more efficiently.
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {aboutBenefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={benefit.id}
                      className="flex items-start space-x-3"
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-foreground-muted">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                <MagneticButton href="#learn-more" variant="primary">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
