import { NextResponse } from "next/server";
import { getClient } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/clients
 *
 * Fetch all client testimonials with ISR caching.
 *
 * Query Parameters:
 * - limit: number of testimonials to return (optional, default: 10)
 * - featured: filter for featured testimonials only (optional: true/false)
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

    let filters = "&& isActive == true";
    if (featured === "true") {
      filters += ` && featured == true`;
    }
    if (industry) {
      filters += ` && industry == $industry`;
    }

    const query = `
      *[_type == "client"${filters}] | order(order asc)[0...${limit}] {
        _id,
        name,
        "slug": slug.current,
        company,
        role,
        photo {
          asset-> {
            _id,
            url
          },
          alt
        },
        rating,
        quote,
        project,
        industry,
        featured,
        "caseStudy": caseStudy-> {
          _id,
          "slug": slug.current
        }
      }
    `;

    const params = industry ? { industry } : undefined;
    const clients = await client.fetch(query, params);

    return NextResponse.json(clients, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error fetching client testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch client testimonials" },
      { status: 500 }
    );
  }
}
