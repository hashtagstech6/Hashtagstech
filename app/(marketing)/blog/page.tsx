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
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No blog posts available yet. Check back soon!
                </p>
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
