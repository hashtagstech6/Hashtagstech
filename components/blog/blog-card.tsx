"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";

/**
 * Blog Post Card Component
 *
 * Displays a blog post with featured image, categories, title, excerpt,
 * and author info. Shows a placeholder fallback when the image fails to load.
 *
 * T154 [US5] Add placeholder images for missing assets
 */
export function BlogCard({ post }: { post: BlogPost }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group bg-white rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Featured Image */}
      <Link
        href={`/blog/${post.slug}`}
        className="block aspect-video relative overflow-hidden bg-muted"
      >
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            <svg
              className="w-16 h-16 opacity-20"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 10l4.586-4.586a2 2 0 012.828 0L18 6" />
            </svg>
          </div>
        ) : (
          <Image
            src={post.mainImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        )}
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Categories & Date */}
        <div className="flex items-center justify-between gap-4 mb-4 text-xs font-medium text-muted-foreground">
           <div className="flex flex-wrap gap-2">
            {post.categories.slice(0, 1).map((category) => (
                <span key={category.id} className="text-primary uppercase tracking-wider">
                {category.name}
                </span>
            ))}
           </div>
           <span>{formatDate(post.publishedAt)}</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-muted-foreground mb-6 line-clamp-3 flex-1 leading-relaxed">
          {post.excerpt}
        </p>


      </div>
    </article>
  );
}

/**
 * Related Post Card Component with placeholder fallback
 * T154 [US5] Add placeholder images for missing assets
 */
export function RelatedPostCard({ post }: { post: BlogPost }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            <svg
              className="w-16 h-16 opacity-20"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 10l4.586-4.586a2 2 0 012.828 0L18 6" />
            </svg>
          </div>
        ) : (
          <Image
            src={post.mainImage}
            alt={post.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}

/**
 * Blog Featured Image Component with placeholder fallback
 * T154 [US5] Add placeholder images for missing assets
 */
export function BlogFeaturedImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-muted">
      {imageError ? (
        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
          <svg
            className="w-24 h-24 opacity-20"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 10l4.586-4.586a2 2 0 012.828 0L18 6" />
          </svg>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}
