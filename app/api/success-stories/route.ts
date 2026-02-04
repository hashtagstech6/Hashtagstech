import { NextResponse } from "next/server";
import { getClient } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/success-stories
 *
 * Fetch all success stories with ISR caching.
 *
 * Query Parameters:
 * - limit: number of stories to return (optional, default: 10)
 * - featured: filter for featured stories only (optional: true/false)
 * - industry: filter by industry (optional)
 *
 * Caching:
 * - s-maxage: 3600 seconds (1 hour browser/CDN cache)
 * - stale-while-revalidate: 7200 seconds
 */
export async function GET(request: Request) {
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
    const featured = searchParams.get("featured");
    const industry = searchParams.get("industry");

    let filters = "";
    if (featured === "true") {
      filters += ` && featured == true`;
    }
    if (industry) {
      filters += ` && industry == $industry`;
    }

    const query = `
      *[_type == "successStory"${filters}] | order(order asc)[0...${limit}] {
        _id,
        title,
        "slug": slug.current,
        clientName,
        clientCompany,
        industry,
        featuredImage {
          asset-> {
            _id,
            url
          },
          alt
        },
        excerpt,
        challenge,
        solution,
        results,
        projectDate,
        services,
        featured
      }
    `;

    const params = industry ? { industry } : undefined;
    const stories = await client.fetch(query, params);

    return NextResponse.json(stories, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error fetching success stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch success stories" },
      { status: 500 }
    );
  }
}
