import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { getClient } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import PageHeader from "@/components/layout/page-header";

interface SuccessStory {
  _id: string;
  clientCompany: string;
  slug: { current: string };
  country?: string;
  featuredImage: {
    asset: { url: string };
    alt: string;
  };
  excerpt: string;
  content: any[];
  _updatedAt: string;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const story = await getStory(params.slug);
  if (!story) return { title: "Story Not Found" };

  return {
    title: `${story.clientCompany} Case Study | Hashtag Tech`,
    description: story.excerpt,
    openGraph: {
      title: `${story.clientCompany} Case Study | Hashtag Tech`,
      description: story.excerpt,
      images: [{ url: story.featuredImage.asset.url }],
    },
  };
}

async function getStory(slug: string): Promise<SuccessStory | null> {
  const client = getClient();
  if (!client) return null;

  return client.fetch(`
    *[_type == "successStory" && slug.current == $slug][0] {
      _id,
      clientCompany,
      slug,
      country,
      featuredImage {
        asset->{ url },
        alt
      },
      excerpt,
      content,
      _updatedAt
    }
  `, { slug }, { next: { tags: ["successStories"] } });
}

export const revalidate = 3600;

export default async function SuccessStoryPage({ params }: { params: { slug: string } }) {
  const story = await getStory(params.slug);

  if (!story) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <PageHeader
        title={story.clientCompany}
        description={story.excerpt}
        pill="Case Study"
        breadcrumb={[
          { label: "Work", href: "/work" },
          { label: story.clientCompany }
        ]}
      />

      <article className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 mb-12 py-6 border-y border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{story.country || "International"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  Updated {new Date(story._updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden mb-16 shadow-2xl">
              <Image
                src={story.featuredImage.asset.url}
                alt={story.featuredImage.alt}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Content */}
            <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl">
              {story.content ? (
                <PortableText 
                  value={story.content} 
                  components={{
                    types: {
                      image: ({ value }: any) => (
                        <div className="my-12 group relative aspect-video rounded-3xl overflow-hidden bg-muted shadow-lg">
                          <Image
                            src={value.asset.url}
                            alt={value.alt || ""}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      ),
                    },
                    block: {
                      h2: ({ children }) => <h2 className="text-3xl md:text-4xl font-bold mt-20 mb-8 text-foreground">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-2xl md:text-3xl font-bold mt-16 mb-6 text-foreground">{children}</h3>,
                      h4: ({ children }) => <h4 className="text-xl font-bold mt-12 mb-4 text-foreground">{children}</h4>,
                      normal: ({ children }) => <p className="text-lg md:text-xl leading-relaxed mb-8 text-muted-foreground/90">{children}</p>,
                      blockquote: ({ children }) => (
                        <blockquote className="italic font-medium text-foreground py-4 my-12 border-l-4">
                          {children}
                        </blockquote>
                      ),
                    },
                    list: {
                      bullet: ({ children }) => <ul className="list-disc pl-8 mb-10 space-y-4 text-muted-foreground">{children}</ul>,
                      number: ({ children }) => <ol className="list-decimal pl-8 mb-10 space-y-4 text-muted-foreground">{children}</ol>,
                    },
                    marks: {
                      bold: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                      italic: ({ children }) => <em className="italic">{children}</em>,
                      link: ({ children, value }) => {
                        const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
                        return (
                          <a 
                            href={value.href} 
                            rel={rel} 
                            className="text-primary font-semibold underline underline-offset-4 decoration-2 hover:text-primary/80 transition-colors"
                          >
                            {children}
                          </a>
                        );
                      },
                    },
                  }}
                />
              ) : (
                <div className="py-20 text-center bg-muted/30 rounded-3xl border border-dashed border-border">
                  <p className="text-muted-foreground italic">
                    Full case study details are currently being updated. <br />
                    Please check back soon or contact us for more information about this project.
                  </p>
                </div>
              )}
            </div>

            {/* Back to Work */}
            <div className="mt-20 pt-10 border-t border-border/50 text-center">
              <Link 
                href="/work"
                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
              >
                <ArrowLeft className="w-5 h-5" /> Back to All Work
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
