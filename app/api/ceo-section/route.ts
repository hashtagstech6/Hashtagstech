import { NextResponse } from "next/server";
import { getClient } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/ceo-section
 *
 * Fetch the active CEO section data from Sanity CMS.
 * Returns the first active CEO section document.
 *
 * Caching:
 * - s-maxage: 3600 seconds (1 hour browser/CDN cache)
 */
export async function GET() {
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
    // Query accepts isActive == true OR isActive not defined (default to active)
    const query = `
      *[_type == "ceoSection" && (isActive == true || !defined(isActive))][0] {
        _id,
        name,
        sectionTitle,
        photo {
          asset-> {
            _id,
            url
          },
          alt
        },
        message,
        consultationText,
        consultationPrice,
        consultationButtonText,
        consultationLink,
        linkedinUrl,
        twitterUrl,
        facebookUrl,
        instagramUrl,
        githubUrl,
        youtubeUrl,
        websiteUrl
      }
    `;

    const ceoData = await client.fetch(query);

    if (!ceoData) {
      return NextResponse.json(null, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      });
    }

    return NextResponse.json(ceoData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error fetching CEO section:", error);
    return NextResponse.json(
      { error: "Failed to fetch CEO section" },
      { status: 500 }
    );
  }
}
