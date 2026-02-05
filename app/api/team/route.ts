import { NextResponse } from "next/server";
import { getClient } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/team
 *
 * Fetch all team members with ISR caching.
 *
 * Query Parameters:
 * - limit: number of team members to return (optional, default: 50)
 * - department: filter by department (optional)
 * - featured: filter for featured members only (optional: true/false)
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
    const department = searchParams.get("department");

    // Handle documents without isActive field (older documents)
    let filters = "&& (isActive == true || defined(isActive) == false)";
    if (department) {
      filters += ` && department == $department`;
    }

    const query = `
      *[_type == "teamMember"${filters}] | order(order asc)[0...${limit}] {
        _id,
        name,
        role,
        department,
        photo {
          asset-> {
            _id,
            url
          },
          alt
        },
        image {
          asset-> {
            _id,
            url
          },
          alt
        },
        skills,
        order
      }
    `;

    const params = department ? { department } : undefined;
    const teamMembers = await client.fetch(query, params);

    console.log("[API /api/team] Fetched team members:", teamMembers.length);

    return NextResponse.json(teamMembers, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("[API /api/team] Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}
