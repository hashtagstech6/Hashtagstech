---
name: sanity-integration
description: Build production Sanity CMS integrations with Next.js, SEO optimization, and MCP tools. Use when adding Sanity CMS for products, blogs, services, events, portfolios, or any content-managed features to websites. Handles schema design, API routes, SEO, image optimization, Live Content API, webhook-based revalidation, and reusable component patterns.
allowed-tools: Read, Write, Glob, Grep, Edit, mcp__context7__*, mcp__tavily__*
category: fullstack
version: 1.8.1
---

# Sanity CMS Integration

Build production-grade Sanity CMS integrations with Next.js, featuring SEO optimization, Next.js 15 ISR caching, React cache() memoization, webhook-based on-demand revalidation, image optimization, and MCP-powered documentation lookup.

## Proficiency Progression Path

This skill follows a structured progression from A2 (Elementary) to B2 (Advanced Independent):

```
[A2] Setup → [A2] Images → [B1] Schema → [B1] Queries → [B1] API → [B1.5] Migration → [B2] ISR → [B2] SEO → [B2] Live
```

**Time Estimate**: 9-13 hours to complete all phases (A2→B2)

---

## Before Implementation

Gather context to ensure successful implementation:

| Source | Gather |
|--------|--------|
| **Codebase** | Existing Next.js version, current CMS (if any), routing patterns, styling approach |
| **Conversation** | Content types needed (blog, products, services, etc.), user's specific requirements |
| **Skill References** | Sanity patterns, schema templates, SEO best practices |
| **MCP Tools** | Use Context7 for latest Sanity/Next.js docs, Tavily for SEO/best practices research |

**STOP.** Before writing code, use MCP tools:
- **Context7 MCP**: `resolve-library-id` → `query-docs` for Sanity (`/sanity/sanity`), Next.js (`/vercel/next.js`)
- **Tavily MCP**: Search "Sanity CMS best practices 2025", "Next.js ISR caching patterns"

---

## Phase 1: Sanity Setup & Configuration [A2]

**Prerequisites**: None
**Estimated Time**: 30 minutes
**Cognitive Load**: Low (2-3 concepts)

### Learning Objective
Set up a Sanity project with proper configuration for Next.js integration.

### Success Criteria
- [ ] `npm install next-sanity @sanity/image-url` completes without errors
- [ ] `sanity/env.ts` created with `projectId`, `dataset`, `apiVersion` exports
- [ ] `sanity/lib/client.ts` created with `createClient` export
- [ ] Environment variables configured in `.env.local`
- [ ] Sanity Studio accessible at `/studio` route

### Implementation Steps

1. **Install Dependencies**
   ```bash
   npm install next-sanity @sanity/image-url
   npm install -D sanity
   ```

2. **Create Sanity Project** (if new)
   ```bash
   npx sanity@latest init
   ```
   - Choose schema path: `sanity/schemaTypes`
   - Choose project structure: Can use existing `sanity/` folder

3. **Environment Configuration** (`sanity/env.ts`)
   ```typescript
   export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
   export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
   export const apiVersion = '2024-01-01'
   ```

4. **Create Client** (`sanity/lib/client.ts`)

   **v8+ Stega Configuration (Recommended):**
   ```typescript
   import { createClient } from 'next-sanity'
   import { apiVersion, dataset, projectId } from '../env'

   export const client = createClient({
     projectId,
     dataset,
     apiVersion: '2024-01-01',
     useCdn: false, // Disable for ISR
     stega: {
       enabled: process.env.NODE_ENV === 'development',
       studioUrl: '/studio',
       filter: (props) => {
         if (props.sourcePath.at(-1) === 'url') return false
         return props.filterDefault(props)
       },
     },
   })
   ```

### Assessment
Verify by:
```bash
# Test client import
node -e "console.log('client configured')"

# Check studio access
curl http://localhost:3000/studio
```

---

## Phase 2: Image Optimization [A2]

**Prerequisites**: Phase 1 complete
**Estimated Time**: 20 minutes
**Cognitive Load**: Low (2 concepts)

### Learning Objective
Set up Sanity image URL builder for optimized image rendering.

### Success Criteria
- [ ] `@sanity/image-url` package installed
- [ ] `sanity/lib/image.ts` created with `urlFor` export
- [ ] Can generate optimized image URLs from Sanity asset references
- [ ] Images can be resized/cropped using builder methods

### Implementation

Create image builder (`sanity/lib/image.ts`):

```typescript
import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: any) => {
  return builder.image(source)
}
```

### Usage Examples

```typescript
// Basic URL
urlFor(post.mainImage).url()

// With dimensions
urlFor(post.mainImage).width(800).height(450).url()

// With crop and fit
urlFor(post.mainImage).width(1200).height(630).fit('crop').url()

// With quality
urlFor(post.mainImage).quality(80).url()
```

### Assessment
Create test image URL:
```typescript
const testUrl = urlFor({
  _type: 'image',
  asset: { _ref: 'image-test-ref' }
}).width(400).url()
```

---

## Phase 3: Schema Design Basics [B1]

**Prerequisites**: Phase 1 complete, TypeScript basics
**Estimated Time**: 60 minutes
**Cognitive Load**: Medium (4 concepts)

### Learning Objective
Create Sanity document schemas with validation, references, and previews.

### Success Criteria
- [ ] Create document type with `defineType` and `defineField`
- [ ] Add 5+ field types: string, slug, text, image, reference
- [ ] Implement field validation rules
- [ ] Add image with `alt` text requirement
- [ ] Configure preview for Studio list view
- [ ] Schema appears in Sanity Studio

### Core Concepts

**1. Document vs Object Types**
- **Document**: Standalone content with unique ID (`type: "document"`)
- **Object**: Reusable component within documents (`type: "object"`)

**2. Field Types**
- `string`, `text`, `slug`, `datetime`
- `image`, `file`
- `reference` (relationships)
- `array`, `object` (nested content)

### Template Pattern

```typescript
import { defineType, defineField } from "sanity"
import { DocumentIcon } from "@sanity/icons"

export const postType = defineType({
  name: "post",  // singular, not "posts"
  title: "Post",
  type: "document",
  icon: DocumentIcon,
  fields: [
    // 1. Required identifier
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // 2. URL generation
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),

    // 3. Rich content
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
    }),

    // 4. Image with accessibility
    defineField({
      name: "mainImage",
      type: "image",
      options: { hotspot: true },
      fields: [{
        name: "alt",
        type: "string",
        title: "Alternative text",
        validation: (Rule) => Rule.required(),
      }],
    }),

    // 5. Relationship
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),

    // 6. Portable Text
    defineField({
      name: "content",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
    },
  },
})
```

### Validation Patterns

```typescript
// Required with custom message
validation: (Rule) => Rule.required().error("Title is required")

// Length constraints
validation: (Rule) => Rule.min(10).max(60)

// Email format
validation: (Rule) => Rule.email()

// Custom async validation
validation: (Rule) => Rule.custom(async (value, context) => {
  const existing = await context.client.fetch(
    `*[_type == "post" && slug.current == $slug]`,
    { slug: value }
  )
  return existing.length > 0 ? "Slug already exists" : true
})
```

### Assessment Checklist
- [ ] Schema exports correctly
- [ ] All fields show in Studio
- [ ] Validation errors trigger appropriately
- [ ] Preview shows in list view
- [ ] Can create and save new document

---

## Phase 4: Portable Text Configuration [B1]

**Prerequisites**: Phase 3 complete
**Estimated Time**: 45 minutes
**Cognitive Load**: Medium (4 concepts)

### Learning Objective
Configure reusable Portable Text block content with custom styles and marks.

### Success Criteria
- [ ] Create `blockContentType` schema
- [ ] Configure heading styles (H1, H2, H3)
- [ ] Add list types (bullet, numbered)
- [ ] Add decorator marks (strong, em, code)
- [ ] Add annotation marks (links)
- [ ] Enable inline images in Portable Text

### Implementation

Create `sanity/schemaTypes/blockContentType.ts`:

```typescript
import { defineType, defineArrayMember } from "sanity"
import { ImageIcon } from "@sanity/icons"

export const blockContentType = defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    // Text blocks with rich formatting
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 1", value: "h1" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
          { title: "Link", value: "link" },
        ],
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [{
              title: "URL",
              name: "href",
              type: "url",
            }],
          },
        ],
      },
    }),
    // Inline images
    defineArrayMember({
      type: "image",
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [{
        name: "alt",
        type: "string",
        title: "Alternative Text",
      }],
    }),
  ],
})
```

### Usage in Schema

```typescript
defineField({
  name: "content",
  type: "array",
  of: [{ type: "blockContent" }],  // Reference the type
})
```

### Assessment
- [ ] Can select text and apply styles
- [ ] Can create bullet and numbered lists
- [ ] Can add links to text
- [ ] Can insert inline images
- [ ] All formatting renders correctly

---

## Phase 5: GROQ Query Fundamentals [B1]

**Prerequisites**: Phase 3 complete (understand schema structure)
**Estimated Time**: 60 minutes
**Cognitive Load**: Medium (4 concepts)

### Learning Objective
Write GROQ queries to fetch content with projections, filtering, and dereferencing.

### Success Criteria
- [ ] Fetch all documents of a type
- [ ] Project specific fields (not entire document)
- [ ] Filter by field values
- [ ] Dereference relationships (`->` operator)
- [ ] Order results
- [ ] Limit/paginate results

### Core Query Patterns

**1. Fetch with Projection (Always Use!)**

```groq
*[_type == "post"]{
  title,
  "slug": slug.current,
  summary,
  mainImage{asset->{url}, alt}
}
```

**2. Filter by Conditions**

```groq
*[_type == "post" && status == "published"]
*[_type == "post" && featured == true]
*[_type == "post" && publishedAt > "2024-01-01"]
```

**3. Dereference Relationships**

```groq
*[_type == "post"]{
  title,
  author->{name, slug}  // Single reference
}

*[_type == "post"]{
  title,
  categories[]->{title, slug}  // Array of references
}
```

**4. Ordering and Pagination**

```groq
*[_type == "post"] | order(publishedAt desc)[0...10]
```

**5. Single Document by Slug**

```groq
*[_type == "post" && slug.current == $slug]{title, content}[0]
```

### Performance Rules

❌ **Never do this:**
```groq
*[_type == "post"]  // Fetches ALL data
```

✅ **Always project:**
```groq
*[_type == "post"]{title, slug, summary}
```

### Assessment
Write queries to:
1. [ ] Fetch 5 most recent posts with title and slug
2. [ ] Fetch single post by slug with author name
3. [ ] Fetch posts in "design" category
4. [ ] Count total posts

---

## Phase 6: API Routes with Caching [B1]

**Prerequisites**: Phase 5 complete (GROQ queries)
**Estimated Time**: 45 minutes
**Cognitive Load**: Medium (3 concepts)

### Learning Objective
Create Next.js API routes with proper caching headers for ISR.

### Success Criteria
- [ ] Create API route at `app/api/[content]/route.ts`
- [ ] Set `export const dynamic = "force-static"`
- [ ] Add `Cache-Control` headers with `s-maxage` and `stale-while-revalidate`
- [ ] Handle errors gracefully
- [ ] Return proper JSON responses

### Template Pattern

```typescript
import { client } from "@/sanity/lib/client"
import { NextResponse } from "next/server"

export const dynamic = "force-static"

export async function GET() {
  try {
    const query = `*[_type == "post"] | order(_createdAt desc){
      title,
      slug,
      mainImage{asset->{url}, alt},
      summary,
      _createdAt
    }`

    const posts = await client.fetch(query)

    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}
```

### Cache Strategy Table

| Content Type | s-maxage | stale-while-revalidate |
|--------------|----------|------------------------|
| Static pages | 86400 (1 day) | 86400 |
| Blog listing | 60 (1 min) | 300 (5 min) |
| Single post | 60 | 300 |
| Products | 300 (5 min) | 3600 (1 hour) |

### Assessment
- [ ] API returns JSON data
- [ ] Response includes `Cache-Control` header
- [ ] Errors return 500 status
- [ ] Query projections are minimal
- [ ] Test with `curl` or browser

---

## Phase 6.5: Data Migration & Seeding [B1]

**Prerequisites**: Phase 3 complete (schemas defined)
**Estimated Time**: 45 minutes
**Cognitive Load**: Medium (3-4 concepts)

### Learning Objective
Migrate existing data to Sanity CMS using the Sanity client's mutate method.

### Success Criteria
- [ ] Create migration script with Sanity client
- [ ] Use `createOrReplace` for idempotent migrations
- [ ] Add `_key` to all array items for Studio editing
- [ ] Format slugs as `{ _type: "slug", current: "..." }`
- [ ] Match schema field types exactly

### Migration Script Template

```typescript
// scripts/migrate-to-sanity.ts
/**
 * Sanity CMS Migration Script
 *
 * This script migrates existing data to Sanity CMS.
 * Run with: npx dotenv-cli -e .env.local -- npx tsx scripts/migrate-to-sanity.ts
 */

import { createClient } from "@sanity/client";

// Configuration from environment
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN || "";

if (!token) {
  console.error("❌ SANITY_API_WRITE_TOKEN environment variable is required");
  process.exit(1);
}

// Create Sanity client
const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// ============ HELPER FUNCTIONS ============

/**
 * Generate a unique key for array items
 * Prevents "Missing keys" error in Sanity Studio
 */
function generateKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate URL-safe slug from text
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Convert local image path to Sanity image reference
 * Note: Images must be uploaded to Sanity assets first
 */
function createImageRef(assetId: string): {
  _type: string;
  asset: { _ref: string };
} {
  return {
    _type: "image",
    asset: {
      _ref: assetId,  // Format: "image-ABC123-800x1200-jpg"
    },
  };
}

// ============ MIGRATION FUNCTIONS ============

/**
 * Example: Migrate Blog Posts
 */
async function migrateBlogPosts() {
  console.log("📝 Migrating Blog Posts...");

  const posts = [
    {
      _id: "post-my-first-post",
      _type: "post",
      title: "My First Post",
      slug: { _type: "slug", current: "my-first-post" },
      excerpt: "This is a summary of my post...",

      // ✅ Portable Text content (rich text)
      content: [
        {
          _type: "block",
          style: "normal",
          children: [
            { _type: "span", text: "This is the " },
            { _type: "span", marks: ["strong"], text: "content" },
            { _type: "span", text: " of my blog post." },
          ],
        },
        {
          _type: "block",
          style: "h2",
          children: [{ _type: "span", text: "Key Section" }],
        },
      ],

      // ✅ Image with optional asset reference
      // mainImage: createImageRef("image-xxx-800x600-jpg"),

      // ✅ Reference to author document
      author: {
        _type: "reference",
        _ref: "author-john-doe",
      },

      // ✅ Array of category references
      categories: [
        { _type: "reference", _ref: "category-tech" },
        { _type: "reference", _ref: "category-tutorial" },
      ],

      publishedAt: "2024-01-15T09:00:00Z",
      featured: true,
    },
  ];

  const mutations = posts.map((post) => ({
    createOrReplace: post,
  }));

  await client.mutate(mutations);
  console.log(`✅ Migrated ${posts.length} blog posts`);
}

/**
 * Example: Migrate Products
 */
async function migrateProducts() {
  console.log("🛍️ Migrating Products...");

  const products = [
    {
      _id: "product-awesome-widget",
      _type: "product",
      title: "Awesome Widget",
      slug: { _type: "slug", current: "awesome-widget" },

      // ✅ Array with _key for each item (CRITICAL for Studio editing)
      colors: [
        { _key: generateKey(), name: "Red", hex: "#FF0000" },
        { _key: generateKey(), name: "Blue", hex: "#0000FF" },
        { _key: generateKey(), name: "Green", hex: "#00FF00" },
      ],

      // ✅ Simple string array (Sanity auto-generates keys)
      tags: ["widget", "awesome", "cool"],

      // ✅ Object array with nested structure
      specifications: [
        {
          _key: generateKey(),
          label: "Weight",
          value: "1.5 lbs",
        },
        {
          _key: generateKey(),
          label: "Dimensions",
          value: "10 x 5 x 3 inches",
        },
      ],

      price: 29.99,
      inStock: true,
    },
  ];

  const mutations = products.map((product) => ({
    createOrReplace: product,
  }));

  await client.mutate(mutations);
  console.log(`✅ Migrated ${products.length} products`);
}

/**
 * Example: Migrate Team Members
 */
async function migrateTeamMembers() {
  console.log("👥 Migrating Team Members...");

  const members = [
    {
      _id: "team-member-jane-smith",
      _type: "teamMember",
      name: "Jane Smith",
      slug: { _type: "slug", current: "jane-smith" },
      role: "Lead Developer",

      // ✅ Array of strings for skills
      skills: ["React", "TypeScript", "Node.js"],

      // ✅ Photo is optional - handle null case
      // photo: createImageRef("image-xxx-400x400-jpg"),

      bio: "Jane is an experienced developer...",

      // ✅ Social links as separate fields
      linkedinUrl: "https://linkedin.com/in/jane",
      githubUrl: "https://github.com/jane",

      featured: true,
      order: 1,
    },
  ];

  const mutations = members.map((member) => ({
    createOrReplace: member,
  }));

  await client.mutate(mutations);
  console.log(`✅ Migrated ${members.length} team members`);
}

// ============ MAIN FUNCTION ============

async function main() {
  console.log("🚀 Starting Sanity CMS Migration...\n");
  console.log(`Project ID: ${projectId}`);
  console.log(`Dataset: ${dataset}\n`);

  try {
    await migrateBlogPosts();
    await migrateProducts();
    await migrateTeamMembers();

    console.log("\n✅ Migration complete!");
    console.log("\n📝 Next steps:");
    console.log("1. Visit Sanity Studio to review imported content");
    console.log("2. Upload images and update asset references");
    console.log("3. Add missing content (images, rich text, etc.)");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
main();
```

### Step-by-Step Migration Guide

**Step 1: Prepare Environment Variables**

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-read-token
SANITY_API_WRITE_TOKEN=your-write-token  # Required for migrations!
```

**Step 2: Create Migration Script**

```bash
# Create the scripts directory
mkdir -p scripts

# Create migration file
touch scripts/migrate-to-sanity.ts
```

**Step 3: Copy Template & Customize**

1. Copy the template above into `scripts/migrate-to-sanity.ts`
2. Replace example data with your actual data
3. Match field names to your Sanity schemas
4. Add `_key` to all array items
5. Format slugs as `{ _type: "slug", current: "..." }`

**Step 4: Install Dependencies**

```bash
npm install --save-dev tsx @types/node
```

**Step 5: Run Migration**

```bash
# With dotenv-cli (recommended)
npx dotenv-cli -e .env.local -- npx tsx scripts/migrate-to-sanity.ts

# Or load .env manually
export $(cat .env.local | xargs) && npx tsx scripts/migrate-to-sanity.ts
```

**Step 6: Verify in Studio**

1. Open http://localhost:3000/studio
2. Navigate to each content type
3. Check that all fields are populated correctly
4. Test editing arrays (should work with `_key` present)

### Image Handling in Migrations

**Option 1: Upload Images First, Then Reference (Recommended)**

```typescript
// ✅ BEST: Upload via Sanity Studio, then reference by ID
const product = {
  _id: "product-1",
  _type: "product",
  title: "My Product",
  mainImage: {
    _type: "image",
    asset: {
      _ref: "image-ABC123-800x600-jpg",  // From Studio → Assets → Copy ID
    },
  },
};
```

**Option 2: Skip Images, Add Later**

```typescript
// ✅ GOOD: Skip images initially, add via Studio later
const product = {
  _id: "product-1",
  _type: "product",
  title: "My Product",
  // Don't include mainImage field if no asset available
};
```

**Option 3: Upload via API (Advanced)**

```typescript
// ⚠️ ADVANCED: Upload image assets via API
import { createClient } from "@sanity/client";

async function uploadImage(imageUrl: string): Promise<string> {
  // Fetch image
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  // Upload to Sanity
  const asset = await client.assets.upload("image", blob, {
    filename: "product-image.jpg",
  });

  return asset._id;  // Returns "image-ABC123-800x600-jpg"
}

// Use in migration
const imageId = await uploadImage("https://example.com/image.jpg");
const product = {
  mainImage: {
    _type: "image",
    asset: { _ref: imageId },
  },
};
```

**Handling Null/Optional Images in Components**

```typescript
// ✅ ALWAYS use optional chaining for images
const ImageComponent = ({ post }) => {
  return (
    <img
      src={post.mainImage?.asset?.url || "/images/placeholder.jpg"}
      alt={post.mainImage?.alt || post.title}
    />
  );
};

// ✅ OR check before accessing
const imageUrl = post.mainImage?.asset?.url;
if (!imageUrl) {
  return <PlaceholderImage />;
}
```

### Critical Migration Rules

| Rule | Why | Example |
|------|-----|---------|
| **Always add `_key`** | Studio needs unique keys to edit arrays | `{ _key: "abc123", value: "text" }` |
| **Use `createOrReplace`** | Idempotent - safe to run multiple times | Same `_id` will update, not duplicate |
| **Match field types** | Schema validation will reject mismatches | Array field → array data, not string |
| **Format slugs correctly** | Sanity expects slug object type | `{ _type: "slug", current: "my-slug" }` |
| **Use write token** | Read-only token can't mutate | `SANITY_API_WRITE_TOKEN` required |

### Field Type Mapping

| Schema Type | Migration Data Format | Example |
|-------------|----------------------|---------|
| `slug` | `{ _type: "slug", current: "value" }` | `{ slug: { _type: "slug", current: "my-post" } }` |
| `string` | `"plain text"` | `{ title: "Hello World" }` |
| `text` | `"long text content"` | `{ description: "Long description..." }` |
| `array` of strings | `["item1", "item2"]` (Sanity adds keys) | `{ tags: ["react", "nextjs"] }` |
| `array` of objects | `[{ _key: "...", field: "value" }]` | See "Object Arrays" below |
| `boolean` | `true` or `false` | `{ featured: true }` |
| `number` | `123` | `{ price: 29.99 }` |
| `datetime` | `"2024-01-15T09:00:00Z"` | `{ publishedAt: "2024-01-15T09:00:00Z" }` |
| `date` | `"2024-01-15"` | `{ eventDate: "2024-01-15" }` |
| `reference` | `{ _type: "reference", _ref: "target-id" }` | `{ author: { _type: "reference", _ref: "author-123" } }` |
| `array` of references | `[{ _type: "reference", _ref: "id" }]` | See "Reference Arrays" below |
| `image` | `{ _type: "image", asset: { _ref: "image-xxx" } }` | See "Image Handling" below |
| `file` | `{ _type: "file", asset: { _ref: "file-xxx" } }` | `{ attachment: { _type: "file", asset: { _ref: "file-abc" } } }` |
| `geopoint` | `{ _type: "geopoint", lat: 0, lng: 0 }` | `{ location: { _type: "geopoint", lat: 40.7, lng: -74.0 } }` |
| `block` (Portable Text) | `[{ _type: "block", children: [...] }]` | See "Portable Text" below |

#### Object Arrays (CRITICAL - Must Include `_key`)

```typescript
// ❌ WRONG - Missing _key (causes "Missing keys" error)
{
  features: [
    { title: "Fast", description: "Very fast" },
    { title: "Secure", description: "Very secure" },
  ]
}

// ✅ CORRECT - Each item has unique _key
{
  features: [
    { _key: "feat-1", title: "Fast", description: "Very fast" },
    { _key: "feat-2", title: "Secure", description: "Very secure" },
  ]
}

// Use helper function
{
  features: data.map(item => ({
    _key: generateKey(),
    ...item
  }))
}
```

#### Reference Arrays

```typescript
// Single reference
{
  author: { _type: "reference", _ref: "author-john-doe" }
}

// Array of references
{
  categories: [
    { _type: "reference", _ref: "category-tech" },
    { _type: "reference", _ref: "category-tutorial" },
  ]
}

// For self-referencing (document references itself in array)
{
  relatedPosts: [
    { _type: "reference", _ref: "post-abc123", _strengthenOnPublish: true }
  ]
}
```

#### Image Handling

**Option 1: Reference Existing Asset (Recommended)**

```typescript
{
  mainImage: {
    _type: "image",
    asset: {
      _ref: "image-ABC123-800x600-jpg",  // From Studio → Assets
    }
  }
}
```

**Option 2: Image with Hotspot and Alt Text**

```typescript
{
  mainImage: {
    _type: "image",
    asset: {
      _ref: "image-ABC123-800x600-jpg"
    },
    hotspot: {
      x: 0.5,
      y: 0.5,
      height: 0.3,
      width: 0.3
    },
    crop: {
      left: 0.1,
      top: 0.1,
      right: 0.9,
      bottom: 0.9
    }
  }
}
```

**Option 3: Skip Image Field (If No Asset)**

```typescript
{
  title: "My Post",
  // Don't include mainImage if no asset available
  // Components should handle null case with optional chaining
}
```

**Handling Null Images in Components:**

```typescript
// ✅ ALWAYS use optional chaining
<img
  src={post.mainImage?.asset?.url || "/placeholder.jpg"}
  alt={post.mainImage?.alt || post.title}
/>

// ✅ OR check before rendering
{post.mainImage?.asset?.url ? (
  <img src={post.mainImage.asset.url} alt={post.mainImage.alt || ""} />
) : (
  <PlaceholderImage />
)}

// ✅ OR use optional chaining with urlFor helper
import { urlFor } from "@/sanity/lib/image";

<img
  src={urlFor(post.mainImage).url() || "/placeholder.jpg"}
  alt={post.mainImage?.alt || post.title}
/>
```

#### Portable Text (Rich Content)

```typescript
// Simple paragraph
{
  content: [
    {
      _type: "block",
      style: "normal",
      children: [
        { _type: "span", text: "This is a paragraph." }
      ]
    }
  ]
}

// With formatting (bold, italic)
{
  content: [
    {
      _type: "block",
      style: "normal",
      children: [
        { _type: "span", text: "This is " },
        { _type: "span", marks: ["strong"], text: "bold" },
        { _type: "span", text: " and " },
        { _type: "span", marks: ["em"], text: "italic" },
        { _type: "span", text: "." }
      ]
    }
  ]
}

// Heading
{
  content: [
    {
      _type: "block",
      style: "h2",
      children: [
        { _type: "span", text: "Section Heading" }
      ]
    }
  ]
}

// List
{
  content: [
    {
      _type: "block",
      style: "normal",
      listItem: "bullet",
      level: 1,
      children: [
        { _type: "span", text: "First item" }
      ]
    },
    {
      _type: "block",
      style: "normal",
      listItem: "bullet",
      level: 1,
      children: [
        { _type: "span", text: "Second item" }
      ]
    }
  ]
}

// Link
{
  content: [
    {
      _type: "block",
      style: "normal",
      children: [
        { _type: "span", text: "Visit " },
        {
          _type: "span",
          marks: ["abc123"],
          text: "our website"
        }
      ]
    }
  ],
  marks: [
    {
      _key: "abc123",
      _type: "link",
      href: "https://example.com"
    }
  ]
}
```

### Running the Migration

```bash
# With environment variables
npx dotenv-cli -e .env.local -- npx tsx scripts/migrate-to-sanity.ts

# Or with cross-env (Windows)
npx cross-env SANITY_API_WRITE_TOKEN=xxx npx tsx scripts/migrate-to-sanity.ts
```

### Assessment
- [ ] Migration runs without errors
- [ ] Items appear in Sanity Studio
- [ ] Array items are editable (no "missing keys" error)
- [ ] Re-running migration updates existing items (doesn't duplicate)
- [ ] All field types match schema expectations

---

## Phase 7: Dynamic Routes with ISR [B2]

**Prerequisites**: Phase 6 complete (API routes)
**Estimated Time**: 90 minutes
**Cognitive Load**: High (5-6 concepts)

### Learning Objective
Implement dynamic routes with ISR, `generateStaticParams`, and `generateMetadata`.

### Success Criteria
- [ ] Create dynamic route at `app/[content]/[slug]/page.tsx`
- [ ] Implement `generateStaticParams` for build-time generation
- [ ] Set `export const revalidate` for ISR
- [ ] Implement `generateMetadata` for SEO
- [ ] Handle 404 for missing content
- [ ] Use `await params` pattern (Next.js 15)

### Template Pattern

```typescript
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { Metadata } from "next"
import { notFound } from "next/navigation"

// ISR: Revalidate every 60 seconds
export const revalidate = 60
export const dynamicParams = true

// Generate static params at build time
export async function generateStaticParams() {
  const query = `*[_type == "post"]{
    "slug": slug.current
  }`

  const posts = await client.fetch(query)
  return posts.map((post: { slug: string }) => ({ slug: post.slug }))
}

// Generate SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const query = `*[_type == "post" && slug.current == "${slug}"]{
    title,
    summary,
    mainImage,
    seoTitle,
    seoDescription
  }[0]`

  const post = await client.fetch(query)

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.summary,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.summary,
      url: `https://yourdomain.com/blog/${slug}`,
      images: [{
        url: urlFor(post.mainImage).width(1200).height(630).url(),
        width: 1200,
        height: 630,
        alt: post.title,
      }],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  }
}

// Page component
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const query = `*[_type == "post" && slug.current == "${slug}"]{
    title,
    content,
    publishedAt,
    author->{name, bio},
    categories[]->{title}
  }[0]`

  const post = await client.fetch(query)

  if (!post) {
    notFound()
  }

  return <Article post={post} />
}
```

### Key Concepts

**1. Async Params (Next.js 15)**
```typescript
// Always await params
const { slug } = await params
```

**2. ISR Revalidation**
```typescript
export const revalidate = 60  // seconds
```

**3. Static Params Generation**
```typescript
export async function generateStaticParams() {
  // Return array of { slug: string } objects
}
```

### Assessment
- [ ] Page loads at `/blog/[slug]`
- [ ] Metadata renders in page source
- [ ] Open Graph image displays on social share
- [ ] 404 renders for invalid slug
- [ ] ISR revalidates after 60 seconds

---

## Phase 8: SEO Best Practices [B2]

**Prerequisites**: Phase 7 complete (dynamic routes)
**Estimated Time**: 60 minutes
**Cognitive Load**: High (5 concepts)

### Learning Objective
Implement comprehensive SEO with metadata, structured data, sitemaps.

### Success Criteria
- [ ] Add SEO fields to schema (seoTitle, seoDescription, focusKeyword)
- [ ] Implement JSON-LD structured data
- [ ] Generate dynamic sitemap
- [ ] Configure robots.txt
- [ ] Set canonical URLs

### SEO Schema Fields

```typescript
defineField({
  name: "seoTitle",
  title: "SEO Title",
  type: "string",
  description: "Override page title (60 chars max)",
  validation: (Rule) => Rule.max(60),
})

defineField({
  name: "seoDescription",
  title: "SEO Description",
  type: "text",
  rows: 3,
  description: "Meta description (160 chars max)",
  validation: (Rule) => Rule.max(160),
})

defineField({
  name: "noIndex",
  title: "No Index",
  type: "boolean",
  description: "Prevent search engine indexing",
  initialValue: false,
})
```

### JSON-LD Structured Data

```typescript
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.summary,
  image: urlFor(post.mainImage).url(),
  author: {
    "@type": "Person",
    name: post.author.name,
  },
  datePublished: post.publishedAt,
  dateModified: post._updatedAt,
}

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

### Dynamic Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export default async function sitemap(): MetadataRoute {
  const baseUrl = 'https://yourdomain.com'

  const posts = await client.fetch(
    `*[_type == "post"]{ "slug": slug.current, _updatedAt }`
  )

  return [
    { url: baseUrl, lastModified: new Date() },
    ...posts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt),
    })),
  ]
}
```

### robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/api/'],
    },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}
```

### Assessment
- [ ] Metadata renders in `<head>`
- [ ] JSON-LD validates at [richresultstest.google.com](https://richresultstest.google.com)
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] robots.txt accessible at `/robots.txt`
- [ ] Canonical URLs set correctly

---

## Phase 9: Live Content API [B2]

**Prerequisites**: Phase 7 complete (ISR + dynamic routes)
**Estimated Time**: 45 minutes
**Cognitive Load**: High (4 concepts)

### Learning Objective
Implement real-time content updates using Sanity Live Content API.

### Success Criteria
- [ ] Create `sanity/lib/live.ts` with `defineLive`
- [ ] Configure `SANITY_API_READ_TOKEN` environment variable
- [ ] Use `sanityFetch` instead of `client.fetch`
- [ ] Include `<SanityLive />` component in pages
- [ ] Content updates appear without refresh

### Setup

```bash
npm install next-sanity@latest
```

### Live Client Configuration

Create `sanity/lib/live.ts`:

```typescript
import { createClient } from 'next-sanity'
import { defineLive } from 'next-sanity/live'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,  // Required for live content
  stega: { studioUrl: '/studio' },
})

const token = process.env.SANITY_API_READ_TOKEN
if (!token) {
  throw new Error('Missing SANITY_API_READ_TOKEN')
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})
```

### Usage in Components

```typescript
import { sanityFetch, SanityLive } from '@/sanity/lib/live'

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { data: post } = await sanityFetch({
    query: `*[_type == "post" && slug.current == $slug][0]{
      title,
      content,
      publishedAt
    }`,
    params: { slug },
    perspective: 'published',  // or 'previewDrafts' for drafts
  })

  return (
    <article>
      <h1>{post.title}</h1>
      <PortableText value={post.content} />
      <SanityLive /> {/* Enables real-time updates */}
    </article>
  )
}
```

### Perspective Modes

| Mode | Use When |
|------|----------|
| `published` | Production content only |
| `previewDrafts` | Include unpublished drafts |
| `raw` | Draft mode editing |

### Assessment
- [ ] Content updates appear instantly in browser
- [ ] No page refresh required
- [ ] `<SanityLive />` component renders
- [ ] Console shows live content connection
- [ ] Works in development and production

---

## Common Content Types

### Blog Posts
- Fields: title, slug, author (reference), mainImage, categories, summary, content, publishedAt
- Features: SEO metadata, author display, categories, likes/dislikes, FAQs

### Products
- Fields: title, slug, price, compareAtPrice, description, images (array), categories, inStock, variants
- Features: Price display, gallery, variant selection, stock status

### Services
- Fields: title, slug, description, icon, features, pricing, process, faqs
- Features: Pricing tiers, FAQ accordion, process steps

### Events
- Fields: title, slug, startDate, endDate, location, description, image, registrationLink
- Features: Date formatting, location display, upcoming/past filtering

---

## Troubleshooting & Debugging Guide

### Common Issues and Solutions

This section covers real-world issues encountered during Sanity CMS integration with Next.js.

| Issue | Symptoms | Cause | Solution |
|-------|----------|-------|----------|
| **Stale build cache** | Content shows old data even after Sanity updates | `.next` directory contains cached builds | Delete `.next` directory: `rm -rf .next` or `rd /s /q .next` (Windows) |
| **Missing count mismatch** | Sanity Studio shows X items, frontend shows Y | Stale webpack cache holding old query results | Clear `.next` cache and rebuild |
| **API returns wrong count** | API endpoint returns fewer items than Studio | Browser caching or stale build cache | Add cache-busting: `fetch(\`/api/endpoint?t=\${Date.now()}\`)` |
| **Blog related posts empty** | "More articles coming soon" when posts exist | Missing `fetchAllPosts()` function | Add function to fetch all posts for related section |
| **Dummy data showing** | Hardcoded fallback data appears instead of CMS data | Fallback data not removed from components | Return `null` instead of fallback objects |
| **TypeScript build errors** | Build fails with type errors in migration scripts | Incorrect type usage in standalone scripts | Delete unused scripts or fix types |
| **Placeholder images missing** | Broken image links for missing assets | Fallback `/placeholder.svg` removed | Keep placeholder image fallbacks in components |

---

### Debugging Methods

#### 1. Verify Studio Data

Always confirm data exists in Sanity Studio first:

```bash
# Open Sanity Studio Vision
# Run query to verify data:
*[_type == "yourType" && isActive == true]{
  _id,
  title,
  "slug": slug.current,
  isActive
}
```

#### 2. Test API Endpoint Directly

Use `curl` to verify API returns correct data:

```bash
# Test API endpoint
curl http://localhost:3000/api/services

# With cache-busting
curl "http://localhost:3000/api/services?t=$(date +%s)"

# Check response count
curl http://localhost:3000/api/services | jq '. | length'
```

#### 3. Add Debug Logging

Add console.log to API routes:

```typescript
// app/api/services/route.ts
const services = await client.fetch(query, {}, { useCdn: false });
console.log(`[API /api/services] Fetched ${services.length} services:`,
  services.map(s => ({ id: s._id, title: s.title, isActive: s.isActive }))
);
```

#### 4. Check Browser Console

Look for fetch logs in browser console:

```typescript
// In client component
useEffect(() => {
  async function fetchData() {
    const response = await fetch(`/api/services?t=${new Date().getTime()}`);
    const data = await response.json();
    console.log(`Fetched Services from Sanity: (${data.length})`, data);
  }
  fetchData();
}, []);
```

#### 5. Clear Caches (In Order)

```bash
# 1. Clear Next.js build cache
rm -rf .next

# 2. Clear node_modules (if needed)
rm -rf node_modules package-lock.json
npm install

# 3. Restart dev server
npm run dev
```

---

### Component-Level Troubleshooting

#### Issue: Component Returns `null` But Should Show Content

**Check these in order:**

1. **Is the API returning data?**
   ```bash
   curl http://localhost:3000/api/your-endpoint
   ```

2. **Is the component handling loading state?**
   ```typescript
   if (loading) return <Skeleton />;  // Should show skeleton
   if (data.length === 0) return null;  // Correct - no data
   ```

3. **Is Sanity config valid?**
   ```typescript
   const config = validateSanityConfig();
   console.log('Sanity config:', config);  // Should show { valid: true }
   ```

---

### Cache Strategy Issues

| Problem | Solution |
|---------|----------|
| Content not updating after CMS change | Check `useCdn: false` for ISR, or clear `.next` cache |
| API returns stale data | Add `Cache-Control: no-store` headers for development |
| Browser caching API responses | Add cache-busting query param: `?t=${Date.now()}` |
| Build includes old content | Delete `.next` and rebuild: `rm -rf .next && npm run build` |

---

### Data Migration Verification

After migration, verify in this order:

```bash
# 1. Check Studio count
# Open Studio, count items manually

# 2. Verify via GROQ
*[_type == "yourType"]{ _id, title } | count

# 3. Test array editing
# Try to edit an array field - should work without "Missing keys" error

# 4. Verify references
# Check that referenced documents exist
*[_type == "post" && !defined(author)]{_id, title}
```

---

### Environment Variable Issues

| Symptom | Check | Fix |
|---------|-------|-----|
| `projectId` is empty | `.env.local` not loaded | Restart dev server after adding env vars |
| API returns 401 | Missing/wrong read token | Verify `SANITY_API_READ_TOKEN` |
| Writes fail | Missing write token | Add `SANITY_API_WRITE_TOKEN` |
| Studio won't load | Wrong project ID | Check `.env.local` matches Sanity project |

---

### Quick Debug Checklist

```
□ Data visible in Sanity Studio?
□ API endpoint returns correct data (curl test)?
□ Browser console shows fetch success?
□ `.next` cache cleared recently?
□ Environment variables loaded correctly?
□ Client configured with correct dataset?
□ Query uses proper projections?
□ Components use optional chaining for optional fields?
□ Placeholder image fallbacks exist?
□ Build runs without TypeScript errors?
```

---

### Common Pitfalls

| Pitfall | Cause | Solution |
|---------|--------|----------|
| **Stale `.next` cache** | Build cache holds old query results | Delete `.next` directory and restart dev server |
| **Browser caching API** | Fetch returns cached responses | Add `?t=${Date.now()}` cache-busting parameter |
| **Missing `_key` in arrays** | Array items created via API without keys | Always add `_key` property to array items (see Array Key Pattern below) |
| **Hydration mismatch** | Using browser APIs in server components | Use `"use client"` for interactive components |
| **Missing alt text** | Images without accessibility | Add alt field to all image schemas |
| **Slow queries** | Not projecting specific fields | Always use GROQ projections |
| **CDN serving stale content** | `useCdn: true` with ISR | Set `useCdn: false` for ISR |
| **Type errors** | Sanity types not matching | Create proper TypeScript interfaces |
| **Params not awaited** | Forgetting `await params` | Next.js 15 requires async params |
| **Wrong config location** | `sanity.config.ts` in subfolder | Must be at project root for `NextStudio` |
| **Missing basePath** | Route doesn't match config | Set `basePath: '/studio'` in config |
| **Metadata export error** | Exporting metadata from client component | Remove metadata exports from client components |
| **Schema type mismatch** | Array field vs string data | Match schema field types with migrated data |
| **Studio header overlap** | Fixed header covering Studio | Add `marginTop: "80px"` wrapper div |
| **Null image access** | Accessing `.asset` on null image | Always use optional chaining: `mainImage?.asset?.url` |
| **Missing alt on images** | Image without alt text | Add alt field to image schema, set as required |
| **Image upload failure** | Large images or unsupported formats | Limit to 10MB, use webp/jpg/png |
| **Wrong image ref format** | Using URL instead of asset reference | Use `{ _type: "image", asset: { _ref: "..." } }` |
| **Undefined optional fields** | Not handling null/undefined in components | Use optional chaining everywhere: `field?.subField` |
| **Date format errors** | Wrong datetime string format | Use ISO 8601: `"2024-01-15T09:00:00Z"` |
| **Reference target missing** | Referencing non-existent document | Create referenced document first, or use weak reference |

### Array Key Pattern (CRITICAL)

**When creating array items via API client, ALWAYS include `_key` property:**

```typescript
// ❌ WRONG - Will cause "Missing keys" error in Studio
const career = {
  _type: "career",
  requirements: [
    "5+ years of experience",
    "Strong proficiency in TypeScript",
  ],
}

// ✅ CORRECT - Each array item has a unique _key
const career = {
  _type: "career",
  requirements: [
    { _key: "req-1", value: "5+ years of experience" },
    { _key: "req-2", value: "Strong proficiency in TypeScript" },
  ],
}

// OR for simple string arrays with Sanity's built-in handling:
const career = {
  _type: "career",
  requirements: [
    "5+ years of experience",  // Sanity auto-generates keys via Studio
    "Strong proficiency in TypeScript",
  ],
}
```

**Helper function to generate keys:**

```typescript
function generateKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Use it when creating arrays:
const items = data.map((item) => ({
  _key: generateKey(),
  ...item,
}))
```

### Studio Setup Checklist

| Step | Requirement | Common Mistake |
|------|-------------|----------------|
| Config location | `sanity.config.ts` at project root | Placing in `sanity/` folder |
| basePath | `basePath: '/studio'` must match route | Forgetting this causes 404s |
| Client component | `"use client"` directive needed | Server component won't render Studio |
| Metadata | Don't export from client component | Causes build error |
| Import path | Import from root config | Using `@/sanity/config` fails |

**Correct Studio page pattern:**

```typescript
// app/studio/[[...index]]/page.tsx
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";  // Import from root

export default function StudioPage() {
  return (
    <div style={{ marginTop: "80px" }}>  // Avoid header overlap
      <NextStudio config={config} />
    </div>
  );
}
```

### Schema Migration Gotchas

| Issue | Cause | Prevention |
|-------|--------|-------------|
| **Array vs String mismatch** | Schema defines `array`, migration uses `string` | Verify schema types before migration |
| **Missing field names** | Schema uses different names than migration | Match schema field names exactly |
| **Slug format** | Migration uses string, schema expects object | Use `{ _type: "slug", current: "..." }` format |
| **Portable Text vs Text** | Schema expects block array, data is string | Decide on content type upfront |

**Slug format example:**

```typescript
// ❌ WRONG
{ slug: "my-post" }

// ✅ CORRECT
{ slug: { _type: "slug", current: "my-post" } }
```

---

## MCP Tool Usage

**Context7 MCP** (for library docs):
- Sanity: `/sanity-io/next-sanity` - Client config, Live Content API
- Next.js: `/vercel/next.js` - App Router, ISR, metadata
- Portable Text: Search for `@portabletext/react`

**Tavily MCP** (for research):
- "Sanity CMS best practices 2025"
- "Next.js ISR caching optimization"
- "Sanity Live Content API tutorial"

---

## Content Structure Builder

Customize Sanity Studio structure (`sanity/structure.ts`):

```typescript
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Blog Posts')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('postType').title('Posts')),
      S.listItem()
        .title('Products')
        .icon(ShoppingBagIcon)
        .child(S.documentTypeList('productType').title('Products')),
      S.divider(),
      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(S.documentTypeList('categoryType').title('Categories')),
    ])
```

---

## TypeScript Type Generation

Generate types from Sanity schemas:

```bash
npx sanity-codegen sanity/schemaTypes --output types/sanity.d.ts
```

Or create manual types:

```typescript
// types/content.ts
export interface Post {
  _id: string
  title: string
  slug: { current: string }
  summary: string
  mainImage: SanityImage
  content: PortableTextBlock[]
  _createdAt: string
  _updatedAt: string
}
```

---

## Deployment Checklist

Before deploying, verify:

- [ ] All schemas have slugs for URL generation
- [ ] Images have alt text fields (required)
- [ ] API routes have proper caching headers
- [ ] ISR revalidate is configured appropriately
- [ ] `generateMetadata` implemented for dynamic routes
- [ ] TypeScript types match schema definitions
- [ ] Portable Text components have proper styling
- [ ] CDN disabled when using ISR (`useCdn: false`)
- [ ] Environment variables configured:
  - [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - [ ] `NEXT_PUBLIC_SANITY_DATASET`
  - [ ] `SANITY_API_READ_TOKEN` (if using Live Content API)
- [ ] Stega configured for visual editing (development)
- [ ] `<SanityLive />` component included (if using Live Content API)
- [ ] Sitemap generates at `/sitemap.xml`
- [ ] robots.txt configured at `/robots.txt`
- [ ] JSON-LD structured data validates
- [ ] Open Graph images are 1200x630
- [ ] Canonical URLs set correctly

---

## Reference Files

See `references/` for detailed patterns:
- `references/schema-patterns.md` - Advanced schema design
- `references/groq-cheatsheet.md` - Query examples
- `references/seo-guide.md` - SEO implementation patterns
- `references/nextjs-isr.md` - Caching strategies
- `references/blog-rendering.md` - **NEW:** Complete blog rendering guide with code blocks, TOC, FAQs, images, and more

---

## Certification Requirements (B2 Level)

To achieve B2 certification in this skill:

**Knowledge Assessment:**
- [ ] Explain difference between ISR and static generation
- [ ] Describe when to use `useCdn: false`
- [ ] Explain GROQ projection benefits

**Practical Assessment:**
- [ ] Create complete Sanity schema with references
- [ ] Implement ISR route with revalidation
- [ ] Build API route with caching headers
- [ ] Generate dynamic sitemap from Sanity content
- [ ] Implement Live Content API for real-time updates

**Production Readiness:**
- [ ] Deploy Sanity + Next.js to production
- [ ] Verify ISR revalidation works
- [ ] Confirm SEO metadata renders correctly
- [ ] Test sitemap accessibility
- [ ] Validate structured data

---

## Next.js 15 Compatibility Notes

- **Params are now Promises**: Always `await params` in async functions
- **Dynamic params**: Use `params: Promise<{ slug: string }>` type
- **Static generation**: Use `dynamicParams = true` for partial static generation
- **generateMetadata**: Also requires `await params`

---

## Caching Strategy Summary

| Strategy | Use When | Revalidate | useCdn |
|----------|----------|------------|--------|
| **force-static** | Content that rarely changes | Build time | `true` |
| **ISR (revalidate)** | Content that changes periodically | 60-3600 seconds | `false` |
| **Live Content API** | Instant updates needed | Real-time | `false` |
| **On-demand** | Content that updates immediately | Tag-based | `false` |
| **Client fetch** | Real-time or user-specific | No caching | `false` |

---

**Version**: 1.7.0
**Last Updated**: 2025-02-08
**Proficiency Framework**: CEFR + Bloom's Taxonomy + DigComp
**Progression**: A2 → A2 → B1 → B1 → B1 → B1.5 → B2 → B2 → B2

## What's New (v1.8.1)

### Bug Fix: Correct Sanity Webhook Signature Verification

Fixed critical bug in signature verification that caused webhook authentication failures:

**The Problem:**
- Sanity sends signature in format: `t=timestamp,v1=signature` (NOT `sha256=<base64>`)
- Original code expected Stripe-style format with `sha256=` prefix
- Result: All webhooks failed with 401 Unauthorized despite having correct secret

**The Fix:**
- Updated `verifySignature()` to parse Sanity's actual format
- Changed header from `x-sanity-webhook-signature` to `sanity-webhook-signature`
- Direct HMAC comparison instead of buffer comparison
- Added proper error logging for debugging

**Code Changes:**
```typescript
// Before (incorrect):
const signature = request.headers.get("x-sanity-webhook-signature");
const providedSignature = signature.replace("sha256=", "");
return crypto.timingSafeEqual(
  Buffer.from(digest, "base64"),
  Buffer.from(providedSignature, "base64")
);

// After (correct):
const signature = request.headers.get("sanity-webhook-signature");
const parts = signature.split(",");
const signatureValue = parts.find(p => p.startsWith("v1="))?.substring(3);
return digest === signatureValue;
```

**What This Means:**
- Webhooks now work correctly with Sanity's actual signature format
- Content updates immediately when published in Sanity Studio
- Debug logs show actual headers received from Sanity

## What's New (v1.8.0)

### Major Addition: Complete Webhook On-Demand Revalidation

Production-ready webhook implementation for instant content updates:

- **NEW: Complete Webhook Route Implementation** - Full `app/api/revalidate/route.ts` with HMAC signature verification
- **NEW: Security Best Practices** - HMAC signature verification with timing-safe comparison
- **NEW: Document Type Mapping** - Automatic tag and path revalidation based on content type
- **NEW: Detailed Setup Guide** - Step-by-step webhook configuration in Sanity Studio
- **NEW: Testing & Troubleshooting** - GET endpoint for webhook testing and debugging
- **NEW: Complete Tag System** - All queries updated with cache tags for granular revalidation

**Benefits:**
- Content updates **immediately** when published in Sanity Studio
- No waiting for time-based cache expiration (30min-24hr fallback)
- Better user experience with instant content updates
- Still maintains time-based fallback if webhook fails

**What Changed:**
| Feature | Before | After |
|---------|--------|-------|
| Blog update time | 1 hour | **Immediate** |
| Career update time | 30 min | **Immediate** |
| Service update time | 24 hours | **Immediate** |
| Fallback if webhook fails | N/A | Time-based still works |

## What's New (v1.7.0)

### Major Addition: Next.js 15 Caching Best Practices

Based on latest research from Sanity and Next.js documentation:

- **NEW: `sanityFetch` Helper Pattern** - Centralized caching configuration with time-based and tag-based revalidation
- **NEW: React `cache` Function** - Automatic query deduplication across render passes
- **NEW: CDN Configuration** - Enable `useCdn: true` in production for better performance
- **NEW: Recommended Revalidation Times** - Content-type specific cache durations
- **NEW: On-Demand Revalidation** - Webhook-based cache invalidation patterns
- **NEW: Query Optimization Patterns** - Prevent duplicate requests and over-fetching

Key Changes from Next.js 14 to 15:
| Aspect | Next.js 14 | Next.js 15 |
|--------|-------------|-------------|
| Default fetch caching | Aggressive (cached) | Opt-out (no cache) |
| Required action | Nothing | Must set `cache: 'force-cache'` or `next: { revalidate }` |
| useCdn recommendation | false for ISR | true in production |
| Cache invalidation | Automatic | Explicit (tags or time-based) |

### New Core Pattern: `sanityFetch` Helper

```typescript
// sanity/lib/client.ts
export async function sanityFetch<constQueryString extends string>({
  query,
  params = {},
  revalidate = 3600, // 1 hour default
  tags = [],
}: {
  query: constQueryString;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}) {
  const client = getClient();
  if (!client) throw new Error("Sanity client not configured");

  return client.fetch(query, params, {
    cache: 'force-cache', // Required in Next.js 15
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  });
}
```

### New Core Pattern: Cached Query Utilities

```typescript
// sanity/lib/queries.ts
import { cache } from "react";
import { sanityFetch } from "./client";

// Memoized query - automatic deduplication
export const getPosts = cache(async (limit = 10) => {
  return sanityFetch({
    query: `*[_type == "post"] | order(publishedAt desc)[0...${limit}] {
      _id, title, "slug": slug.current, excerpt, publishedAt
    }`,
    revalidate: 3600, // 1 hour
  });
});
```

### Recommended Revalidation Times

| Content Type | Revalidate | Rationale |
|--------------|-----------|-----------|
| **Blog Posts** | 3600s (1 hour) | Content doesn't change often after publish |
| **Blog Detail** | 3600s (1 hour) | Same as listing |
| **Careers** | 1800s (30 min) | Job postings change moderately |
| **Team Members** | 3600s (1 hour) | Team changes infrequently |
| **Services** | 86400s (24 hours) | Rarely changes |
| **Site Settings** | 86400s (24 hours) | Very static |

### On-Demand Revalidation with Webhooks

**What it does:** Content updates **immediately** when you publish in Sanity Studio, instead of waiting for time-based cache expiration.

**Benefits:**
- Instant content updates after publishing
- No waiting for cache expiration
- Better user experience
- Still has time-based fallback

#### Complete Webhook Implementation

```typescript
// app/api/revalidate/route.ts
import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

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
      console.error("Could not extract v1 signature from:", signature);
      return false;
    }

    // Compute HMAC signature using the same method as Sanity
    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
    hmac.update(body, "utf8");
    const digest = hmac.digest("base64");

    // Compare signatures directly
    return digest === signatureValue;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

/**
 * Map Sanity document types to cache tags and paths
 */
function getRevalidationConfig(docType: string) {
  const configs: Record<string, { tags: string[]; pathPrefix?: string }> = {
    post: { tags: ["posts"], pathPrefix: "/blog" },
    career: { tags: ["careers"], pathPrefix: "/career" },
    teamMember: { tags: ["team"], pathPrefix: "/team" },
    service: { tags: ["services"], pathPrefix: "/services" },
    testimonial: { tags: ["testimonials"] },
    successStory: { tags: ["successStories"] },
  };

  return configs[docType];
}

export async function POST(request: Request) {
  try {
    // Sanity sends signature as: sanity-webhook-signature
    // Format: t=timestamp,v1=signature
    const signature = request.headers.get("sanity-webhook-signature");
    if (!signature) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get raw body FIRST (can only read stream once)
    const rawBody = await request.text();
    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { _type, slug, operation } = payload;

    const config = getRevalidationConfig(_type);
    if (!config) {
      return NextResponse.json({
        revalidated: false,
        message: `No revalidation configured for type: ${_type}`,
      });
    }

    // Revalidate cache tags
    for (const tag of config.tags) {
      revalidateTag(tag);
    }

    // Revalidate specific path if slug is available
    if (config.pathPrefix && slug?.current) {
      revalidatePath(`${config.pathPrefix}/${slug.current}`);
    }

    // Revalidate listing page
    if (config.pathPrefix) {
      revalidatePath(config.pathPrefix);
    }

    return NextResponse.json({
      revalidated: true,
      type: _type,
      slug: slug?.current,
      operation,
      tags: config.tags,
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET handler for testing
export async function GET() {
  return NextResponse.json({
    webhook: "/api/revalidate",
    status: WEBHOOK_SECRET ? "configured" : "missing-secret",
    supportedTypes: ["post", "career", "teamMember", "service", "testimonial", "successStory"],
  });
}
```

#### Update Queries to Use Tags

```typescript
// sanity/lib/queries.ts
export const getPosts = cache(async (limit = 10): Promise<BlogPost[]> => {
  return sanityFetch({
    query: `*[_type == "post"] | order(publishedAt desc)[0...${limit}] { ... }`,
    revalidate: 3600, // 1 hour fallback
    tags: ["posts"], // Enable webhook revalidation
  });
});

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const results = await sanityFetch({
    query: `*[_type == "post" && slug.current == $slug][0]{ ... }`,
    params: { slug },
    revalidate: 3600,
    tags: ["posts", `post:${slug}`], // Multiple tags for granular control
  });
  return results[0] || null;
});
```

#### Sanity Webhook Configuration

**Step 1: Generate Secret**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Step 2: Add Environment Variable**
```bash
# .env.local
SANITY_WEBHOOK_SECRET=your-generated-secret-here

# Netlify/Vercel
# Add to environment variables
```

**Step 3: Configure Webhook in Sanity**

Go to [sanity.io/manage](https://sanity.io/manage) → your project → **API → Webhooks** → **+ New webhook**

| Field | Value |
|-------|-------|
| **Name** | Next.js Cache Revalidation |
| **URL** | `https://yourdomain.com/api/revalidate` |
| **Dataset** | `production` |
| **Trigger on** | ✅ Create, ✅ Update, ✅ Delete |
| **Filter** | *Leave empty* (triggers on all types) |
| **Projection** | `{ _id, _type, "slug": slug.current }` |
| **HTTP Method** | `POST` |
| **Secret** | Paste your `SANITY_WEBHOOK_SECRET` |
| **API Version** | `v2024-01-01` |
| **Drafts** | ❌ OFF (don't trigger on drafts) |
| **Versions** | ❌ OFF (not needed) |

**Step 4: Test Webhook**

1. Test endpoint is accessible:
```bash
curl https://yourdomain.com/api/revalidate
```

2. Publish content in Sanity Studio
3. Check server logs for: `✅ Webhook: Revalidated post (update)`
4. Visit the page - content should be updated immediately

#### Supported Document Types

| Document Type | Cache Tags | Paths Revalidated |
|--------------|-----------|-------------------|
| `post` | `posts`, `post:{slug}` | `/blog`, `/blog/{slug}` |
| `career` | `careers`, `career:{slug}` | `/career`, `/career/{slug}` |
| `teamMember` | `team` | `/team` |
| `service` | `services` | `/services` |
| `testimonial` | `testimonials` | (Homepage) |
| `successStory` | `successStories` | (Homepage) |

### Client Configuration Update

```typescript
// sanity/lib/client.ts
export function getClient(): SanityClient | null {
  // ...
  _client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: process.env.NODE_ENV === "production", // ✅ Enable CDN in production
    // ...
  });
}
```

### Best Practices for Low-Traffic Sites (2-5k visits/month)

1. **Use CDN in production** - Set `useCdn: true` for better performance
2. **Time-based revalidation** - Default to 1 hour for most content
3. **Tag-based for immediate updates** - Use webhooks for critical content
4. **React `cache` for memoization** - Prevents duplicate requests in same render
5. **Direct client in server components** - Avoid API route overhead
6. **Optimize related posts queries** - Only fetch needed fields, not all posts

### Sanity Free Plan Usage (2-5k visits/month)

| Resource | Limit | Expected Usage | Buffer |
|-----------|-------|----------------|--------|
| API Requests | 200k/month | ~10k-30k | 85%+ remaining |
| CDN Requests | 1M/month | ~50k-150k | 85%+ remaining |
| Bandwidth | 20GB | ~5-10GB | 50%+ remaining |

**Conclusion:** With proper caching, you're well within limits.

## What's New (v1.6.0)

### Major Addition: Troubleshooting & Debugging Guide
- **NEW: Complete Troubleshooting Section** - Real-world issues and solutions from production:
  - **Stale build cache** - Content showing old data after Sanity updates (delete `.next` directory)
  - **Count mismatch** - Studio shows X items, frontend shows Y (clear webpack cache)
  - **API returns wrong count** - Browser caching or stale build (add cache-busting query param)
  - **Blog related posts empty** - Missing `fetchAllPosts()` function solution
  - **Dummy data showing** - Hardcoded fallback data appearing instead of CMS data
  - **TypeScript build errors** - Migration script type errors
  - **Placeholder images missing** - Broken image links for missing assets

### Debugging Methods
- **NEW: 5-Step Debugging Protocol**:
  1. Verify Studio Data (use Sanity Vision query)
  2. Test API Endpoint Directly (use curl with cache-busting)
  3. Add Debug Logging (console.log in API routes)
  4. Check Browser Console (fetch logs)
  5. Clear Caches (`.next`, node_modules)

### Quick Debug Checklist
- **NEW: 10-Point Debug Checklist** - Verify in order:
  - Data visible in Sanity Studio?
  - API endpoint returns correct data (curl test)?
  - Browser console shows fetch success?
  - `.next` cache cleared recently?
  - Environment variables loaded correctly?
  - Client configured with correct dataset?
  - Query uses proper projections?
  - Components use optional chaining for optional fields?
  - Placeholder image fallbacks exist?
  - Build runs without TypeScript errors?

### Component-Level Troubleshooting
- **NEW: Component Debug Flow** - What to check when component returns `null`:
  - Is the API returning data?
  - Is the component handling loading state?
  - Is Sanity config valid?

### Cache Strategy Issues
- **NEW: Cache Problem Solutions**:
  - Content not updating after CMS change → Check `useCdn: false`
  - API returns stale data → Add `Cache-Control: no-store` headers
  - Browser caching API responses → Add `?t=${Date.now()}` cache-busting
  - Build includes old content → Delete `.next` and rebuild

### Data Migration Verification
- **NEW: 4-Step Migration Verification**:
  1. Check Studio count
  2. Verify via GROQ count query
  3. Test array editing (no "Missing keys" error)
  4. Verify references exist

### Environment Variable Issues
- **NEW: Env Var Troubleshooting Table** - Symptoms, checks, and fixes for:
  - `projectId` is empty
  - API returns 401
  - Writes fail
  - Studio won't load

### Updated Common Pitfalls
- **EXPANDED: Common Pitfalls** - Added 2 new entries at the top:
  - **Stale `.next` cache** - Build cache holds old query results
  - **Browser caching API** - Fetch returns cached responses

## What's New (v1.5.0)

### Major Addition: Complete Migration Guide
- **EXPANDED: Phase 6.5 - Data Migration & Seeding** - Comprehensive 200+ line migration guide:
  - Full migration script template with all helper functions
  - Step-by-step migration guide (6 steps)
  - Image handling strategies (3 options)
  - Field type mapping reference (14 types with examples)
  - Running migrations with dotenv-cli
  - Assessment checklist

### Image Handling Section
- **NEW: Image Handling Strategies** - Complete guide for managing images in migrations:
  - Option 1: Upload via Studio, reference by ID (Recommended)
  - Option 2: Skip images initially, add later via Studio
  - Option 3: Upload via API (Advanced method)
  - Handling null/optional images in components
  - Image helper function: `createImageRef(assetId)`
  - Optional chaining patterns for safety

### Expanded Field Type Mapping
- **EXPANDED: Field Type Mapping** - Now includes 14 field types:
  - All basic types (slug, string, text, boolean, number, datetime, date)
  - Array types (strings, objects, references)
  - Complex types (image, file, geopoint, block/Portable Text)
  - Reference arrays and self-referencing
  - Complete examples for each type

### Portable Text Examples
- **NEW: Portable Text Examples** - Complete Portable Text patterns:
  - Simple paragraphs with text formatting (bold, italic)
  - Headings (H1, H2, H3)
  - Lists (bullet, numbered)
  - Links with marks
  - Full working code examples

### Common Pitfalls (7 New Entries)
- **EXPANDED: Common Pitfalls** - Added 7 new image-related pitfalls:
  - Null image access errors (missing optional chaining)
  - Missing alt text on images (accessibility)
  - Image upload failures (size/format issues)
  - Wrong image ref format (URL vs asset reference)
  - Undefined optional fields (null/undefined handling)
  - Date format errors (ISO 8601 requirements)
  - Reference target missing (document dependencies)

### Complete Migration Template
- **NEW: Complete Migration Script** - Production-ready template with:
  - Helper functions: `generateKey()`, `generateSlug()`, `createImageRef()`
  - Example migrations: Blog Posts, Products, Team Members
  - Error handling and logging
  - Main function with proper sequencing
  - Ready to copy and customize

### Assessment Checklist
- **NEW: Migration Assessment Checklist** - 5 checkpoints:
  - Migration runs without errors
  - Items appear in Sanity Studio
  - Array items are editable (no "missing keys" error)
  - Re-running migration updates existing items (idempotent)
  - All field types match schema expectations

## What's New (v1.4.0)

- **NEW: Phase 6.5 - Data Migration & Seeding** - Initial data migration guide:
  - Migration script template with Sanity client
  - Critical `_key` pattern for array items
  - Field type mapping reference
  - Idempotent migrations with `createOrReplace`
  - Slug format patterns
- **EXPANDED: Common Pitfalls** - 8 critical pitfalls from production:
  - Missing `_key` in arrays
  - Wrong config location
  - Missing `basePath`
  - Metadata export errors
  - Schema type mismatches
  - Studio header overlap
  - Slug format errors
  - Portable Text vs Text confusion
- **NEW: Array Key Pattern** - Helper function for unique keys
- **NEW: Studio Setup Checklist** - Working Studio integration requirements
- **NEW: Basic Field Type Mapping** - Initial reference table

## What's New (v1.3.0)

- **NEW: Blog Rendering Guide** (`references/blog-rendering.md`) - Comprehensive guide for rendering blog content including:
  - Portable Text components with full styling
  - Code block syntax highlighting with `react-syntax-highlighter`
  - Image rendering with Next.js optimization
  - Table of Contents with intersection observer
  - FAQ Accordion with JSON-LD structured data
  - Related Posts component
  - Like/Dislike functionality
  - Breadcrumbs navigation
  - Share buttons
  - Reading time calculation
- **NEW: Portable Text Components Template** (`templates/components/portable-text-components.tsx`)
- **NEW: Extended Block Content Schema** (`templates/schemas/blockContentTypeExtended.ts`)
- **NEW: FAQ Accordion Template** (`templates/components/FaqAccordion.tsx`)
