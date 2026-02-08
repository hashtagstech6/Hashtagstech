import { NextResponse } from "next/server";
import { getServices } from "@/sanity/lib/queries";

/**
 * GET /api/services
 *
 * Fetch all active services with ISR caching.
 *
 * Caching:
 * - Uses cached query utility with 24-hour revalidation
 * - Services rarely change, so longer cache is appropriate
 * - Automatic deduplication across requests
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
  try {
    // Using cached query function - automatically deduplicates requests
    const services = await getServices();

    return NextResponse.json(services, {
      headers: {
        // Cache at browser/CDN level for 1 hour with stale-while-revalidate
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
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
