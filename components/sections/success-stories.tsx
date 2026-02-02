"use client";

import { useState, useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import MagneticButton from "@/components/ui/magnetic-button";
import { cn } from "@/lib/utils";

/**
 * Success Stories Section Component
 *
 * Hover reveals image next to the heading
 */

const clients = [
  {
    id: "1",
    name: "Procope AI",
    country: "US",
    description: "AI-powered enterprise solutions",
  },
  {
    id: "2",
    name: "Finaxe",
    country: "GB",
    description: "People Are The Solution",
  },
  {
    id: "3",
    name: "Shift- Application",
    country: "OM",
    description: "Workforce management platform",
  },
  {
    id: "4",
    name: "Refurbly- Vodafone",
    country: "QA",
    description: "Sustainable tech marketplace",
  },
];

export default function SuccessStories() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredClient, setHoveredClient] = useState<string | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const toggleMobile = (id: string) => {
    setExpandedClient(expandedClient === id ? null : id);
  };

  return (
    <section
      ref={sectionRef}
      id="success-stories"
      className="py-16"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <p className="text-sm text-muted-foreground italic mb-6">
          Our Success Stories
        </p>

        {/* Main Content */}
        <div className="relative">
          {clients.map((client) => (
            <div
              key={client.id}
              ref={(el) => { itemRefs.current[client.id] = el; }}
              className="relative"
            >
              {/* Full width hoverable row */}
              <div
                onMouseEnter={() => setHoveredClient(client.id)}
                onMouseLeave={() => setHoveredClient(null)}
                onClick={() => toggleMobile(client.id)}
                className="flex items-center cursor-pointer border-b border-border/30 py-6 group"
              >
                {/* Heading */}
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground flex-1">
                  {client.name}
                  <span className="text-base md:text-lg font-normal text-muted-foreground ml-2 uppercase">
                    {client.country}
                  </span>
                </h3>

                {/* Mobile expand icon */}
                <ChevronDown 
                  className={cn(
                    "w-5 h-5 text-muted-foreground lg:hidden transition-transform",
                    expandedClient === client.id && "rotate-180"
                  )} 
                />

                {/* Desktop floating image - appears on hover */}
                <div
                  className={cn(
                    "hidden lg:block absolute left-[50%] z-50 w-[480px] transition-all duration-200",
                    hoveredClient === client.id 
                      ? "opacity-100 translate-x-0" 
                      : "opacity-0 translate-x-4 pointer-events-none"
                  )}
                  style={{ top: "50%", transform: hoveredClient === client.id ? "translateY(-50%)" : "translateY(-50%) translateX(16px)" }}
                >
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted shadow-xl border border-border/20">
                    <img
                      src="/placeholder.svg"
                      alt={`${client.name} project`}
                      className="w-full h-full object-contain p-3"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile expanded dropdown */}
              <div
                className={cn(
                  "lg:hidden overflow-hidden transition-all duration-300",
                  expandedClient === client.id ? "max-h-48 py-3" : "max-h-0"
                )}
              >
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src="/placeholder.svg"
                    alt={`${client.name} project`}
                    className="w-full h-full object-contain p-3"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* MORE WORKS Button - Centered */}
          <div className="mt-12 flex justify-center">
            <MagneticButton href="#portfolio" variant="outline">
              More Works
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
