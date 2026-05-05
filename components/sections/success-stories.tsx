"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import MagneticButton from "@/components/ui/magnetic-button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

/**
 * Success Stories Section Component
 *
 * Fetches success stories from Sanity CMS API.
 * Hover reveals image next to the heading.
 */

interface SuccessStory {
  _id: string;
  clientCompany: string;
  slug?: { current: string };
  country?: string;
  featuredImage?: {
    asset?: { url?: string };
    alt?: string;
  };
  excerpt?: string;
}

export default function SuccessStories() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredClient, setHoveredClient] = useState<string | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    async function fetchStories() {
      try {
        console.log("[SuccessStories] Fetching from API...");
        const response = await fetch("/api/success-stories");
        if (!response.ok) throw new Error("Failed to fetch success stories");
        const data = await response.json();
        console.log("[SuccessStories] API response:", data);

        setStories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("[SuccessStories] Error fetching:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, []);


  const toggleMobile = (id: string, slug?: string) => {
    if (window.innerWidth < 1024) {
      setExpandedClient(expandedClient === id ? null : id);
    } else if (slug) {
      router.push(`/work/${slug}`);
    }
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-4 w-32 mb-6 opacity-50" />
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="py-6 border-b border-border/30">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 w-full">
                       <Skeleton className="h-10 w-2/3 md:w-1/3" />
                       <Skeleton className="h-6 w-12 rounded-full opacity-50 hidden md:block" />
                    </div>
                    <Skeleton className="h-6 w-6 rounded-full md:hidden" />
                 </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
             <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  if (stories.length === 0) {
    return null;
  }

  // Map success stories to client format for display
  const clients = stories.map(story => ({
    id: story._id,
    name: story.clientCompany,
    slug: story.slug?.current || "",
    country: story.country || "",
    description: story.excerpt || "",
    imageUrl: story.featuredImage?.asset?.url || "/placeholder.svg",
    alt: story.featuredImage?.alt || `${story.clientCompany} project`,
  }));

  console.log("[SuccessStories] Rendering clients:", clients.length);

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
          {clients.map((client, index) => (
            <div
              key={client.id}
              ref={(el) => { itemRefs.current[client.id] = el; }}
              className="relative"
            >
              {/* Full width hoverable row */}
              <div
                onMouseEnter={() => setHoveredClient(client.id)}
                onMouseLeave={() => setHoveredClient(null)}
                onClick={() => toggleMobile(client.id, client.slug)}
                className="flex items-center cursor-pointer border-b border-border/30 py-6 group"
              >
                {/* Heading */}
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground flex-1">
                  {client.name}
                  {client.country && (
                    <span className="text-base md:text-lg font-normal text-muted-foreground ml-2 uppercase">
                      {client.country}
                    </span>
                  )}
                </h3>

                {/* Mobile expand icon & View button */}
                <div className="flex items-center gap-3">
                  {client.slug && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/work/${client.slug}`);
                      }}
                      className="lg:hidden flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-primary/20"
                    >
                      View
                    </button>
                  )}
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-muted-foreground lg:hidden transition-transform",
                      expandedClient === client.id && "rotate-180"
                    )}
                  />
                  <div className="hidden lg:flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <span className="text-sm font-bold uppercase tracking-wider">View</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

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
                  <div className="aspect-video rounded overflow-hidden bg-muted shadow-xl border border-border/20 relative">
                    <Image
                      src={client.imageUrl || (index === 0 ? "/images/success-case-2.jpg" : (index % 2 === 0 ? "/images/success-case.png" : "/placeholder.svg"))}
                      alt={client.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile expanded dropdown */}
              <div
                className={cn(
                  "lg:hidden overflow-hidden transition-all duration-300",
                  expandedClient === client.id ? "max-h-96 py-4" : "max-h-0"
                )}
              >
                <div className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
                    <Image
                      src={client.imageUrl || (index === 0 ? "/images/success-case-2.jpg" : (index % 2 === 0 ? "/images/success-case.png" : "/placeholder.svg"))}
                      alt={client.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {client.description}
                  </p>
                  {client.slug && (
                    <Link 
                      href={`/work/${client.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all"
                    >
                      View <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* MORE WORKS Button - Centered */}
          <div className="mt-12 flex justify-center">
            <MagneticButton href="/work" variant="outline">
              More Works
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
