import { NextResponse } from "next/server";
import { getClient } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/success-stories
 *
 * Fetch all success stories with ISR caching (Simplified).
 *
 * Query Parameters:
 * - limit: number of stories to return (optional, default: 10)
 *
 * Caching:
 * - s-maxage: 3600 seconds (1 hour browser/CDN cache)
 * - stale-while-revalidate: 7200 seconds
 */
export async function GET(request: Request) {
  const config = validateSanityConfig();

  console.log("[API /api/success-stories] Config check:", config);

  if (!config.valid) {
    console.error("[API /api/success-stories] Invalid config:", config.error);
    return NextResponse.json(
      { error: config.error || "Sanity configuration error" },
      { status: 500 }
    );
  }

  const client = getClient();
  if (!client) {
    console.error("[API /api/success-stories] Client is null");
    return NextResponse.json(
      { error: "Sanity client not configured" },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 10;

    const query = `
      *[_type == "successStory" && (isActive == true || defined(isActive) == false)] | order(order asc)[0...${limit}] {
        _id,
        clientCompany,
        country,
        featuredImage {
          asset-> {
            _id,
            url
          },
          alt
        },
        excerpt,
        order
      }
    `;

    console.log("[API /api/success-stories] Fetching with query:", query.replace(/\s+/g, ' '));

    const stories = await client.fetch(query);

    console.log("[API /api/success-stories] Fetched stories:", stories.length, stories);

    return NextResponse.json(stories, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("[API /api/success-stories] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch success stories", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
