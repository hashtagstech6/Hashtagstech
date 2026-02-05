"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import MagneticButton from "@/components/ui/magnetic-button";
import TiltCard from "@/components/ui/tilt-card";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Hero Section Component
 *
 * Two-column layout:
 * - Left side (50%): Location badge, headline with rotating word, CTA button
 * - Right side (50%): Illustration placeholder
 *
 * Features:
 * - Rotating typing effect on the red accent word
 * - "AI Powered Agency" on one line on mobile
 * - Proper text wrapping
 */

// Words to rotate through with typing effect
const rotatingWords = ["Application", "Development", "Marketing", "Solutions", "Innovation"];

export default function Hero() {
  const illustrationRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Typing effect for rotating words
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(rotatingWords[0] || "");
      return;
    }

    const currentWord = rotatingWords[currentWordIndex] || "";
    const typeSpeed = isDeleting ? 50 : 100;
    const pauseTime = 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else {
          // Finished typing, pause then start deleting
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWordIndex, prefersReducedMotion]);

  // Illustration animation
  useEffect(() => {
    if (!illustrationRef.current || prefersReducedMotion) return;

    gsap.fromTo(
      illustrationRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", delay: 0.5 }
    );
  }, [prefersReducedMotion]);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center pt-16 lg:pt-8">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Text Content - 50% */}
          <div className="space-y-2">
            {/* Location Badge */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Registered & Operating in</span>
              <span className="font-semibold text-foreground">DXB, MUSCAT & NYC</span>
              <MapPin className="w-4 h-4 text-primary" />
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold leading-snug sm:text-5xl lg:text-6xl pb-1">
                {/* On mobile: single line, on desktop: can wrap */}
                <span className="text-foreground whitespace-nowrap sm:whitespace-normal">AI Powered Agency</span>
                <br />
                <span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-deep inline-block min-w-[200px] pb-1 leading-normal"
                >
                  {displayText}
                  <span className="text-primary animate-pulse">|</span>
                </span>
              </h1>
            </div>

            {/* Subtext */}
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Transform your business with cutting-edge web, app, and AI solutions that deliver real results.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <MagneticButton href="/services" variant="primary">
                OUR SERVICES
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>

          {/* Illustration - 50% */}
          <div
            ref={illustrationRef}
            className="relative flex justify-center"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <div className="relative aspect-square w-full max-w-[700px]">
              <TiltCard>
                <div className="relative w-full h-full">
                  <Image
                    src="/images/hero-team.png"
                    alt="Hashtag Tech team illustration"
                    fill
                    className={`object-contain transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    onLoad={() => setIsLoading(false)}
                  />
                  {isLoading && (
                    <Skeleton className="absolute inset-0 w-full h-full rounded-2xl bg-muted z-10" />
                  )}
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
