import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import crypto from "crypto";

/**
 * POST /api/revalidate
 *
 * Sanity webhook endpoint for on-demand cache revalidation.
 *
 * When content is published/unpublished in Sanity Studio, this endpoint
 * receives a webhook and immediately revalidates the affected cache tags
 * and paths.
 *
 * Security:
 * - Uses HMAC signature verification with SANITY_WEBHOOK_SECRET
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

// Get webhook secret from environment
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET && process.env.NODE_ENV === "production") {
  console.warn("⚠️ SANITY_WEBHOOK_SECRET not set - webhook will reject all requests");
}

/**
 * Verify webhook signature from Sanity
 *
 * Sanity sends signature in format: t=timestamp,v1=signature
 * Example: "t=1770567243957,v1=9q_uHIMotATZtUJ3KR_PgKY6LhGRHJkMFCxn--ZEtJ0"
 */
function verifySignature(body: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;

  try {
    // Parse Sanity's signature format: t=timestamp,v1=signature
    const parts = signature.split(",");
    let signatureValue = "";

    for (const part of parts) {
      if (part.startsWith("v1=")) {
        signatureValue = part.substring(3);
        break;
      }
    }

    if (!signatureValue) {
      console.error("❌ Could not extract v1 signature from:", signature);
      return false;
    }

    // Compute HMAC signature using the same method as Sanity
    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
    hmac.update(body, "utf8");
    const digest = hmac.digest("base64");

    // Compare signatures
    const isValid = digest === signatureValue;

    if (!isValid) {
      console.error("❌ Signature mismatch:");
      console.error("   Expected:", digest);
      console.error("   Received:", signatureValue);
    }

    return isValid;
  } catch (error) {
    console.error("❌ Signature verification error:", error);
    return false;
  }
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

export async function POST(request: Request) {
  try {
    // DEBUG: Log ALL headers to see what Sanity is sending
    const allHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      allHeaders[key] = value;
    });
    console.log("🔍 Webhook headers received:", JSON.stringify(allHeaders, null, 2));

    // Get signature from headers
    // Sanity sends as: sanity-webhook-signature
    const signature = request.headers.get("sanity-webhook-signature");

    if (!signature) {
      console.error("❌ Webhook: Missing signature header");
      console.error("❌ Available headers:", Object.keys(allHeaders));
      return NextResponse.json(
        { error: "Unauthorized", message: "Missing signature" },
        { status: 401 }
      );
    }

    // Get raw body FIRST (can only read stream once)
    const rawBody = await request.text();

    // Verify signature
    if (!verifySignature(rawBody, signature)) {
      console.error("❌ Webhook: Invalid signature");
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid signature" },
        { status: 401 }
      );
    }

    console.log("✅ Webhook signature verified");

    // Parse webhook payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      console.error("❌ Webhook: Invalid JSON payload");
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid JSON" },
        { status: 400 }
      );
    }

    return processWebhookPayload(payload);
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Process webhook payload and revalidate caches
 */
async function processWebhookPayload(payload: any) {
  // Extract document info
  const { _type, slug, operation } = payload;

  if (!_type) {
    console.error("❌ Webhook: Missing _type in payload");
    return NextResponse.json(
      { error: "Bad Request", message: "Missing _type" },
      { status: 400 }
    );
  }

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

  // Revalidate specific path if slug is available
  if (config.pathPrefix && slug?.current) {
    const path = `${config.pathPrefix}/${slug.current}`;
    revalidatePath(path);
    console.log(`✅ Revalidated path: ${path}`);
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
    slug: slug?.current,
    operation,
    tags: config.tags,
  });
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
    documentation: "See inline comments in route.ts for setup instructions",
  });
}
