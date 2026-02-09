import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { formatDate } from "@/lib/utils";
import { BlogFeaturedImage, RelatedPostCard } from "@/components/blog/blog-card";
import PortableText from "@/components/blog/portable-text";
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from "@/sanity/lib/queries";

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
  content?: any; // Portable Text array, can be null/undefined
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
    bio?: string;
    jobTitle?: string;
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
 * Generate static params for all blog posts
 */
export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
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
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Hashtag Tech",
    };
  }

  const title = post.title;
  const excerpt = post.excerpt || "";
  const imageUrl = post.mainImage?.asset?.url || "";
  const authorName = post.author.name;
  const publishedAt = post.publishedAt;

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

/**
 * Allow dynamic params for blog posts
 * This enables ISR to generate pages for new posts added after build
 */
export const dynamicParams = true;

/**
 * Revalidation time for ISR (1 hour)
 * Optimized for Next.js 15 caching
 */
export const revalidate = 3600;

/**
 * Blog Post Detail Page Component
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Using cached query function - automatically deduplicates requests
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch related posts using cached query function
  const relatedPosts = await getRelatedPosts(post._id, 3);

  // Normalize data
  const title = post.title;
  const excerpt = post.excerpt;
  const categories = post.categories;
  const author = post.author;
  const publishedAt = post.publishedAt;
  const authorImage = author?.image?.asset?.url || "/placeholder.svg";
  const authorBio = author?.bio || "";
  const mainImageUrl = post.mainImage?.asset?.url || "/placeholder.svg";
  const content = post.content;
  const postId = post._id;

  return (
    <>
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
              {categories && categories.length > 0 && (
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
              )}

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
              {excerpt && (
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12">
                  {excerpt}
                </p>
              )}

              {/* Content */}
              {content ? (
                <div className="prose prose-lg max-w-none">
                  <PortableText value={content} />
                </div>
              ) : null}

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
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-muted">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  More Articles
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {relatedPosts.filter(Boolean).map((relatedPost) => {
                    const adaptedPost = {
                      id: relatedPost._id,
                      title: relatedPost.title,
                      slug: relatedPost.slug,
                      excerpt: relatedPost.excerpt || "",
                      mainImage: relatedPost.mainImage?.asset?.url || "/placeholder.svg",
                      content: "",
                      author: {
                        id: relatedPost.author._id,
                        name: relatedPost.author.name,
                        slug: relatedPost.author.slug,
                        image: relatedPost.author.image?.asset?.url || "/placeholder.svg",
                        bio: "",
                      },
                      categories: relatedPost.categories?.map((cat) => ({
                        id: cat._id,
                        name: cat.name || "",
                        slug: cat.slug,
                      })) || [],
                      publishedAt: relatedPost.publishedAt,
                    };
                    return <RelatedPostCard key={relatedPost._id} post={adaptedPost} />;
                  })}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
