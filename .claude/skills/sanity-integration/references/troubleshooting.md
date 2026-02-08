# Sanity Integration Troubleshooting Guide

Common issues and solutions when implementing Sanity CMS with Next.js.

## Quick Debug Checklist

1. [ ] Data visible in Sanity Studio?
2. [ ] API endpoint returns correct data (curl test)?
3. [ ] Browser console shows fetch success?
4. [ ] `.next` cache cleared recently?
5. [ ] Environment variables loaded correctly?
6. [ ] Client configured with correct dataset?
7. [ ] Query uses proper projections?
8. [ ] Components use optional chaining for optional fields?
9. [ ] Placeholder image fallbacks exist?
10. [ ] Build runs without TypeScript errors?

---

## 5-Step Debugging Protocol

### Step 1: Verify Studio Data

Use Sanity Vision to test your query directly:

1. Open Sanity Studio
2. Click **Vision** (eye icon)
3. Paste your GROQ query
4. Check if results appear

**If no results:** Issue is with your query or data, not the code.

---

### Step 2: Test API Endpoint Directly

```bash
# Add cache-busting to prevent browser caching
curl "https://yourdomain.com/api/posts?t=$(date +%s)"
```

**Check response:**
- Returns data? → API works, issue is in frontend
- Returns error? → Issue is in API route or Sanity config

---

### Step 3: Add Debug Logging

```typescript
// API route
console.log("Config check:", { valid: validateSanityConfig() });
console.log("Fetching with query:", query);

// Component
console.log("Posts fetched:", posts);
```

---

### Step 4: Check Browser Console

Look for:
- Failed network requests (red in Network tab)
- JavaScript errors in Console tab
- 404 errors for missing endpoints

---

### Step 5: Clear Caches

In order of severity:

1. **Clear browser cache** - Ctrl+Shift+R
2. **Delete `.next` directory**:
   ```bash
   rm -rf .next
   npm run dev
   ```
3. **Clear node_modules and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## Common Issues by Category

### Setup Issues

#### Issue: "Sanity client not configured"

**Cause:** Environment variables not set or client not initialized.

**Solution:**
```typescript
// Check your env.ts
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// Verify .env.local exists with values
NEXT_PUBLIC_SANITY_PROJECT_ID=your-id
NEXT_PUBLIC_SANITY_DATASET=production
```

---

#### Issue: Studio shows content, frontend shows empty

**Cause:** Multiple possibilities - use debug checklist above.

**Quick test:**
```typescript
// In your component
console.log("Client:", client);
console.log("Query:", query);
console.log("Results:", await client.fetch(query));
```

---

### Caching Issues

#### Issue: Content not updating after Sanity change

**Cause:** CDN cache or build cache serving stale content.

**Solutions:**

1. **Check CDN setting:**
   ```typescript
   useCdn: process.env.NODE_ENV === "production" // Should be true in prod
   ```

2. **Check revalidation time:**
   ```typescript
   export const revalidate = 3600; // Must be set for ISR
   ```

3. **Clear build cache:**
   ```bash
   rm -rf .next
   npm run build
   ```

---

#### Issue: Browser returns cached API responses

**Cause:** Browser caching API responses.

**Solution:** Add cache-busting
```typescript
const response = await fetch(`/api/posts?t=${Date.now()}`);
```

---

### Image Issues

#### Issue: Images not loading or showing placeholder

**Cause:** Missing image URL or wrong asset reference.

**Check your projection:**
```typescript
// ✅ GOOD - Includes asset URL
mainImage {
  asset-> {
    _id,
    url
  },
  alt
}

// ❌ BAD - Missing asset-> dereference
mainImage {
  asset {
    _id,
    url  // This won't work!
  }
}
```

---

#### Issue: `build sanity error` - image optimization failed

**Cause:** Next.js can't access Sanity images during build.

**Solution:** Add `unoptimized` prop
```typescript
<Image
  src={post.mainImage.asset.url}
  unoptimized={!!post.mainImage.asset.url}
  // ...
/>
```

---

### Type Issues

#### Issue: TypeScript errors for optional fields

**Cause:** Sanity fields can be null/undefined.

**Solution:** Use optional chaining
```typescript
// ✅ GOOD
const imageUrl = post.mainImage?.asset?.url || "/placeholder.svg";

// ❌ BAD
const imageUrl = post.mainImage.asset.url; // May crash!
```

---

### Build Issues

#### Issue: Build fails with "Cannot find module"

**Cause:** Import path issues after moving files.

**Solution:**
1. Check import paths are correct
2. Run `npm install` to ensure dependencies
3. Delete `.next` and rebuild

---

#### Issue: Build succeeds but pages show error

**Cause:** Runtime error not caught during build.

**Solution:**
1. Check browser console for error
2. Check Netlify/Vercel logs
3. Test in development mode first

---

### Webhook Issues

#### Issue: Webhook returns 401 Unauthorized

**Cause:** Signature verification failed.

**Solutions:**
1. Check `SANITY_WEBHOOK_SECRET` matches in both Sanity and Netlify
2. Verify webhook uses `sanity-webhook-signature` header (not `x-sanity-webhook-signature`)
3. Check signature format: `t=timestamp,v1=signature`

**Debug:** Add header logging to see what Sanity sends
```typescript
const allHeaders = {};
request.headers.forEach((v, k) => allHeaders[k] = v);
console.log("Headers:", allHeaders);
```

---

#### Issue: Webhook fires but content doesn't update

**Cause:** Cache tag mismatch or wrong path.

**Solutions:**
1. Check logs show which tags were revalidated
2. Verify query uses same tags
3. Check path format matches actual route
4. Try hard refresh: Ctrl+Shift+R

---

## Performance Issues

#### Issue: Too many API requests

**Cause:** Not using caching or fetching duplicate data.

**Solutions:**
1. Use `sanityFetch` helper with proper revalidation
2. Wrap queries in React `cache()` for deduplication
3. Use server components instead of API routes where possible

---

#### Issue: Slow page loads

**Cause:** Over-fetching data or slow queries.

**Solutions:**
1. Project only needed fields
2. Add specific filters in GROQ
3. Use `useCdn: true` in production
4. Enable ISR with appropriate revalidation times

---

## Component-Level Troubleshooting

### Component Returns `null`

**Check:**
1. API returning data? → Add console.log
2. Component handling loading state? → Check Suspense
3. Sanity config valid? → Check validateSanityConfig()

### Component Shows Loading Forever

**Check:**
1. API call resolving? → Check Network tab
2. await used? → Async/await in correct places
3. Server component receiving props? → Check params await

---

## Sanity-Specific Issues

### GROQ Query Returns Empty

**Debug steps:**
1. **Check document type:** `_type == "post"` vs `_type == "Post"` (case-sensitive!)
2. **Check field names:** `slug.current` vs `slug` (use .current for slug fields)
3. **Check filters:** `isActive == true` vs `isActive` (booleans may be undefined)
4. **Test in Vision:** Use Sanity Studio's Vision tab

---

### Reference Not Working

**Common mistakes:**
- `author->` for single reference (array of one)
- `author[]->` for array reference
- Missing asset dereference: `asset.url` vs `asset->.url`

---

## Getting Help

When troubleshooting fails:

1. **Check Sanity status:** https://status.sanity.io/
2. **Check Next.js GitHub:** Search for similar issues
3. **Enable verbose logging:** Add more console.log statements
4. **Isolate the problem:** Test with minimal example

---

## See Also

- `references/webhook-patterns.md` - Webhook troubleshooting
- `references/caching-strategies.md` - Cache configuration guide
- `references/schema-patterns.md` - Schema design patterns
