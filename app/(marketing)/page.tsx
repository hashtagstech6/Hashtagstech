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

import BackgroundGridRain from "@/components/ui/background-grid-rain";

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
      
      {/* CTA Banner Section (Phase 4) */}
      <CTABanner />
    </>
  );
}
