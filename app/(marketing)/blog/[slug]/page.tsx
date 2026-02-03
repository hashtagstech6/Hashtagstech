import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogPosts, getBlogPostBySlug } from "@/data/blog-posts";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { formatDate } from "@/lib/utils";
import { BlogFeaturedImage, RelatedPostCard } from "@/components/blog/blog-card";

/**
 * Generate static params for all blog posts
 * This enables static generation at build time
 */
export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * Generate metadata for each blog post
 * T079 [US5] Add SEO metadata (title, description, Open Graph tags) to blog pages
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Hashtag Tech",
    };
  }

  return {
    title: post.seoTitle || `${post.title} | Hashtag Tech Blog`,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.seoDescription || post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.mainImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.seoDescription || post.excerpt,
      images: [post.mainImage],
    },
  };
}

/**
 * Revalidation time for ISR (60 seconds)
 * T078 [US5] Implement ISR with 60-second revalidation on blog post detail page
 */
export const revalidate = 60;

/**
 * Blog Post Detail Page Component
 *
 * Displays full blog post content with author info and SEO metadata.
 * T081 [US5] Verify blog post displays full content with author info
 *
 * @example
 * ```tsx
 * // Visited at /blog/building-scalable-ai-agents
 * ```
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Article Header */}
        <article className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <nav className="mb-8" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/" className="hover:text-primary transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>/</li>
                  <li>
                    <Link
                      href="/blog"
                      className="hover:text-primary transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>/</li>
                  <li className="text-foreground font-medium truncate">
                    {post.title}
                  </li>
                </ol>
              </nav>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {post.title}
              </h1>

              {/* Author & Date */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(post.publishedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Featured Image */}
        <div className="container mx-auto px-4 -mt-8">
          <div className="max-w-4xl mx-auto">
            <BlogFeaturedImage src={post.mainImage} alt={post.title} />
          </div>
        </div>

        {/* Article Content */}
        <article className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Excerpt */}
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12">
                {post.excerpt}
              </p>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: post.content.replace(/\n/g, "<br />"),
                  }}
                />
              </div>

              {/* Author Bio */}
              <div className="mt-16 pt-8 border-t border-border">
                <div className="flex items-start gap-6">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {post.author.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {post.author.bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                More Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {getAllBlogPosts()
                  .filter((p) => p.id !== post.id)
                  .slice(0, 3)
                  .map((relatedPost) => (
                    <RelatedPostCard key={relatedPost.id} post={relatedPost} />
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
