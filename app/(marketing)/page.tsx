import { Metadata } from "next";
import Hero from "@/components/sections/hero";
import StatsBar from "@/components/sections/stats-bar";
import ServicesGrid from "@/components/sections/services-grid";
import AIServices from "@/components/sections/ai-services";
import SuccessStories from "@/components/sections/success-stories";
import AboutUs from "@/components/sections/about-us";
import Testimonials from "@/components/sections/testimonials";
import CTABanner from "@/components/sections/cta-banner";
import Partners from "@/components/sections/client-slider";
import GlobalPartners from "@/components/sections/global-partners";
import CeoMessage from "@/components/sections/ceo-message";
import LatestInsights from "@/components/sections/latest-insights";

import BackgroundGridRain from "@/components/ui/background-grid-rain";

/**
 * Homepage Metadata
 * T112 Add homepage metadata (title, description, Open Graph tags) to `app/(marketing)/page.tsx` for SC-015
 */
export const metadata: Metadata = {
  title: "Hashtag Tech | AI-Powered Software Development Agency",
  description:
    "Building world-class web and mobile applications with cutting-edge AI technology. Expert web development, app development, and digital marketing services since 2019.",
  keywords: [
    "web development",
    "app development",
    "AI solutions",
    "software development agency",
    "Hashtag Tech",
    "mobile apps",
    "digital marketing",
    "AI agents",
  ],
  authors: [{ name: "Hashtag Tech" }],
  openGraph: {
    title: "Hashtag Tech | AI-Powered Software Development Agency",
    description:
      "Building world-class web and mobile applications with cutting-edge AI technology. Expert web development, app development, and digital marketing services since 2019.",
    type: "website",
    url: "https://hashtagstech.com",
    siteName: "Hashtag Tech",
    images: [
      {
        url: "/logo-horizontal.webp",
        width: 1200,
        height: 630,
        alt: "Hashtag Tech Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hashtag Tech | AI-Powered Software Development Agency",
    description:
      "Building world-class web and mobile applications with cutting-edge AI technology.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Revalidation time for ISR (3600 seconds = 1 hour)
 * T103 Implement ISR with 3600-second revalidation on homepage
 */
export const revalidate = 3600;

/**
 * Homepage Component
 *
 * Assembles all homepage sections in order:
 * 1. Hero
 * 2. Stats Bar
 * 3. Services Grid
 * 4. AI Services
 * 5. Chess CTA
 * 6. Success Stories
 * 7. DEVMATE
 * 8. Testimonials
 * 9. CTA Banner
 * 10. Partners
 */
export default function HomePage() {
  return (
    <>
      <BackgroundGridRain />
      
      {/* Hero Section */}
      <Hero />

      {/* Stats Bar Section */}
      <StatsBar />

      {/* Success Stories Section (Phase 4) */}
      <SuccessStories />
      
      {/* About Us Section */}
      <AboutUs />

      {/* Global Partners Section */}
      <GlobalPartners />

      {/* AI Services Section (includes Chess CTA) */}
      <AIServices />
      
      {/* Partners Section (Phase 4) */}
      <Partners />

      {/* Testimonials Section (Phase 4) */}
      <Testimonials />

      {/* Services Grid Section */}
      <ServicesGrid />

      {/* CEO Message Section */}
      <CeoMessage />
      
      {/* Latest Blog Insights */}
      <LatestInsights />
      
      {/* CTA Banner Section (Phase 4) */}
      <CTABanner />
    </>
  );
}
