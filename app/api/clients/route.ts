import { NextResponse } from "next/server";
import { getClient } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/clients
 *
 * Fetch all client testimonials with ISR caching (Simplified).
 *
 * Query Parameters:
 * - limit: number of testimonials to return (optional, default: 10)
 * - featured: filter for featured testimonials only (optional: true)
 *
 * Caching:
 * - s-maxage: 3600 seconds (1 hour browser/CDN cache)
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
    const limit = Number(searchParams.get("limit")) || 0; // Default to 0 (no limit)
    const featured = searchParams.get("featured");
    let filters = "&& isActive == true";
    if (featured === "true") {
      filters += ` && featured == true`;
    }

    // Construct query with optional limit
    let query = `*[_type == "client"${filters}] | order(order asc)`;
    
    if (limit > 0) {
      query += `[0...${limit}]`;
    }

    query += ` {
        _id,
        name,
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
        project
      }`;

    const clients = await client.fetch(query);

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
