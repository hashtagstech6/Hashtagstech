import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import JobShareButton from "@/components/career/job-share-button";
import PortableText from "@/components/blog/portable-text";
import { getCareerBySlug, getAllCareerSlugs } from "@/sanity/lib/queries";

// Type for Sanity career
interface SanityCareer {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  description: any;
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
  const careers = await getAllCareerSlugs();
  return careers.map((career) => ({
    slug: career.slug,
  }));
}

/**
 * Generate metadata for each career page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const career = await getCareerBySlug(slug);

  if (!career) {
    return {
      title: "Job Not Found | Hashtag Tech",
    };
  }

  return {
    title: `${career.title} | Careers at Hashtag Tech`,
    description: `Apply for ${career.title} at Hashtag Tech. ${career.type} position in ${career.location}.`,
    openGraph: {
      title: career.title,
      description: `Apply for ${career.title} at Hashtag Tech.`,
      type: "website",
    },
  };
}

/**
 * Revalidation time for ISR (30 minutes)
 */
export const revalidate = 1800;

/**
 * Career Detail Page Component
 *
 * Fetches career using cached query utilities.
 * Automatic deduplication across render passes.
 */
export default async function CareerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Using cached query function - automatically deduplicates requests
  const career = await getCareerBySlug(slug);

  if (!career) {
    notFound();
  }

  // Normalize data for rendering
  const title = career.title;
  const department = career.department;
  const location = career.location;
  const type = career.type;
  const publishedAt = career.publishedAt;
  const salary = career.salary;
  const requirements = career.requirements || [];
  const benefits = career.benefits || [];
  const applicationUrl = career.applicationUrl;
  const applicationEmail = career.applicationEmail;
  const description = career.description;

  // Determine application email
  const applyEmail = applicationEmail || "careers@hashtagstech.com";

  return (
    <>
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
                        {salary?.period ? `/${salary.period}` : "/year"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Apply Button */}
              {applicationUrl ? (
                <Button size="lg" className="md:self-start bg-primary hover:bg-primary/90 text-white border-none" asChild>
                  <a href={applicationUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white no-underline">
                    Apply Now
                  </a>
                </Button>
              ) : (
                <Button size="lg" className="md:self-start bg-primary hover:bg-primary/90 text-white border-none" asChild>
                  <a href={`mailto:${applyEmail}`} className="text-white hover:text-white no-underline">
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
                  {description && description.length > 0 ? (
                    <div className="prose prose-lg max-w-none">
                      <PortableText value={description} />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No description available.</p>
                  )}
                </div>

                {/* Requirements */}
                {requirements.length > 0 && (
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
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Benefits */}
                {benefits.length > 0 && (
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
                )}

                {/* Share */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Share this role</h2>
                  <div className="flex gap-2">
                    <JobShareButton slug={slug} />
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
                className="text-white underline hover:no-underline font-semibold"
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
    </>
  );
}
