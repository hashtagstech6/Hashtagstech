import { Metadata } from "next";
import PageHeader from "@/components/layout/page-header";
import { BlogCard } from "@/components/blog/blog-card";
import { getPosts } from "@/sanity/lib/queries";

// Type for Sanity blog post
interface SanityBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  mainImage?: {
    asset?: { _id?: string; url?: string };
    alt?: string;
  };
  author: {
    _id: string;
    name: string;
    slug: string;
    image?: {
      asset?: { _id?: string; url?: string };
      alt?: string;
    };
  };
  categories?: Array<{
    _id: string;
    name?: string;
    slug: string;
    color?: string;
  }>;
  publishedAt: string;
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
 * Revalidation time for ISR (1 hour)
 * Optimized for Next.js 15 caching
 */
export const revalidate = 3600;

/**
 * Blog Listing Page Component
 *
 * Fetches blog posts using cached query utilities.
 * Automatic deduplication across render passes.
 */
export default async function BlogPage() {
  // Using cached query function - automatically deduplicates requests
  const posts = await getPosts();

  return (
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
          {posts && posts.length > 0 ? (
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
          ) : (
            <div className="max-w-4xl mx-auto text-center py-16">
              <p className="text-lg text-muted-foreground">
                No blog posts yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
