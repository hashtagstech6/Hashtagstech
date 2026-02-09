import { revalidateTag, revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * POST /api/revalidate
 *
 * Sanity webhook endpoint for on-demand cache revalidation using the official
 * next-sanity webhook pattern.
 *
 * When content is published/unpublished in Sanity Studio, this endpoint
 * receives a webhook and immediately revalidates the affected cache tags
 * and paths.
 *
 * Security:
 * - Uses next-sanity's parseBody for signature verification
 * - Rejects requests without valid signatures
 *
 * Supported document types:
 * - post: Revalidates "posts" tag and /blog paths
 * - career: Revalidates "careers" tag and /career paths
 * - teamMember: Revalidates "team" tag and /team path
 * - service: Revalidates "services" tag and /services path
 * - testimonial: Revalidates "testimonials" tag
 * - successStory: Revalidates "successStories" tag
 *
 * Webhook Configuration in Sanity:
 * 1. Go to sanity.io/manage → your project → API → Webhooks
 * 2. Create new webhook with URL: https://yourdomain.com/api/revalidate
 * 3. Add secret: Use SANITY_WEBHOOK_SECRET environment variable
 * 4. Filter for: create, update, delete events
 * 5. Projection: Include _id, _type, slug.current
 */

type WebhookPayload = {
  _type: string;
  _id?: string;
  slug?: string | { current: string };
  operation?: string;
};

// Get webhook secret from environment
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET && process.env.NODE_ENV === "production") {
  console.warn("⚠️ SANITY_WEBHOOK_SECRET not set - webhook will reject all requests");
}

/**
 * Map Sanity document types to cache tags and paths
 */
function getRevalidationConfig(docType: string) {
  const configs: Record<string, { tags: string[]; pathPrefix?: string }> = {
    post: {
      tags: ["posts"],
      pathPrefix: "/blog",
    },
    career: {
      tags: ["careers"],
      pathPrefix: "/career",
    },
    teamMember: {
      tags: ["team"],
      pathPrefix: "/team",
    },
    service: {
      tags: ["services"],
      pathPrefix: "/services",
    },
    testimonial: {
      tags: ["testimonials"],
    },
    successStory: {
      tags: ["successStories"],
    },
  };

  return configs[docType];
}

/**
 * Extract slug value from different possible formats
 */
function extractSlugValue(slug: string | { current: string } | undefined): string | undefined {
  if (!slug) return undefined;
  if (typeof slug === "string") return slug;
  if (typeof slug === "object" && "current" in slug) return slug.current;
  return undefined;
}

export async function POST(req: NextRequest) {
  try {
    if (!WEBHOOK_SECRET) {
      return new Response("Missing environment variable SANITY_WEBHOOK_SECRET", { status: 500 });
    }

    // Use next-sanity's parseBody for signature verification
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      WEBHOOK_SECRET
    );

    if (!isValidSignature) {
      const message = "Invalid signature";
      return new Response(JSON.stringify({ message, isValidSignature, body }), {
        status: 401,
      });
    }

    if (!body?._type) {
      const message = "Bad Request";
      return new Response(JSON.stringify({ message, body }), { status: 400 });
    }

    console.log("✅ Webhook signature verified");
    console.log("🔍 Webhook payload:", JSON.stringify(body, null, 2));

    const { _type, slug, operation } = body;

    // Get revalidation config for this document type
    const config = getRevalidationConfig(_type);

    if (!config) {
      console.log(`ℹ️ Webhook: No revalidation config for _type="${_type}"`);
      return NextResponse.json({
        revalidated: false,
        message: `No revalidation configured for type: ${_type}`,
      });
    }

    // Revalidate cache tags
    for (const tag of config.tags) {
      revalidateTag(tag);
      console.log(`✅ Revalidated tag: ${tag}`);
    }

    // Extract slug value
    const slugValue = extractSlugValue(slug);

    // Revalidate specific path if slug is available
    if (config.pathPrefix && slugValue) {
      const path = `${config.pathPrefix}/${slugValue}`;
      revalidatePath(path);
      console.log(`✅ Revalidated path: ${path}`);
    } else if (config.pathPrefix) {
      console.log(`⚠️ Could not revalidate specific path - slug format:`, JSON.stringify(slug));
    }

    // Also revalidate the listing page
    if (config.pathPrefix) {
      revalidatePath(config.pathPrefix);
      console.log(`✅ Revalidated path: ${config.pathPrefix}`);
    }

    // Log successful revalidation
    console.log(`✅ Webhook: Revalidated ${_type} (${operation || "unknown"})`);

    return NextResponse.json({
      revalidated: true,
      type: _type,
      slug: slugValue,
      operation,
      tags: config.tags,
    });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
}

/**
 * GET handler for webhook testing
 * Returns configuration info for debugging
 */
export async function GET() {
  return NextResponse.json({
    webhook: "/api/revalidate",
    status: WEBHOOK_SECRET ? "configured" : "missing-secret",
    supportedTypes: ["post", "career", "teamMember", "service", "testimonial", "successStory"],
    environment: process.env.NODE_ENV,
  });
}
