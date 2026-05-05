import { getClient } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

/**
 * GET /api/site-settings
 * 
 * Fetches global site settings from Sanity (Logo, Social Links, Legal Pages).
 * Uses 'siteSettings' tag for on-demand revalidation.
 */
export async function GET() {
  try {
    const client = getClient();
    if (!client) {
      throw new Error("Sanity client not configured");
    }

    const query = `*[_type == "siteSettings"][0] {
      logo {
        asset->{ url },
        alt
      },
      footerLogo {
        asset->{ url },
        alt
      },
      socialLinks[] {
        platform,
        url
      },
      contactEmails[] {
        label,
        email
      },
      privacyPolicy,
      termsOfService
    }`;

    const settings = await client.fetch(query, {}, { 
      next: { tags: ["siteSettings"] },
      useCdn: false 
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[API /api/site-settings] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}
