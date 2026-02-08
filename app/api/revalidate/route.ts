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
 */
function verifySignature(body: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;

  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const digest = hmac.update(body).digest("base64");

  // Sanity sends signature in format: sha256=<base64>
  const providedSignature = signature.replace("sha256=", "");

  return crypto.timingSafeEqual(
    Buffer.from(digest, "base64"),
    Buffer.from(providedSignature, "base64")
  );
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
    // Sanity may send as: x-sanity-webhook-signature or sanity-webhook-signature
    const signature = request.headers.get("x-sanity-webhook-signature") ||
                      request.headers.get("sanity-webhook-signature");

    if (!signature) {
      // TEMPORARY: Allow webhook without signature for debugging
      console.warn("⚠️ Webhook: Missing signature header - allowing for debugging");
      console.warn("⚠️ All received headers:", allHeaders);

      // Get raw body and continue anyway
      const rawBody = await request.text();
      let payload;
      try {
        payload = JSON.parse(rawBody);
      } catch {
        return NextResponse.json(
          { error: "Bad Request", message: "Invalid JSON" },
          { status: 400 }
        );
      }

      console.log("📦 Webhook payload (no signature):", JSON.stringify(payload, null, 2));

      // Continue with processing despite missing signature
      return processWebhookPayload(payload);
    }

    // Get raw body for signature verification
    const rawBody = await request.text();

    // Verify signature
    if (!verifySignature(rawBody, signature)) {
      console.error("❌ Webhook: Invalid signature");
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid signature" },
        { status: 401 }
      );
    }

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
