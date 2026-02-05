import { NextResponse } from "next/server";
import { getClient } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/posts
 *
 * Fetch all published blog posts with ISR caching.
 *
 * Query Parameters:
 * - limit: number of posts to return (optional, default: 10)
 * - category: filter by category slug (optional)
 * - featured: filter for featured posts only (optional: true/false)
 *
 * Caching:
 * - s-maxage: 60 seconds (browser/CDN cache)
 * - stale-while-revalidate: 300 seconds (serve stale while revalidating)
 *
 * Response:
 * ```json
 * [
 *   {
 *     "_id": "string",
 *     "title": "string",
 *     "slug": "string",
 *     "excerpt": "string",
 *     "mainImage": { "asset": { "_ref": "string" }, "alt": "string" },
 *     "author": { "_id": "string", "name": "string", "slug": "string", "image": {} },
 *     "categories": [{ "_id": "string", "name": "string", "slug": "string" }],
 *     "publishedAt": "ISO 8601 datetime",
 *     "featured": boolean,
 *     "seoTitle": "string?",
 *     "seoDescription": "string?"
 *   }
 * ]
 * ```
 */
export async function GET(request: Request) {
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
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 10;
    const category = searchParams.get("category");

    // Build GROQ query with filters
    let filters = "";
    if (category) {
      filters += ` && $category in categories[]->slug.current`;
    }

    const query = `
      *[_type == "post"${filters}] | order(publishedAt desc)[0...${limit}] {
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
        publishedAt,
        seoTitle,
        seoDescription
      }
    `;

    const params = category ? { category } : undefined;

    console.log("[API /api/posts] Fetching posts...");

    const posts = await client.fetch(query, params);

    console.log("[API /api/posts] Fetched:", posts.length, "posts");

    return NextResponse.json(posts, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[API /api/posts] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
