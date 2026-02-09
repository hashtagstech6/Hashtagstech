import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

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
 * - Uses Sanity's official @sanity/webhook package for signature verification
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
 * Read raw body from request stream
 * Required for proper signature verification
 */
async function readBody(readable: ReadableStream<Uint8Array>): Promise<string> {
  const chunks = [];
  const reader = readable.getReader();
  let result;

  while (!(result = await reader.read()).done) {
    chunks.push(result.value);
  }

  return Buffer.concat(chunks).toString("utf-8");
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
    // Get raw body FIRST for signature verification
    const rawBody = await readBody(request.body!);

    // Get signature from Sanity's official header name
    const signature = request.headers.get(SIGNATURE_HEADER_NAME);

    if (!signature) {
      console.error("❌ Webhook: Missing signature header");
      console.error("❌ Expected header:", SIGNATURE_HEADER_NAME);
      return NextResponse.json(
        { error: "Unauthorized", message: "Missing signature" },
        { status: 401 }
      );
    }

    // Verify signature using Sanity's official package
    const isValid = await isValidSignature(
      rawBody,
      signature,
      WEBHOOK_SECRET ?? ""
    );

    if (!isValid) {
      console.error("❌ Webhook: Invalid signature");
      console.error("❌ Signature:", signature);
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
