import { Metadata } from "next";
import { getAllBlogPosts } from "@/data/blog-posts";
import Header from "@/components/layout/header";
import PageHeader from "@/components/layout/page-header";
import { BlogCard } from "@/components/blog/blog-card";
import { validateSanityConfig } from "@/sanity/env";

// Type for Sanity blog post from API
interface SanityBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  mainImage: {
    asset: {
      _id: string;
      url: string;
    };
    alt: string;
  };
  author: {
    _id: string;
    name: string;
    slug: string;
    image: {
      asset: {
        _id: string;
        url: string;
      };
      alt: string;
    };
  };
  categories: Array<{
    _id: string;
    name: string;
    slug: string;
    color?: string;
  }>;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

/**
 * Blog Page Metadata
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog | Hashtag Tech",
    description:
      "Read the latest insights on AI, web development, mobile apps, and technology trends from the Hashtag Tech team.",
    openGraph: {
      title: "Blog | Hashtag Tech",
      description:
        "Read the latest insights on AI, web development, mobile apps, and technology trends from the Hashtag Tech team.",
      type: "website",
    },
  };
}

/**
 * Revalidation time for ISR (60 seconds)
 * T078 [US5] Implement ISR with 60-second revalidation on blog listing page
 */
export const revalidate = 60;

/**
 * Fetch blog posts from Sanity API or fall back to hardcoded data
 */
async function fetchBlogPosts(): Promise<Array<SanityBlogPost | ReturnType<typeof getAllBlogPosts>[number]>> {
  const config = validateSanityConfig();

  // Use Sanity if configured, otherwise fall back to hardcoded data
  if (config.valid) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/posts`, {
        next: { revalidate: 60 },
      });

      if (response.ok) {
        const posts = await response.json();
        return posts;
      }
    } catch (error) {
      console.error("Failed to fetch from Sanity API, falling back to hardcoded data:", error);
    }
  }

  // Fall back to hardcoded data
  return getAllBlogPosts();
}

/**
 * Blog Listing Page Component
 *
 * Displays all blog posts with excerpts, dates, categories, and featured images.
 * Uses ISR for performance optimization.
 * Supports both Sanity CMS and hardcoded data.
 *
 * @example
 * ```tsx
 * // Visited at /blog
 * ```
 */
export default async function BlogPage() {
  const posts = await fetchBlogPosts();

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Page Header */}
        <PageHeader
          title="Our Blog"
          description="Insights, tutorials, and thoughts on AI, web development, and technology trends from our expert team."
          pill="Blog & Insights"
          breadcrumb={[{ label: "Blog" }]}
        />

        {/* Blog Posts Grid */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            {posts.length === 0 ? (
              <div className="text-center py-16 max-w-md mx-auto">
                {/* Animated Pencil Icon */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-2 bg-primary/10 rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  No Posts Yet
                </h3>
                
                <p className="text-muted-foreground text-lg mb-6">
                  We&apos;re working on some great content. Stay tuned for our upcoming articles!
                </p>
                
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Subscribe to our newsletter for updates
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {posts.map((post) => {
                  // Handle both Sanity and hardcoded data formats
                  if ("id" in post && typeof post.slug === "string") {
                    // Hardcoded data format
                    return <BlogCard key={post.id} post={post} />;
                  } else {
                    // Sanity data format - convert to BlogCard format
                    const sanityPost = post as SanityBlogPost;
                    const adaptedPost = {
                      id: sanityPost._id,
                      title: sanityPost.title,
                      slug: sanityPost.slug,
                      excerpt: sanityPost.excerpt,
                      mainImage: sanityPost.mainImage.asset?.url || "/images/blog/placeholder.jpg",
                      content: "", // Not needed for listing page
                      author: {
                        id: sanityPost.author._id,
                        name: sanityPost.author.name,
                        slug: sanityPost.author.slug,
                        image: sanityPost.author.image?.asset?.url || "/images/authors/placeholder.jpg",
                        bio: "",
                      },
                      categories: sanityPost.categories.map((cat) => ({
                        id: cat._id,
                        name: cat.name,
                        slug: cat.slug,
                      })),
                      publishedAt: sanityPost.publishedAt,
                    };
                    return <BlogCard key={sanityPost._id} post={adaptedPost} />;
                  }
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
