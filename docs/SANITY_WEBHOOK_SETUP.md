# Sanity Webhook Setup Guide

This guide explains how to configure on-demand cache revalidation using Sanity webhooks.

## Overview

When you publish, unpublish, or delete content in Sanity Studio, a webhook will immediately notify your Next.js application to revalidate the affected cache. This ensures content updates appear instantly on your website.

## Prerequisites

1. Your website must be deployed (Vercel, Netlify, etc.)
2. You have access to the Sanity project management dashboard
3. A webhook secret key for security

## Step 1: Generate Webhook Secret

Generate a secure random string for your webhook secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using OpenSSL (macOS/Linux)
openssl rand -base64 32
```

## Step 2: Add Environment Variable

Add the generated secret to your environment variables:

### Local Development (`.env.local`)
```bash
SANITY_WEBHOOK_SECRET=your-generated-secret-here
```

### Production (Vercel)
1. Go to Vercel → your project → Settings → Environment Variables
2. Add variable: `SANITY_WEBHOOK_SECRET`
3. Paste your generated secret
4. Add to: Production, Preview, Development

### Production (Other Platforms)
Add `SANITY_WEBHOOK_SECRET` to your hosting platform's environment variables.

## Step 3: Configure Sanity Webhook

### 3.1 Access Webhook Settings

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Navigate to: **API → Webhooks**
4. Click **+ New webhook**

### 3.2 Webhook Configuration

| Field | Value |
|-------|-------|
| **Name** | Next.js Cache Revalidation |
| **URL** | `https://yourdomain.com/api/revalidate` |
| **Secret** | Paste your `SANITY_WEBHOOK_SECRET` value |
| **Method** | POST |
| **Projection** | `{ _id, _type, "slug": slug.current }` |

### 3.3 Filter Settings

Select these events to trigger the webhook:

- **Create**: ✅ (When new content is published)
- **Update**: ✅ (When content is modified)
- **Delete**: ✅ (When content is removed)

### 3.4 Document Filter (Optional)

To only revalidate when documents transition to/from published state:

```groq
// Filter for published documents only
'_type == "post" && !(_id in path("drafts.**"))'
```

Or leave empty to revalidate on all changes.

### 3.5 HTTP Headers

No additional headers needed. Sanity automatically sends:
- `x-sanity-webhook-signature` - HMAC signature for security

## Step 4: Test the Webhook

### 4.1 Test Endpoint

You can test if the webhook is accessible:

```bash
curl https://yourdomain.com/api/revalidate
```

Expected response:
```json
{
  "webhook": "/api/revalidate",
  "status": "configured",
  "supportedTypes": ["post", "career", "teamMember", "service", "testimonial", "successStory"],
  "environment": "production",
  "documentation": "See inline comments in route.ts for setup instructions"
}
```

### 4.2 Test with Sanity

1. In Sanity Studio, edit a blog post
2. Click **Publish**
3. Check your server logs for: `✅ Webhook: Revalidated post (create/update)`
4. Visit the blog post page - content should be updated immediately

### 4.3 View Webhook Delivery Status

In Sanity dashboard:
1. Go to **API → Webhooks**
2. Click on your webhook
3. View recent deliveries and their status codes

## Supported Document Types

| Document Type | Cache Tags | Paths Revalidated |
|--------------|-----------|-------------------|
| `post` | `posts`, `post:{slug}` | `/blog`, `/blog/{slug}` |
| `career` | `careers`, `career:{slug}` | `/career`, `/career/{slug}` |
| `teamMember` | `team` | `/team` |
| `service` | `services` | `/services` |
| `testimonial` | `testimonials` | (Homepage only) |
| `successStory` | `successStories` | (Homepage only) |

## Troubleshooting

### Webhook returns 401 Unauthorized

**Cause:** Signature verification failed

**Solutions:**
1. Check `SANITY_WEBHOOK_SECRET` matches in both places
2. Ensure secret has no extra spaces or line breaks
3. Regenerate secret and update both Sanity and environment variables

### Webhook returns 400 Bad Request

**Cause:** Invalid payload or missing data

**Solutions:**
1. Check webhook projection includes required fields
2. Verify document type is supported
3. Check server logs for detailed error

### Content not updating after webhook

**Cause:** Path or tag mismatch

**Solutions:**
1. Check server logs for revalidation messages
2. Verify cache tag matches query tags
3. Try hard refresh (Ctrl+Shift+R) to clear browser cache

### Webhook timing out

**Cause:** Server response too slow

**Solutions:**
1. Keep webhook handler fast (< 5 seconds)
2. Use background jobs if heavy processing needed
3. Check server resources and response time

## Security Best Practices

1. **Always use HTTPS** for webhook URLs
2. **Keep secrets secure** - never commit to git
3. **Rotate secrets periodically** (e.g., every 90 days)
4. **Monitor webhook logs** for suspicious activity
5. **Rate limit webhooks** if receiving excessive requests

## Monitoring

### Log Webhook Events

The webhook endpoint logs important events:

```
✅ Revalidated tag: posts
✅ Revalidated path: /blog/my-post
✅ Webhook: Revalidated post (update)
```

### Set Up Alerts

Consider setting up monitoring for:
- Failed webhook deliveries (4xx, 5xx responses)
- Unauthorized webhook attempts
- Unusual webhook frequency

## Additional Resources

- [Next.js On-Demand Revalidation](https://nextjs.org/docs/app/building-your-application/caching#on-demand-revalidation)
- [Sanity Webhooks Documentation](https://www.sanity.io/docs/webhooks)
- [Cache Tags in Next.js](https://nextjs.org/docs/app/building-your-application/caching#fetching-data-on-the-server-with-cache-tags)
