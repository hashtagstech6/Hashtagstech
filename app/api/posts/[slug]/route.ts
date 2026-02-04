import { NextResponse } from "next/server";
import { getClient } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/posts/[slug]
 *
 * Fetch a single blog post by slug with ISR caching.
 *
 * Path Parameters:
 * - slug: post slug (required)
 *
 * Caching:
 * - s-maxage: 60 seconds
 * - stale-while-revalidate: 300 seconds
 *
 * Response:
 * ```json
 * {
 *   "_id": "string",
 *   "title": "string",
 *   "slug": "string",
 *   "excerpt": "string",
 *   "mainImage": { "asset": { "_ref": "string" }, "alt": "string" },
 *   "content": [Portable Text blocks],
 *   "author": { "_id": "string", "name": "string", "slug": "string", "image": {}, "bio": "string" },
 *   "categories": [{ "_id": "string", "name": "string", "slug": "string" }],
 *   "publishedAt": "ISO 8601 datetime",
 *   "seoTitle": "string?",
 *   "seoDescription": "string?"
 * }
 * ```
 *
 * Error Response (404):
 * ```json
 * { "error": "Post not found" }
 * ```
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Validate Sanity configuration
  const config = validateSanityConfig();
  if (!config.valid) {
    return NextResponse.json(
      { error: config.error || "Sanity configuration error" },
      { status: 500 }
    );
  }

  const client = getClient();
  if (!client) {
    return NextResponse.json(
      { error: "Sanity client not configured" },
      { status: 500 }
    );
  }

  try {
    const { slug } = await params;

    const query = `
      *[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        mainImage {
          asset-> {
            _id,
            url,
            metadata {
              dimensions
            }
          },
          alt,
          hotspot
        },
        content,
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
          },
          bio,
          jobTitle
        },
        categories[]-> {
          _id,
          name,
          "slug": slug.current,
          color
        },
        publishedAt,
        featured,
        readingTime,
        seoTitle,
        seoDescription
      }
    `;

    const post = await client.fetch(query, { slug });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
