"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import ScrollReveal from "@/components/animations/scroll-reveal";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Testimonials Section Component
 *
 * Fetches testimonials from Sanity CMS API.
 * Single-column centered layout matching screenshot reference (5.png):
 * - Dark background (section-testimonials class)
 * - "Hear from Our Clients" heading with red accent
 * - Single testimonial displayed at a time
 * - 5-star rating, quote, client avatar & info
 * - Left/right navigation arrows
 * - Carousel navigation for cycling through testimonials
 */

interface Client {
  _id: string;
  name: string;
  company: string;
  role?: string;
  photo?: {
    asset?: { url?: string };
    alt?: string;
  };
  rating: number;
  quote: string;
  project?: string;
}

/**
 * Render star rating
 */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex space-x-1" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-5 h-5",
            i < rating ? "text-red-600 fill-red-600" : "text-gray-800"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [testimonials, setTestimonials] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch("/api/clients");
        if (!response.ok) throw new Error("Failed to fetch testimonials");
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  // Get current testimonial - no fallback dummy data
  const currentTestimonial = testimonials[currentIndex] ?? testimonials[0];

  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (loading || testimonials.length === 0 || isHovered) return;

    const timer = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, isHovered, loading, testimonials.length]); // Depend on currentIndex to reset timer on manual change

  // Variants for sliding animation
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 1,
    }),
  };

  // Carousel navigation
  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  if (loading || testimonials.length === 0) {
    return null;
  }

  // Map client data to testimonial format
  const displayTestimonial = {
    image: currentTestimonial.photo?.asset?.url || "/placeholder.svg",
    clientName: currentTestimonial.name,
    clientTitle: currentTestimonial.role || "",
    clientCompany: currentTestimonial.company,
    rating: currentTestimonial.rating,
    quote: currentTestimonial.quote,
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="section-testimonials py-20 overflow-hidden" // Added overflow-hidden
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4">
        {/* ... Header ... */}

        {/* Single Testimonial Display - Centered */}
        <ScrollReveal>
          <div className="max-w-4xl mx-auto relative min-h-[420px]"> {/* Min-height for stability */}
            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-20 p-3 rounded-full border border-white/20 bg-transparent hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              type="button"
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-20 p-3 rounded-full border border-white/20 bg-transparent hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Testimonial Content - Animated */}
            <div className="absolute inset-0 overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(_, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);

                    if (swipe < -swipeConfidenceThreshold) {
                      nextTestimonial();
                    } else if (swipe > swipeConfidenceThreshold) {
                      prevTestimonial();
                    }
                  }}
                  className="absolute inset-0 flex flex-col md:flex-row items-center gap-8 md:gap-12 px-8 md:px-20 cursor-grab active:cursor-grabbing"
                >
                  {/* Image - Left Side */}
                  <div className="flex-shrink-0 select-none">
                    <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                      <Image
                        src={displayTestimonial.image}
                        alt={displayTestimonial.clientName}
                        fill
                        className="object-cover"
                        draggable={false}
                      />
                    </div>
                  </div>

                  {/* Content - Right Side */}
                  <div className="flex-1 text-center md:text-left select-none">
                    {/* Star Rating */}
                    <div className="flex justify-center md:justify-start mb-6">
                      <StarRating rating={displayTestimonial.rating} />
                    </div>

                    {/* Quote */}
                    <blockquote className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed mb-8">
                      "{displayTestimonial.quote}"
                    </blockquote>

                    {/* Client Info */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {displayTestimonial.clientName}
                      </h3>
                      <p className="text-sm text-white/60 font-medium">
                        {displayTestimonial.clientTitle}
                        {displayTestimonial.clientCompany && (
                          <span className="opacity-70">
                            , {displayTestimonial.clientCompany}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Dots Indicator - pushed down to not overlap absolute content */}
            <div className="absolute -bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    idx === currentIndex
                      ? "bg-primary"
                      : "bg-white/30 hover:bg-white/50"
                  )}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
