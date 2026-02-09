/**
 * Sanity Query Utilities
 *
 * Centralized, memoized query functions using React's `cache` function.
 * This ensures automatic deduplication across the React render pass and
 * enables efficient data fetching patterns in Next.js 15 App Router.
 *
 * Each query is wrapped with `cache()` to prevent duplicate requests
 * when the same data is needed in multiple components or functions.
 */

import { cache } from "react";
import { sanityFetch } from "./client";

// ============================================================================
// Types
// ============================================================================

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: any;
  mainImage?: {
    asset?: { _id?: string; url?: string };
    alt?: string;
  };
  author: {
    _id: string;
    name: string;
    slug: string;
    bio?: string;
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
  seoTitle?: string;
  seoDescription?: string;
}

interface Career {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  description: any;
  requirements: string[];
  benefits: string[];
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
  isActive: boolean;
  publishedAt: string;
  applicationUrl?: string;
  applicationEmail?: string;
}

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  department?: string;
  photo?: {
    asset?: { _id?: string; url?: string };
    alt?: string;
  };
  image?: {
    asset?: { _id?: string; url?: string };
    alt?: string;
  };
  bio?: string;
  skills?: string[];
  order?: number;
}

// ============================================================================
// Blog Queries (1 hour revalidation)
// ============================================================================

/**
 * Fetch all blog posts with 1-hour cache.
 * Revalidates every hour automatically or via webhook.
 * Tag: 'posts' enables on-demand revalidation.
 */
export const getPosts = cache(async (limit = 10): Promise<BlogPost[]> => {
  return sanityFetch({
    query: `
      *[_type == "post"] | order(publishedAt desc)[0...${limit}] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        mainImage {
          asset-> {
            _id,
            url
          },
          alt
        },
        author-> {
          _id,
          name,
          "slug": slug.current,
          image {
            asset-> {
              _id,
              url
            },
            alt
          }
        },
        categories[]-> {
          _id,
          name,
          "slug": slug.current,
          color
        },
        publishedAt
      }
    `,
    revalidate: 3600, // 1 hour
    tags: ["posts"],
  });
});

/**
 * Fetch a single blog post by slug with 1-hour cache.
 * Uses cache deduplication - multiple calls in same render pass only fetch once.
 * Tag: 'posts' enables on-demand revalidation.
 */
export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const post = await sanityFetch({
    query: `
      *[_type == "post" && slug.current == $slug][0]{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        content,
        mainImage {
          asset-> {
            _id,
            url
          },
          alt
        },
        author-> {
          _id,
          name,
          "slug": slug.current,
          bio,
          image {
            asset-> {
              _id,
              url
            },
            alt
          }
        },
        categories[]-> {
          _id,
          name,
          "slug": slug.current,
          color
        },
        publishedAt,
        seoTitle,
        seoDescription
      }
    `,
    params: { slug },
    revalidate: 3600, // 1 hour
    tags: ["posts", `post:${slug}`],
  });

  return post || null;
});

/**
 * Fetch related posts (optimized - only fetch needed fields).
 * Excludes the current post and limits to specified number.
 * Tag: 'posts' enables on-demand revalidation.
 */
export const getRelatedPosts = cache(async (
  currentPostId: string,
  limit = 3
): Promise<BlogPost[]> => {
  return sanityFetch({
    query: `
      *[_type == "post" && _id != $id] | order(publishedAt desc)[0...${limit}]{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        mainImage {
          asset-> {
            _id,
            url
          },
          alt
        },
        publishedAt
      }
    `,
    params: { id: currentPostId },
    revalidate: 3600, // 1 hour
    tags: ["posts"],
  });
});

/**
 * Fetch all blog posts (for generateStaticParams).
 * Returns minimal data needed for path generation.
 * Tag: 'posts' enables on-demand revalidation.
 */
export const getAllPostSlugs = cache(async (): Promise<Array<{ slug: string }>> => {
  return sanityFetch({
    query: `
      *[_type == "post"]{
        "slug": slug.current
      }
    `,
    revalidate: 3600, // 1 hour
    tags: ["posts"],
  });
});

// ============================================================================
// Career Queries (30 minutes revalidation)
// ============================================================================

/**
 * Fetch all active career openings with 30-minute cache.
 * Job postings change moderately frequently.
 * Tag: 'careers' enables on-demand revalidation.
 */
export const getCareers = cache(async (): Promise<Career[]> => {
  return sanityFetch({
    query: `
      *[_type == "career" && isActive == true] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        department,
        location,
        type,
        description,
        requirements,
        benefits,
        salary {
          min,
          max,
          currency,
          period
        },
        isActive,
        publishedAt,
        applicationUrl,
        applicationEmail
      }
    `,
    revalidate: 1800, // 30 minutes
    tags: ["careers"],
  });
});

/**
 * Fetch a single career by slug with 30-minute cache.
 * Tag: 'careers' enables on-demand revalidation.
 */
export const getCareerBySlug = cache(async (slug: string): Promise<Career | null> => {
  const career = await sanityFetch({
    query: `
      *[_type == "career" && slug.current == $slug && isActive == true][0]{
        _id,
        title,
        "slug": slug.current,
        department,
        location,
        type,
        description,
        requirements,
        benefits,
        salary {
          min,
          max,
          currency,
          period
        },
        isActive,
        publishedAt,
        applicationUrl,
        applicationEmail
      }
    `,
    params: { slug },
    revalidate: 1800, // 30 minutes
    tags: ["careers", `career:${slug}`],
  });

  return career || null;
});

/**
 * Fetch all career slugs (for generateStaticParams).
 * Tag: 'careers' enables on-demand revalidation.
 */
export const getAllCareerSlugs = cache(async (): Promise<Array<{ slug: string }>> => {
  return sanityFetch({
    query: `
      *[_type == "career" && isActive == true]{
        "slug": slug.current
      }
    `,
    revalidate: 1800, // 30 minutes
    tags: ["careers"],
  });
});

// ============================================================================
// Team Queries (1 hour revalidation)
// ============================================================================

/**
 * Fetch all team members with 1-hour cache.
 * Team composition changes infrequently.
 * Tag: 'team' enables on-demand revalidation.
 */
export const getTeamMembers = cache(async (): Promise<TeamMember[]> => {
  return sanityFetch({
    query: `
      *[_type == "teamMember" && (isActive == true || defined(isActive) == false)] | order(order asc)[0...50] {
        _id,
        name,
        role,
        department,
        photo {
          asset-> {
            _id,
            url
          },
          alt
        },
        image {
          asset-> {
            _id,
            url
          },
          alt
        },
        skills,
        order
      }
    `,
    revalidate: 3600, // 1 hour
    tags: ["team"],
  });
});

// ============================================================================
// Services Queries (24 hours revalidation)
// ============================================================================

/**
 * Fetch all active services with 24-hour cache.
 * Service descriptions change very rarely.
 * Tag: 'services' enables on-demand revalidation.
 */
export const getServices = cache(async (): Promise<any[]> => {
  return sanityFetch({
    query: `
      *[_type == "service" && isActive == true] | order(order asc) {
        _id,
        title,
        "slug": slug.current,
        category,
        shortDescription,
        features,
        ctaText,
        ctaStyle,
        order
      }
    `,
    revalidate: 86400, // 24 hours
    tags: ["services"],
  });
});

// ============================================================================
// Testimonials & Success Stories (1 hour revalidation)
// ============================================================================

/**
 * Fetch all active testimonials with 1-hour cache.
 * Tag: 'testimonials' enables on-demand revalidation.
 */
export const getTestimonials = cache(async (): Promise<any[]> => {
  return sanityFetch({
    query: `
      *[_type == "testimonial" && isActive == true] | order(order asc) {
        _id,
        name,
        role,
        company,
        content,
        rating,
        image {
          asset-> {
            _id,
            url
          },
          alt
        },
        order
      }
    `,
    revalidate: 3600, // 1 hour
    tags: ["testimonials"],
  });
});

/**
 * Fetch all success stories with 1-hour cache.
 * Tag: 'successStories' enables on-demand revalidation.
 */
export const getSuccessStories = cache(async (): Promise<any[]> => {
  return sanityFetch({
    query: `
      *[_type == "successStory" && isActive == true] | order(order asc) {
        _id,
        title,
        company,
        industry,
        challenge,
        solution,
        results,
        image {
          asset-> {
            _id,
            url
          },
          alt
        },
        order
      }
    `,
    revalidate: 3600, // 1 hour
    tags: ["successStories"],
  });
});
