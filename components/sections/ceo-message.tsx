"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Facebook, Linkedin, Instagram, Github, Youtube, ArrowRight, Globe } from "lucide-react";
import ScrollReveal from "@/components/animations/scroll-reveal";
import MagneticButton from "@/components/ui/magnetic-button";
import TiltCard from "@/components/ui/tilt-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PortableText } from "@portabletext/react";

interface CeoData {
  _id: string;
  name: string;
  sectionTitle?: string;
  photo?: {
    asset?: { url?: string };
    alt?: string;
  };
  message?: any; // Portable Text array or string fallback
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
  sectionTitle: "Message From The Leadership",
  message: [
    {
      _type: "block",
      style: "h2",
      children: [
        { _type: "span", text: "Building the future\nthrough " },
        { _type: "span", marks: ["em"], text: "intelligent" },
        { _type: "span", text: " innovation" },
      ],
    },
    {
      _type: "block",
      style: "normal",
      children: [
        { _type: "span", text: "Welcome. I'm proud to lead a team that doesn't simply follow industry trends — we set them. Since founding this company, our north star has been clear: " },
        { _type: "span", marks: ["strong"], text: "harness the power of Artificial Intelligence to solve real problems" },
        { _type: "span", text: " for businesses, entrepreneurs, and the communities they serve." },
      ],
    },
    {
      _type: "block",
      style: "blockquote",
      children: [
        { _type: "span", text: "\"We don't just partner with industry leaders — we help create them.\"" },
      ],
    },
    {
      _type: "block",
      style: "normal",
      children: [
        { _type: "span", text: "Every day, our team works relentlessly at the frontier of AI and emerging technology. We believe that staying ahead isn't a luxury — it's a responsibility we owe to every client, every partner, and every stakeholder who trusts us with their future." },
      ],
    },
    {
      _type: "block",
      style: "normal",
      children: [
        { _type: "span", text: "Our " },
        { _type: "span", marks: ["strong"], text: "Vision 2030" },
        { _type: "span", text: " is bold by design: to grow into a global technology leader, generate hundreds of high-quality jobs, and become the definitive name in AI-powered solutions. We are not waiting for the future — we are actively building it, one breakthrough at a time." },
      ],
    },
    {
      _type: "block",
      style: "normal",
      children: [
        { _type: "span", text: "I invite you to explore what we've built, meet the people behind it, and discover how we can grow together. " },
        { _type: "span", marks: ["strong"], text: "Excellence is not our destination — it's our standard." },
      ],
    },
  ],
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
                        <p className="text-sm font-bold tracking-widest uppercase mb-4 text-primary">
                          {data.sectionTitle || "A MESSAGE FROM LEADERSHIP"}
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight mb-6">
                          {data.name}
                        </h2>
                    </div>

                    <div className="text-base md:text-lg text-foreground-muted leading-relaxed space-y-6 text-left">
                        {typeof data.message === "string" ? (
                          <p>{data.message}</p>
                        ) : (
                          <PortableText 
                            value={data.message} 
                            components={{
                              block: {
                                h2: ({children}) => <h2 className="text-4xl md:text-5xl lg:text-[2.75rem] font-medium text-foreground tracking-tight mb-8 font-serif leading-tight">{children}</h2>,
                                blockquote: ({children}) => (
                                  <div className="border-l-4 border-primary bg-muted p-6 my-8">
                                    <p className="text-lg md:text-xl italic text-foreground font-serif">
                                      {children}
                                    </p>
                                  </div>
                                ),
                                normal: ({children}) => <p>{children}</p>,
                              },
                              marks: {
                                strong: ({children}) => <strong className="text-foreground font-semibold">{children}</strong>,
                                em: ({children}) => <span className="italic text-primary">{children}</span>,
                              }
                            }}
                          />
                        )}
                        
                        {data.consultationText && (
                          <p className="font-bold text-foreground pt-4">
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
