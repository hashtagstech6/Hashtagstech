"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import ScrollReveal from "@/components/animations/scroll-reveal";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

/**
 * Testimonials Section Component
 *
 * Single-column centered layout matching screenshot reference (5.png):
 * - Dark background (section-testimonials class)
 * - "Hear from Our Clients" heading with red accent
 * - Single testimonial displayed at a time
 * - 5-star rating, quote, client avatar & info
 * - Left/right navigation arrows
 * - Carousel navigation for cycling through testimonials
 *
 * @example
 * ```tsx
 * <Testimonials />
 * ```
 */

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
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
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

  // Get current testimonial
  const currentTestimonial = testimonials[currentIndex] ?? testimonials[0]!;

  // Carousel navigation
  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="section-testimonials py-20"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section Header - Matching screenshot */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm text-white/60 tracking-wide uppercase mb-4">
              Success Stories
            </p>
            <h2
              id="testimonials-heading"
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4"
            >
              Hear from{" "}
              <span className="text-primary">Our Clients</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Single Testimonial Display - Centered */}
        <ScrollReveal>
          <div className="max-w-4xl mx-auto relative">
            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 p-3 rounded-full border border-white/20 bg-transparent hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              type="button"
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 p-3 rounded-full border border-white/20 bg-transparent hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Testimonial Content - No card border, clean layout */}
            <div className="text-center px-8 md:px-16">
              {/* Star Rating - Centered */}
              <div className="flex justify-center mb-6">
                <StarRating rating={currentTestimonial.rating} />
              </div>

              {/* Quote - Clean text without card */}
              <blockquote className="text-lg md:text-xl text-white/90 leading-relaxed mb-8">
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Client Info - Avatar with name and title */}
              <div className="flex items-center justify-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/20">
                  <Image
                    src={currentTestimonial.image}
                    alt={currentTestimonial.clientName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="text-left">
                  <p className="text-base font-semibold text-white">
                    {currentTestimonial.clientName}
                  </p>
                  <p className="text-sm text-white/60">
                    {currentTestimonial.clientTitle},{" "}
                    {currentTestimonial.clientCompany}
                  </p>
                </div>
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-10">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
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
