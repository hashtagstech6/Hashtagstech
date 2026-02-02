"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import MagneticButton from "@/components/ui/magnetic-button";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Hero Section Component
 *
 * Two-column layout:
 * - Left side (60%): Location badge, headline with rotating word, CTA button
 * - Right side (40%): Illustration placeholder
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
  const typingRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12 items-center">
          {/* Text Content - 60% */}
          <div className="lg:col-span-3 space-y-6">
            {/* Location Badge */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Registered & Operating in</span>
              <span className="font-semibold text-foreground">DXB, MUSCAT & NYC</span>
              <MapPin className="w-4 h-4 text-primary" />
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold leading-snug sm:text-5xl lg:text-6xl pb-2">
                {/* On mobile: single line, on desktop: can wrap */}
                <span className="text-foreground whitespace-nowrap sm:whitespace-normal">AI Powered Agency</span>
                <br />
                <span 
                  ref={typingRef}
                  className="text-primary inline-block min-w-[200px]"
                >
                  {displayText}
                  <span className="animate-pulse">|</span>
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

          {/* Illustration - 40% */}
          <div
            ref={illustrationRef}
            className="lg:col-span-2 relative"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <div className="relative aspect-square">
              <Image
                src="/placeholder.svg"
                alt="Hashtag Tech team illustration"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
