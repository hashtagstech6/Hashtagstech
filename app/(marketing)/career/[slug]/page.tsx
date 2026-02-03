import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCareers, getCareerBySlug } from "@/data/careers";
import type { Career } from "@/types/career";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { formatDate } from "@/lib/utils";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PortableText from "@/components/blog/portable-text";
import { validateSanityConfig } from "@/sanity/env";

// Type for Sanity career from API
interface SanityCareer {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  description: any; // Portable Text
  requirements: string[];
  benefits: string[];
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
  isActive: boolean;
  publishedAt: string;
  applicationUrl?: string;
  applicationEmail?: string;
}

/**
 * Generate static params for all career pages
 */
export async function generateStaticParams() {
  // If Sanity is configured, fetch slugs from API
  const config = validateSanityConfig();

  if (config.valid) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/careers`, {
        next: { revalidate: 300 },
      });

      if (response.ok) {
        const careers = await response.json();
        return careers.map((career: SanityCareer) => ({
          slug: career.slug,
        }));
      }
    } catch {
      // Fall through to hardcoded data
    }
  }

  // Fall back to hardcoded data
  const careers = getAllCareers();
  return careers.map((career) => ({
    slug: career.slug,
  }));
}

/**
 * Fetch career by slug from Sanity or hardcoded data
 */
async function fetchCareer(slug: string): Promise<SanityCareer | ReturnType<typeof getCareerBySlug> | null> {
  const config = validateSanityConfig();

  // Try Sanity API first
  if (config.valid) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/careers/${slug}`,
        { next: { revalidate: 300 } }
      );

      if (response.ok) {
        const career = await response.json();
        return career;
      }
    } catch {
      // Fall through to hardcoded data
    }
  }

  // Fall back to hardcoded data
  return getCareerBySlug(slug) || null;
}

/**
 * Generate metadata for each career page
 * T088 [US6] Add SEO metadata to career pages
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const career = await fetchCareer(slug);

  if (!career) {
    return {
      title: "Job Not Found | Hashtag Tech",
    };
  }

  const isSanityData = !("id" in career) && "_id" in career;
  const title = career.title;
  const location = isSanityData ? (career as SanityCareer).location : (career as Career).location;
  const type = isSanityData ? (career as SanityCareer).type : (career as Career).type;

  return {
    title: `${title} | Careers at Hashtag Tech`,
    description: `Apply for ${title} at Hashtag Tech. ${type} position in ${location}.`,
    openGraph: {
      title,
      description: `Apply for ${title} at Hashtag Tech.`,
      type: "website",
    },
  };
}

/**
 * Revalidation time for ISR (300 seconds = 5 minutes)
 * T086 [US6] Implement ISR with 300-second revalidation on career detail page
 */
export const revalidate = 300;

/**
 * Career Detail Page Component
 *
 * Displays full job posting with description, requirements, and benefits.
 * Supports both Sanity CMS (with Portable Text) and hardcoded data.
 * T090 [US6] Verify job posting displays full description, requirements, benefits
 *
 * @example
 * ```tsx
 * // Visited at /career/senior-full-stack-developer
 * ```
 */
export default async function CareerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const career = await fetchCareer(slug);

  if (!career) {
    notFound();
  }

  // Check if this is Sanity data (has Portable Text description) or hardcoded data
  const isSanityData = !("id" in career) && ("_id" in career || Array.isArray((career as SanityCareer).description));

  // Normalize data for rendering with proper type assertions
  const title = career.title;
  const department = isSanityData ? (career as SanityCareer).department : (career as Career).department;
  const location = isSanityData ? (career as SanityCareer).location : (career as Career).location;
  const type = isSanityData ? (career as SanityCareer).type : (career as Career).type;
  const publishedAt = isSanityData ? (career as SanityCareer).publishedAt : (career as Career).publishedAt;
  const salary = isSanityData ? (career as SanityCareer).salary : (career as Career).salary;
  const requirements = isSanityData ? (career as SanityCareer).requirements : (career as Career).requirements;
  const benefits = isSanityData ? (career as SanityCareer).benefits : (career as Career).benefits;
  const applicationUrl = isSanityData ? (career as SanityCareer).applicationUrl : undefined;
  const applicationEmail = isSanityData ? (career as SanityCareer).applicationEmail : undefined;
  const description = isSanityData ? (career as SanityCareer).description : null;
  const hardcodedDescription = !isSanityData ? (career as Career).description : "";

  // Determine application email
  const applyEmail = applicationEmail || "careers@hashtagstech.com";

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Back Button */}
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/career"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Careers
            </Link>
          </div>
        </div>

        {/* Job Header */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div className="flex-1">
                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {/* Department */}
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{department}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{location}</span>
                    </div>

                    {/* Type */}
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        type === "Remote"
                          ? "bg-green-100 text-green-700"
                          : type === "Full-time"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {type}
                    </div>

                    {/* Posted Date */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Posted {formatDate(publishedAt)}</span>
                    </div>

                    {/* Salary */}
                    {salary && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          {salary.min?.toLocaleString()} -{" "}
                          {salary.max?.toLocaleString()}{" "}
                          {salary.currency}
                          {isSanityData && "period" in (career as SanityCareer).salary!
                            ? `/${(career as SanityCareer).salary!.period}`
                            : "/year"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Apply Button */}
                {applicationUrl ? (
                  <Button size="lg" className="md:self-start" asChild>
                    <a href={applicationUrl} target="_blank" rel="noopener noreferrer">
                      Apply Now
                    </a>
                  </Button>
                ) : (
                  <Button size="lg" className="md:self-start" asChild>
                    <a href={`mailto:${applyEmail}`}>
                      Apply Now
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Job Details */}
        <section className="py-12 md:py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                  {/* Description */}
                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">About the Role</h2>
                    {isSanityData ? (
                      <div className="prose prose-lg max-w-none">
                        <PortableText value={description} />
                      </div>
                    ) : (
                      <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: hardcodedDescription.replace(/\n/g, "<br />"),
                        }}
                      />
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                    <ul className="space-y-3">
                      {requirements.map((req: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Benefits */}
                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Benefits</h2>
                    <ul className="space-y-3">
                      {benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Share */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Share this role</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`https://twitter.com/intent/tweet?text=Check+out+this+job+opening+at+Hashtag+Tech:+${encodeURIComponent(
                            title
                          )}&url=${encodeURIComponent(
                            `https://hashtagstech.com/career/${slug}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Twitter
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                            `https://hashtagstech.com/career/${slug}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LinkedIn
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Apply?
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Send your resume and cover letter to{" "}
                <a
                  href={`mailto:${applyEmail}`}
                  className="underline hover:no-underline"
                >
                  {applyEmail}
                </a>
                . We'll get back to you within a week.
              </p>
              <Button size="lg" variant="white" asChild>
                <a href={`mailto:${applyEmail}`}>
                  Apply via Email
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
