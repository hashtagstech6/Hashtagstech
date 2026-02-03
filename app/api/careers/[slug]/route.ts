import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/careers/[slug]
 *
 * Fetch a single career opening by slug with ISR caching.
 *
 * Path Parameters:
 * - slug: career slug (required)
 *
 * Caching:
 * - s-maxage: 300 seconds (5 minutes)
 * - stale-while-revalidate: 600 seconds (10 minutes)
 *
 * Response:
 * ```json
 * {
 *   "_id": "string",
 *   "title": "string",
 *   "slug": "string",
 *   "department": "string",
 *   "location": "string",
 *   "type": "Full-time | Part-time | Contract | Remote",
 *   "description": [Portable Text],
 *   "requirements": ["string"],
 *   "benefits": ["string"],
 *   "salary": { "min": number, "max": number, "currency": "string", "period": "string" },
 *   "isActive": boolean,
 *   "publishedAt": "ISO 8601 datetime",
 *   "applicationUrl": "string?",
 *   "applicationEmail": "string?"
 * }
 * ```
 *
 * Error Response (404):
 * ```json
 * { "error": "Career not found" }
 * ```
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Validate Sanity configuration
  const config = validateSanityConfig();
  if (!config.valid) {
    return NextResponse.json(
      { error: config.error || "Sanity configuration error" },
      { status: 500 }
    );
  }

  try {
    const { slug } = await params;

    const query = `
      *[_type == "career" && slug.current == $slug][0] {
        _id,
        title,
        "slug": slug.current,
        department,
        location,
        type,
        description,
        requirements,
        benefits,
        salary {
          min,
          max,
          currency,
          period
        },
        isActive,
        publishedAt,
        applicationUrl,
        applicationEmail
      }
    `;

    const career = await client.fetch(query, { slug });

    if (!career) {
      return NextResponse.json({ error: "Career not found" }, { status: 404 });
    }

    return NextResponse.json(career, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching career:", error);
    return NextResponse.json(
      { error: "Failed to fetch career" },
      { status: 500 }
    );
  }
}
