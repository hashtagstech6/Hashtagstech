---
id: 003
title: Sanity CMS Integration for Blog and Career Pages
stage: green
date: 2025-02-04
surface: agent
model: claude-opus-4-5-20251101
feature: 001-website-redesign
branch: 001-website-redesign
user: User
command: /sp.implement -> use @.claude/skills/sanity-integration skill to implement sanity
labels: [sanity,cms,isr,portable-text,groq]
links:
  spec: specs/001-website-redesign/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - sanity/env.ts
 - sanity/lib/client.ts
 - sanity/lib/image.ts
 - sanity/schemaTypes/postType.ts
 - sanity/schemaTypes/authorType.ts
 - sanity/schemaTypes/categoryType.ts
 - sanity/schemaTypes/careerType.ts
 - sanity/config.ts
 - app/api/posts/route.ts
 - app/api/posts/[slug]/route.ts
 - app/api/careers/route.ts
 - app/api/careers/[slug]/route.ts
 - components/blog/portable-text.tsx
 - app/(marketing)/blog/page.tsx
 - app/(marketing)/blog/[slug]/page.tsx
 - app/(marketing)/career/page.tsx
 - app/(marketing)/career/[slug]/page.tsx
 - components/layout/header.tsx
tests:
 - TypeScript type check passed
 - npm run build completed successfully
---

## Prompt

use @.claude/skills/sanity-integration\ skill to implement sanity

## Response snapshot

Implemented Sanity CMS integration for the Hashtag Tech website with ISR caching, schema design, API routes, and Portable Text rendering. The implementation includes:

1. **Environment Configuration** (`sanity/env.ts`)
   - Validates NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
   - Fallback support for development without CMS

2. **Sanity Client** (`sanity/lib/client.ts`)
   - next-sanity client with Stega for development visual editing
   - useCdn: false for ISR compatibility
   - Studio URL at /studio

3. **Schema Types** (postType, authorType, categoryType, careerType)
   - Blog posts with Portable Text content, author references, categories, SEO fields
   - Authors with name, slug, image, bio
   - Categories with name, slug, color
   - Careers with description, requirements, benefits, salary, application details

4. **API Routes** (/api/posts, /api/posts/[slug], /api/careers, /api/careers/[slug])
   - ISR cache headers (blog: 60s, careers: 300s)
   - GROQ queries with projections for performance
   - Error handling with proper status codes

5. **Portable Text Component** (components/blog/portable-text.tsx)
   - Custom styling for headings, lists, links, code, images, blockquotes
   - Using Partial<PortableTextReactComponents> for type compatibility

6. **Updated Pages** (blog, blog/[slug], career, career/[slug])
   - Fetch from Sanity API with fallback to hardcoded data
   - Type narrowing for Sanity vs hardcoded data formats
   - generateStaticParams for static generation at build time
   - generateMetadata for SEO optimization

Fixed TypeScript errors including type narrowing issues, missing imports (Modal, ContactForm), and proper type assertions for union types.

## Outcome

- ✅ Impact: Full Sanity CMS integration with ISR caching, enabling content editors to manage blog posts and careers through Sanity Studio while maintaining hardcoded data fallback for development
- 🧪 Tests: TypeScript type check passed, Next.js build completed successfully
- 📁 Files: 17 files created/modified including sanity schemas, API routes, components, and page updates
- 🔁 Next prompts: Set up Sanity Studio at /studio route, configure environment variables for production, test Live Content API for real-time updates
- 🧠 Reflection: The environment-based fallback pattern allows development without CMS configuration while supporting production-ready ISR. Type narrowing for union types (Sanity | hardcoded) requires careful handling with type assertions.

## Evaluation notes (flywheel)

- Failure modes observed: Type narrowing issues when using "key in obj" patterns for union types where both sides have the same keys; resolved by using type assertions based on discriminant properties
- Graders run and results (PASS/FAIL):
  - TypeScript type check: PASS
  - Next.js build: PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add sitemap.ts and robots.ts with Sanity CMS integration for dynamic URLs
