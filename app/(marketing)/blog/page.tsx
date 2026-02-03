import { Metadata } from "next";
import { getAllBlogPosts } from "@/data/blog-posts";
import Header from "@/components/layout/header";
import PageHeader from "@/components/layout/page-header";

import { BlogCard } from "@/components/blog/blog-card";

/**
 * Blog Page Metadata
 */
export const metadata: Metadata = {
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

/**
 * Revalidation time for ISR (60 seconds)
 * T078 [US5] Implement ISR with 60-second revalidation on blog listing page
 */
export const revalidate = 60;

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
export default function BlogPage() {
  const posts = getAllBlogPosts();

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
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>


    </>
  );
}
