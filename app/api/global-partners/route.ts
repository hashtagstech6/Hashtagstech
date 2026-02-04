import { NextResponse } from "next/server";
import { getClient } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/global-partners
 *
 * Fetch all global partners with ISR caching.
 *
 * Query Parameters:
 * - limit: number of partners to return (optional, default: 50)
 * - country: filter by country code (optional: US, GB, AE, etc.)
 * - partnerType: filter by partner type (optional: technology, strategic, client, investor)
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
    const limit = Number(searchParams.get("limit")) || 50;
    const country = searchParams.get("country");
    const partnerType = searchParams.get("partnerType");

    let filters = "&& isActive == true";
    if (country) {
      filters += ` && country == $country`;
    }
    if (partnerType) {
      filters += ` && partnerType == $partnerType`;
    }

    const query = `
      *[_type == "globalPartner"${filters}] | order(order asc)[0...${limit}] {
        _id,
        name,
        "slug": slug.current,
        logo {
          asset-> {
            _id,
            url
          },
          alt
        },
        website,
        country,
        partnerType,
        description,
        order
      }
    `;

    const params: Record<string, string> = {};
    if (country) params.country = country;
    if (partnerType) params.partnerType = partnerType;

    const partners = await client.fetch(query, Object.keys(params).length > 0 ? params : undefined);

    return NextResponse.json(partners, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error fetching global partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch global partners" },
      { status: 500 }
    );
  }
}
