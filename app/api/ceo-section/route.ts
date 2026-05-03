import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/client";
import { validateSanityConfig } from "@/sanity/env";

/**
 * GET /api/ceo-section
 *
 * Fetch the active CEO section data from Sanity CMS.
 * Returns the first active CEO section document.
 *
 * Caching:
 * - Next.js Data Cache (managed by sanityFetch)
 * - Tags: ['ceoSection'] for webhook on-demand revalidation
 */
export async function GET() {
  const config = validateSanityConfig();
  if (!config.valid) {
    return NextResponse.json(
      { error: config.error || "Sanity configuration error" },
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

    const ceoData = await sanityFetch({
      query,
      tags: ["ceoSection"],
    });

    if (!ceoData) {
      return NextResponse.json(null);
    }

    return NextResponse.json(ceoData);
  } catch (error) {
    console.error("Error fetching CEO section:", error);
    return NextResponse.json(
      { error: "Failed to fetch CEO section" },
      { status: 500 }
    );
  }
}
