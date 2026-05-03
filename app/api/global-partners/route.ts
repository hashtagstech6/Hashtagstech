import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/global-partners
 *
 * Fetch all global partners (representatives) with ISR caching (Simplified).
 *
 * Query Parameters:
 * - limit: number of partners to return (optional, default: 50)
 *
 * Caching:
 * - Next.js Data Cache (managed by sanityFetch)
 * - Tags: ['globalPartners'] for webhook on-demand revalidation
 */
export async function GET(request: Request) {
  const config = validateSanityConfig();
  if (!config.valid) {
    return NextResponse.json(
      { error: config.error || "Sanity configuration error" },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 50;

    const query = `
      *[_type == "globalPartner" && isActive == true] | order(order asc)[0...${limit}] {
        _id,
        name,
        country,
        photo {
          asset-> {
            _id,
            url
          },
          alt
        }
      }
    `;

    const partners = await sanityFetch({
      query,
      tags: ["globalPartners"],
    });

    return NextResponse.json(partners);
  } catch (error) {
    console.error("Error fetching global partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch global partners" },
      { status: 500 }
    );
  }
}
