"use client";

import React from "react";
import Image from "next/image";
import { Facebook, Linkedin, Instagram, Github, Youtube, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/animations/scroll-reveal";
import MagneticButton from "@/components/ui/magnetic-button";
import TiltCard from "@/components/ui/tilt-card";

export default function CeoMessage() {
  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Column: Image with Tilt Effect */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end perspective-1000">
            <ScrollReveal direction="right">
              <div className="relative w-[350px] h-[400px] md:w-[400px] md:h-[500px] lg:w-[450px] lg:h-[550px]">
                <TiltCard>
                  <div className="relative w-full h-full rounded overflow-visible shadow-lg">
                     {/* Image Container */}
                    <div className="relative w-full h-full rounded overflow-hidden bg-muted">
                        <Image
                            src="/images/ceo-portrait.png"
                            alt="Zain Ul Abideen Baloch - CEO"
                            fill
                            className="object-cover object-top"
                            priority
                        />
                    </div>
                  </div>
                </TiltCard>
              </div>
            </ScrollReveal>
          </div>


          {/* Right Column: Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <ScrollReveal>
                <div className="space-y-6">
                    <div>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-deep font-bold tracking-wide uppercase mb-2">
                        Message From The CEO
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight mb-6">
                        Zain Ul Abideen Baloch
                        </h2>
                    </div>

                    <div className="text-base md:text-lg text-foreground-muted leading-relaxed space-y-4">
                        <p>
                        I am honored to lead an exceptional team committed to delivering outstanding
                        services and achieving our goals with dedication. We take pride in partnering
                        with industry leaders to shape the future. As a forward-thinking company, we
                        are relentlessly working on AI and innovation to stay ahead. With our Vision
                        2030, we aspire to become a tech giant, create hundreds of jobs, and lead the
                        tech industry. Join us on our journey toward excellence!
                        </p>
                        <p className="font-bold text-foreground">
                        Offering 1:1 Discovery Session for Business Owners, Entrepreneurs, and
                        Students seeking expert consultancy. (286 $ for 45 Minutes)
                        </p>
                    </div>

                    <div className="pt-4 flex flex-col lg:flex-row items-center gap-6">
                        <MagneticButton 
                            href="#" 
                            variant="primary"
                        >
                            Pay $286 & Unlock <ArrowRight className="ml-2 w-5 h-5" />
                        </MagneticButton>

                        <div className="flex items-center space-x-4">
                            <a href="#" className="p-2 text-foreground hover:text-primary-deep transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="p-2 text-foreground hover:text-primary-deep transition-colors"><Linkedin className="w-5 h-5" /></a>
                            <a href="#" className="p-2 text-foreground hover:text-primary-deep transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="p-2 text-foreground hover:text-primary-deep transition-colors"><Github className="w-5 h-5" /></a>
                            <a href="#" className="p-2 text-foreground hover:text-primary-deep transition-colors"><Youtube className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
