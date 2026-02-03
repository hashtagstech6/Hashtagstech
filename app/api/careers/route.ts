import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/careers
 *
 * Fetch all active career openings with ISR caching.
 *
 * Query Parameters:
 * - department: filter by department (optional)
 * - type: filter by employment type (optional)
 * - location: filter by location (optional)
 * - includeInactive: include inactive job postings (optional: true/false)
 *
 * Caching:
 * - s-maxage: 300 seconds (5 minutes)
 * - stale-while-revalidate: 600 seconds (10 minutes)
 *
 * Response:
 * ```json
 * [
 *   {
 *     "_id": "string",
 *     "title": "string",
 *     "slug": "string",
 *     "department": "string",
 *     "location": "string",
 *     "type": "Full-time | Part-time | Contract | Remote",
 *     "description": [Portable Text],
 *     "requirements": ["string"],
 *     "benefits": ["string"],
 *     "salary": { "min": number, "max": number, "currency": "string", "period": "string" },
 *     "isActive": boolean,
 *     "publishedAt": "ISO 8601 datetime",
 *     "applicationUrl": "string?",
 *     "applicationEmail": "string?"
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

  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const type = searchParams.get("type");
    const location = searchParams.get("location");
    const includeInactive = searchParams.get("includeInactive") === "true";

    // Build filters
    const filters: string[] = [];
    if (department) filters.push(`department == $department`);
    if (type) filters.push(`type == $type`);
    if (location) filters.push(`location == $location`);
    if (!includeInactive) filters.push(`isActive == true`);

    const filterString = filters.length > 0 ? ` && ${filters.join(" && ")}` : "";

    const query = `
      *[_type == "career"${filterString}] | order(publishedAt desc) {
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

    const queryParams = {
      ...(department && { department }),
      ...(type && { type }),
      ...(location && { location }),
    };

    const careers = await client.fetch(query, queryParams);

    return NextResponse.json(careers, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching careers:", error);
    return NextResponse.json(
      { error: "Failed to fetch careers" },
      { status: 500 }
    );
  }
}
