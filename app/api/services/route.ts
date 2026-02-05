import { NextResponse } from "next/server";
import { getClient } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/services
 *
 * Fetch all active services with ISR caching.
 *
 * Caching:
 * - s-maxage: 3600 seconds (1 hour browser/CDN cache)
 * - stale-while-revalidate: 7200 seconds (serve stale while revalidating)
 *
 * Response:
 * ```json
 * [
 *   {
 *     "_id": "string",
 *     "title": "string",
 *     "slug": "string",
 *     "category": "string",
 *     "shortDescription": "string",
 *     "features": ["string"],
 *     "ctaText": "string",
 *     "ctaStyle": "primary",
 *     "order": number,
 *     "icon": "string?",
 *     "featured": boolean,
 *     "isActive": boolean
 *   }
 * ]
 * ```
 */
export const dynamic = "force-dynamic";

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
    const query = `
      *[_type == "service" && isActive == true] | order(order asc) {
        _id,
        title,
        "slug": slug.current,
        category,
        shortDescription,
        features,
        ctaText,
        ctaStyle,
        order,
        icon,
        isActive
      }
    `;

    const services = await client.fetch(query, {}, { useCdn: false });

    return NextResponse.json(services, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
