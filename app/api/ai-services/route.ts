import { NextResponse } from "next/server";
import { getClient } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/ai-services
 *
 * Fetch all active AI services with ISR caching.
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
 *     "number": "string",
 *     "shortDescription": "string",
 *     "features": ["string"],
 *     "order": number,
 *     "icon": "string?",
 *     "isActive": boolean
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
    const query = `
      *[_type == "aiService" && isActive == true] | order(order asc) {
        _id,
        title,
        "slug": slug.current,
        number,
        shortDescription,
        features,
        order,
        icon,
        isActive
      }
    `;

    const aiServices = await client.fetch(query);

    return NextResponse.json(aiServices, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error fetching AI services:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI services" },
      { status: 500 }
    );
  }
}
