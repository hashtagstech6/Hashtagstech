"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Facebook, Linkedin, Instagram, Github, Youtube, ArrowRight, Globe } from "lucide-react";
import ScrollReveal from "@/components/animations/scroll-reveal";
import MagneticButton from "@/components/ui/magnetic-button";
import TiltCard from "@/components/ui/tilt-card";
import { Skeleton } from "@/components/ui/skeleton";

interface CeoData {
  _id: string;
  name: string;
  sectionTitle?: string;
  photo?: {
    asset?: { url?: string };
    alt?: string;
  };
  message?: string;
  consultationText?: string;
  consultationPrice?: string;
  consultationButtonText?: string;
  consultationLink?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  githubUrl?: string;
  youtubeUrl?: string;
  websiteUrl?: string;
}

// Fallback data when Sanity is not configured or has no data
const fallbackData: CeoData = {
  _id: "fallback",
  name: "Kamran Khan",
  sectionTitle: "Message From The CEO",
  message:
    "I am honored to lead an exceptional team committed to delivering outstanding services and achieving our goals with dedication. We take pride in partnering with industry leaders to shape the future. As a forward-thinking company, we are relentlessly working on AI and innovation to stay ahead. With our Vision 2030, we aspire to become a tech giant, create hundreds of jobs, and lead the tech industry. Join us on our journey toward excellence!",
  consultationText:
    "Offering 1:1 Discovery Session for Business Owners, Entrepreneurs, and Students seeking expert consultancy. (286 $ for 45 Minutes)",
  consultationButtonText: "Pay $286 & Unlock",
  consultationLink: "#",
};

// Twitter/X icon SVG component
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/**
 * Social link configuration - maps CeoData fields to icon components.
 * Only links with a URL will be rendered.
 */
const socialLinkConfig = [
  { key: "linkedinUrl" as const, icon: Linkedin, label: "LinkedIn" },
  { key: "twitterUrl" as const, icon: XIcon, label: "Twitter" },
  { key: "facebookUrl" as const, icon: Facebook, label: "Facebook" },
  { key: "instagramUrl" as const, icon: Instagram, label: "Instagram" },
  { key: "githubUrl" as const, icon: Github, label: "GitHub" },
  { key: "youtubeUrl" as const, icon: Youtube, label: "YouTube" },
  { key: "websiteUrl" as const, icon: Globe, label: "Website" },
];

export default function CeoMessage() {
  const [ceoData, setCeoData] = useState<CeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    async function fetchCeoData() {
      try {
        const response = await fetch("/api/ceo-section");
        if (!response.ok) throw new Error("Failed to fetch CEO data");
        const data = await response.json();
        if (data) {
          setCeoData(data);
        } else {
          setCeoData(fallbackData);
        }
      } catch (error) {
        console.error("Error fetching CEO section:", error);
        setCeoData(fallbackData);
      } finally {
        setLoading(false);
      }
    }
    fetchCeoData();
  }, []);

  // Use fallback while loading
  const data = ceoData || fallbackData;
  const photoUrl = data.photo?.asset?.url || "/images/ceo-portrait.png";
  const photoAlt = data.photo?.alt || `${data.name} - CEO`;

  // Filter social links - only show those with a URL
  const activeSocialLinks = socialLinkConfig.filter(
    (link) => data[link.key] && data[link.key]!.trim() !== ""
  );

  if (loading) {
    return (
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <Skeleton className="w-[350px] h-[450px] md:w-[400px] md:h-[500px] lg:w-[450px] lg:h-[550px] rounded-xl" />
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Column: Image with Tilt Effect */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end perspective-1000">
            <ScrollReveal direction="right">
              <div className="relative w-[350px] h-[450px] md:w-[400px] md:h-[500px] lg:w-[450px] lg:h-[550px]">
                <TiltCard>
                  <div className="relative w-full h-full rounded overflow-visible shadow-lg">
                     {/* Image Container */}
                    <div className="relative w-full h-full rounded overflow-hidden bg-muted">
                        <Image
                            src={photoUrl}
                            alt={photoAlt}
                            fill
                            className={`object-cover object-top transition-opacity duration-500 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                            priority
                            onLoad={() => setIsImageLoading(false)}
                        />
                        {isImageLoading && (
                            <Skeleton className="absolute inset-0 w-full h-full bg-muted z-10" />
                        )}
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
                        {data.sectionTitle || "Message From The CEO"}
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight mb-6">
                        {data.name}
                        </h2>
                    </div>

                    <div className="text-base md:text-lg text-foreground-muted leading-relaxed space-y-4">
                        <p>{data.message}</p>
                        {data.consultationText && (
                          <p className="font-bold text-foreground">
                            {data.consultationText}
                          </p>
                        )}
                    </div>

                    <div className="pt-4 flex flex-col lg:flex-row items-center gap-6">
                        {data.consultationButtonText && (
                          <MagneticButton 
                              href={data.consultationLink || "#"} 
                              variant="primary"
                          >
                              {data.consultationButtonText} <ArrowRight className="ml-2 w-5 h-5" />
                          </MagneticButton>
                        )}

                        {activeSocialLinks.length > 0 && (
                          <div className="flex items-center space-x-4">
                              {activeSocialLinks.map((social) => {
                                const IconComponent = social.icon;
                                const url = data[social.key];
                                return (
                                  <a
                                    key={social.key}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-foreground hover:text-primary-deep transition-colors"
                                    aria-label={social.label}
                                  >
                                    <IconComponent className="w-5 h-5" />
                                  </a>
                                );
                              })}
                          </div>
                        )}
                    </div>
                </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
