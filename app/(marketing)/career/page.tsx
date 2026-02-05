import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/header";
import PageHeader from "@/components/layout/page-header";
import { formatDate } from "@/lib/utils";
import { MapPin, Briefcase, DollarSign, ArrowRight } from "lucide-react";
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
 * Generate metadata for career page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Careers | Hashtag Tech",
    description:
      "Join our team at Hashtag Tech. We're always looking for talented individuals to help us build amazing software solutions.",
    openGraph: {
      title: "Careers | Hashtag Tech",
      description:
        "Join our team at Hashtag Tech. We're always looking for talented individuals to help us build amazing software solutions.",
      type: "website",
    },
  };
}

/**
 * Revalidation time for ISR (300 seconds = 5 minutes)
 * T086 [US6] Implement ISR with 300-second revalidation on career listing page
 */
export const revalidate = 300;

/**
 * Fetch careers from Sanity API
 */
async function fetchCareers(): Promise<SanityCareer[]> {
  const config = validateSanityConfig();

  if (!config.valid) {
    return [];
  }

  try {
    // Use relative URL for internal API calls (works in dev and production)
    const response = await fetch("/api/careers", {
      next: { revalidate: 300 },
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch from Sanity API:", error);
  }

  return [];
}

/**
 * Career Listing Page Component
 *
 * Displays all active job openings with titles, locations, and types.
 * T089 [US6] Verify career listing shows only active job openings
 *
 * @example
 * ```tsx
 * // Visited at /career
 * ```
 */
export default async function CareerPage() {
  const careers = await fetchCareers();

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Page Header */}
        <PageHeader
          title="Join Our Team"
          description="We're always looking for talented individuals to help us build amazing software solutions. Check out our open positions below."
          pill="Careers"
          breadcrumb={[{ label: "Career" }]}
        />

        {/* Job Listings */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            {careers.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-6">
                {careers.map((career) => (
                  <CareerCard key={career._id} career={career} />
                ))}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto text-center py-16">
                <p className="text-lg text-muted-foreground">
                  No open positions at the moment. Please check back soon!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Why Join Us Section */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Why Work at Hashtag Tech?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Cutting-Edge Tech</h3>
                  <p className="text-muted-foreground">
                    Work with the latest technologies including AI agents,
                    Next.js, and modern frameworks.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Great Team</h3>
                  <p className="text-muted-foreground">
                    Collaborate with talented engineers and designers in a
                    supportive environment.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Growth</h3>
                  <p className="text-muted-foreground">
                    Continuous learning opportunities, conferences, and career
                    advancement paths.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/**
 * Career Card Component
 */
function CareerCard({ career }: { career: SanityCareer }) {
  return (
    <Link
      href={`/career/${career.slug}`}
      className="group relative block bg-white rounded-2xl p-6 md:p-8 border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden no-underline hover:no-underline"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
        <div className="flex-1 space-y-4">
          {/* Title - No Underline */}
          <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors no-underline">
            {career.title}
          </h3>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 text-xs font-medium">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{career.department}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>{career.location}</span>
            </div>

            <div
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                career.type === "Remote"
                  ? "bg-green-50 text-green-700 border border-green-200/50"
                  : career.type === "Full-time"
                  ? "bg-blue-50 text-blue-700 border border-blue-200/50"
                  : "bg-purple-50 text-purple-700 border border-purple-200/50"
              }`}
            >
              {career.type}
            </div>

            {career.salary && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 text-xs font-medium">
                <DollarSign className="w-3.5 h-3.5" />
                <span>
                  {career.salary.min?.toLocaleString()} -{" "}
                  {career.salary.max?.toLocaleString()} {career.salary.currency}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Date & Arrow */}
        <div className="flex flex-col md:items-end justify-between gap-4">
           <div className="text-xs text-muted-foreground font-medium">
              Posted {formatDate(career.publishedAt)}
           </div>

           {/* Animated Arrow Button */}
           <div className="hidden md:flex items-center gap-2 text-primary font-semibold text-sm opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Apply Now
              <ArrowRight className="w-4 h-4" />
           </div>
        </div>
      </div>

      {/* Decorative gradient blob on hover */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Link>
  );
}
