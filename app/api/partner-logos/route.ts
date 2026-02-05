import { NextResponse } from "next/server";
import { getClient } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/partner-logos
 *
 * Fetch all client/partner logos for the slider (Simplified).
 *
 * Query Parameters:
 * - limit: number of logos to return (optional, default: 50)
 *
 * Caching:
 * - s-maxage: 3600 seconds (1 hour)
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
    const limit = Number(searchParams.get("limit")) || 50;

    const query = `
      *[_type == "clientLogo" && isActive == true] | order(_createdAt asc)[0...${limit}] {
        _id,
        name,
        logo {
          asset-> {
            _id,
            url
          },
          alt
        },
        website
      }
    `;

    const logos = await client.fetch(query);

    return NextResponse.json(logos, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error fetching partner logos:", error);
    return NextResponse.json(
      { error: "Failed to fetch partner logos" },
      { status: 500 }
    );
  }
}
