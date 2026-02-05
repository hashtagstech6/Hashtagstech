import Link from "next/link";
import Heading from "@/components/ui/heading";
import MagneticButton from "@/components/ui/magnetic-button";
import { Home, Search } from "lucide-react";

/**
 * Next.js Not Found Error Page
 *
 * Displayed when a route is not found (404).
 * T152 Add error boundaries for client components
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Large Text */}
        <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>

        {/* Error Title */}
        <Heading level="h1" className="text-3xl md:text-4xl font-bold mb-4">
          Page not found
        </Heading>

        {/* Error Message */}
        <p className="text-muted-foreground text-lg mb-8">
          Sorry, we couldn't find the page you're looking for. The page may have
          been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <MagneticButton href="/" variant="primary">
            <Home className="w-4 h-4" />
            Go home
          </MagneticButton>

          <MagneticButton href="/#services" variant="outline">
            <Search className="w-4 h-4" />
            View Services
          </MagneticButton>
        </div>

        {/* Helpful Links */}
        <div className="mt-12">
          <p className="text-sm text-muted-foreground mb-4">You might be looking for:</p>
          <ul className="flex flex-wrap justify-center gap-4 text-sm">
            <li>
              <Link href="/" className="text-primary hover:underline">
                Homepage
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-primary hover:underline">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-primary hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/career" className="text-primary hover:underline">
                Careers
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
