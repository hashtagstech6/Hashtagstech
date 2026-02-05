import { Metadata } from "next";
import Header from "@/components/layout/header";
import PageHeader from "@/components/layout/page-header";
import { BlogCard } from "@/components/blog/blog-card";
import { validateSanityConfig } from "@/sanity/env";

// Type for Sanity blog post from API
interface SanityBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;  // Can be null/undefined
  mainImage?: {
    asset?: {
      _id?: string;
      url?: string;
    };
    alt?: string;
  } | null;  // Can be null/undefined
  author: {
    _id: string;
    name: string;
    slug: string;
    image?: {
      asset?: {
        _id?: string;
        url?: string;
      };
      alt?: string;
    } | null;  // Can be null/undefined
  };
  categories?: Array<{
    _id: string;
    name?: string;
    slug: string;
    color?: string;
  }>;  // Can be null/undefined
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
 * Fetch blog posts from Sanity API
 */
async function fetchBlogPosts(): Promise<SanityBlogPost[]> {
  const config = validateSanityConfig();

  if (!config.valid) {
    return [];
  }

  try {
    // Use relative URL for internal API calls (works in dev and production)
    const response = await fetch("/api/posts", {
      next: { revalidate: 60 },
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
 * Blog Listing Page Component
 *
 * Displays all blog posts with excerpts, dates, categories, and featured images.
 * Uses ISR for performance optimization.
 *
 * @example
 * ```tsx
 * // Visited at /blog
 * ```
 */
export default async function BlogPage() {
  const posts = await fetchBlogPosts();

  if (posts.length === 0) {
    return null;
  }

  return (
    <>


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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {posts.map((post) => {
                const adaptedPost = {
                  id: post._id,
                  title: post.title,
                  slug: post.slug,
                  excerpt: post.excerpt || "",
                  mainImage: post.mainImage?.asset?.url || "/placeholder.svg",
                  content: "",
                  author: {
                    id: post.author._id,
                    name: post.author.name,
                    slug: post.author.slug,
                    image: post.author.image?.asset?.url || "/placeholder.svg",
                    bio: "",
                  },
                  categories: post.categories?.map((cat) => ({
                    id: cat._id,
                    name: cat.name || "",
                    slug: cat.slug,
                  })) || [],
                  publishedAt: post.publishedAt,
                };
                return <BlogCard key={post._id} post={adaptedPost} />;
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
