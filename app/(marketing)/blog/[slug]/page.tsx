import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogPosts, getBlogPostBySlug } from "@/data/blog-posts";
import type { BlogPost } from "@/types/blog";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { formatDate } from "@/lib/utils";
import { BlogFeaturedImage, RelatedPostCard } from "@/components/blog/blog-card";
import PortableText from "@/components/blog/portable-text";
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
  content: any; // Portable Text array
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
    bio?: string;
    jobTitle?: string;
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
 * Generate static params for all blog posts
 */
export async function generateStaticParams() {
  const config = validateSanityConfig();

  if (config.valid) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/posts`, {
        next: { revalidate: 60 },
      });

      if (response.ok) {
        const posts: SanityBlogPost[] = await response.json();
        return posts.map((post) => ({
          slug: post.slug,
        }));
      }
    } catch {
      // Fall through to hardcoded data
    }
  }

  // Fall back to hardcoded data
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * Fetch blog post by slug from Sanity or hardcoded data
 */
async function fetchBlogPost(slug: string): Promise<SanityBlogPost | BlogPost | null> {
  const config = validateSanityConfig();

  // Try Sanity API first
  if (config.valid) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/posts/${slug}`,
        { next: { revalidate: 60 } }
      );

      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fall through to hardcoded data
    }
  }

  // Fall back to hardcoded data
  return getBlogPostBySlug(slug) || null;
}

/**
 * Generate metadata for each blog post
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found | Hashtag Tech",
    };
  }

  const title = post.title;
  const excerpt = "excerpt" in post ? post.excerpt : "";
  const imageUrl = typeof post.mainImage === "string"
    ? post.mainImage
    : (post.mainImage as any).asset?.url || "";
  const authorName = "author" in post ? post.author.name : "";
  const publishedAt = "publishedAt" in post ? post.publishedAt : "";

  return {
    title: `${title} | Hashtag Tech Blog`,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      type: "article",
      publishedTime: publishedAt,
      authors: [authorName],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: excerpt,
      images: [imageUrl],
    },
  };
}

export const revalidate = 60;

/**
 * Blog Post Detail Page Component
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Check data type
  const isSanityData = !("id" in post) && "_id" in post;

  // Normalize data with proper type assertions
  const title = post.title;
  const excerpt = isSanityData ? (post as SanityBlogPost).excerpt : (post as BlogPost).excerpt;
  const categories = isSanityData ? (post as SanityBlogPost).categories : (post as BlogPost).categories;
  const author = isSanityData ? (post as SanityBlogPost).author : (post as BlogPost).author;
  const publishedAt = isSanityData ? (post as SanityBlogPost).publishedAt : (post as BlogPost).publishedAt;
  const authorImage = typeof author?.image === "string"
    ? author.image
    : (author as SanityBlogPost["author"])?.image?.asset?.url || "/images/authors/placeholder.jpg";
  const authorBio = author?.bio || "";
  const mainImageUrl = isSanityData
    ? ((post as SanityBlogPost).mainImage as any)?.asset?.url || "/images/blog/placeholder.jpg"
    : (post as BlogPost).mainImage;
  const content = isSanityData ? (post as SanityBlogPost).content : null;
  const hardcodedContent = !isSanityData ? (post as BlogPost).content : "";
  const postId = isSanityData ? (post as SanityBlogPost)._id : (post as BlogPost).id;

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
                    {title}
                  </li>
                </ol>
              </nav>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category: any) => (
                  <Link
                    key={category.id || category._id}
                    href={`/blog/category/${category.slug}`}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {title}
              </h1>

              {/* Author & Date */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={authorImage}
                    alt={author.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-medium">{author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(publishedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Featured Image */}
        <div className="container mx-auto px-4 -mt-8">
          <div className="max-w-4xl mx-auto">
            <BlogFeaturedImage src={mainImageUrl} alt={title} />
          </div>
        </div>

        {/* Article Content */}
        <article className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Excerpt */}
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12">
                {excerpt}
              </p>

              {/* Content */}
              {isSanityData && content ? (
                <div className="prose prose-lg max-w-none">
                  <PortableText value={content} />
                </div>
              ) : (
                <div className="prose prose-lg max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: hardcodedContent.replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
              )}

              {/* Author Bio */}
              <div className="mt-16 pt-8 border-t border-border">
                <div className="flex items-start gap-6">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={authorImage}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {author.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {authorBio}
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
                  .filter((p) => p.id !== postId)
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
