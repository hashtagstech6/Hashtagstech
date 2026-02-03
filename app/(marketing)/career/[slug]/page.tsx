import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCareers, getCareerBySlug } from "@/data/careers";
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

/**
 * Generate static params for all career pages
 */
export async function generateStaticParams() {
  const careers = getAllCareers();
  return careers.map((career) => ({
    slug: career.slug,
  }));
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
  const career = getCareerBySlug(slug);

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
 * Revalidation time for ISR (300 seconds = 5 minutes)
 * T086 [US6] Implement ISR with 300-second revalidation on career detail page
 */
export const revalidate = 300;

/**
 * Career Detail Page Component
 *
 * Displays full job posting with description, requirements, and benefits.
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
  const career = getCareerBySlug(slug);

  if (!career) {
    notFound();
  }

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
                    {career.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {/* Department */}
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{career.department}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{career.location}</span>
                    </div>

                    {/* Type */}
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        career.type === "Remote"
                          ? "bg-green-100 text-green-700"
                          : career.type === "Full-time"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {career.type}
                    </div>

                    {/* Posted Date */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Posted {formatDate(career.publishedAt)}</span>
                    </div>

                    {/* Salary */}
                    {career.salary && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          {career.salary.min?.toLocaleString()} -{" "}
                          {career.salary.max?.toLocaleString()}{" "}
                          {career.salary.currency}/year
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Apply Button */}
                <Button size="lg" className="md:self-start">
                  Apply Now
                </Button>
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
                    <div
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: career.description.replace(/\n/g, "<br />"),
                      }}
                    />
                  </div>

                  {/* Requirements */}
                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                    <ul className="space-y-3">
                      {career.requirements.map((req, index) => (
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
                      {career.benefits.map((benefit, index) => (
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
                            career.title
                          )}&url=${encodeURIComponent(
                            `https://hashtagstech.com/career/${career.slug}`
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
                            `https://hashtagstech.com/career/${career.slug}`
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
                  href="mailto:careers@hashtagstech.com"
                  className="underline hover:no-underline"
                >
                  careers@hashtagstech.com
                </a>
                . We'll get back to you within a week.
              </p>
              <Button size="lg" variant="white" asChild>
                <a href="mailto:careers@hashtagstech.com">
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
