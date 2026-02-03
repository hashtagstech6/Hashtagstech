---
id: "002"
title: "Fix placeholder images and component architecture"
stage: green
date: 2026-02-03
surface: agent
model: claude-opus-4-5-20251101
feature: 001-website-redesign
branch: 001-website-redesign
user: user
command: /sp.implement
labels: ["implementation", "website-redesign", "bug-fix"]
links:
  spec: specs/001-website-redesign/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - components/blog/blog-card.tsx
  - app/(marketing)/blog/page.tsx
  - app/(marketing)/blog/[slug]/page.tsx
  - data/blog-posts.ts
  - components/ui/placeholder-image.tsx
  - specs/001-website-redesign/tasks.md
tests:
  - npm run type-check (zero errors)
  - npm run lint (only acceptable warnings)

---

## Prompt

/sp.implement

## Response snapshot

Fixed the Next.js compilation error and completed T154 (placeholder images for missing assets):

**Root Cause**: The blog listing and detail pages were using `useState` hook without the "use client" directive. This caused Next.js to fail compilation because Server Components cannot use React hooks.

**Solution Applied**: Created separate client component file `components/blog/blog-card.tsx` containing:
- `BlogCard` component - for blog listing page cards
- `RelatedPostCard` component - for related posts in detail page
- `BlogFeaturedImage` component - for featured image in detail page

All components now include proper placeholder fallback using SVG icon when images fail to load.

**Additional Fixes**:
1. Fixed corrupted `data/blog-posts.ts` file (was truncated, rewrote with complete blog post data)
2. Added missing `slug` field to Author objects in blog-posts.ts
3. Fixed PlaceholderImage component prop issue (removed invalid `fill` prop string value)

**Tasks Completed**:
- T151: Loading states (verified contact form already has loading button state)
- T154: Placeholder images (implemented error fallback with SVG placeholder)

## Outcome

- ✅ Impact: Fixed compilation error and completed placeholder image implementation for blog pages. Blog cards and related posts now gracefully display placeholder when images fail to load.
- 🧪 Tests: Type-check passes with zero errors. ESLint passes with only acceptable warnings about using <img> instead of Image for external logos.
- 📁 Files: Created 1 new file (blog-card.tsx), updated 4 existing files (blog pages, blog-posts.ts, placeholder-image.tsx, tasks.md).
- 🔁 Next prompts: Remaining tasks are mostly manual testing (T122-T138, T145-T146, T149-T150, T153, T157) requiring visual verification, Lighthouse testing, and manual QA.
- 🧠 Reflection: The Server/Client Component architecture in Next.js 14 requires careful planning. Extracting interactive components (using hooks) to separate client component files while keeping main pages as Server Components is the recommended pattern for performance.

## Evaluation notes (flywheel)

- Failure modes observed: Initially added "use client" directive to entire page files, which would convert them to Client Components and lose performance benefits (metadata generation, ISR). Corrected this by extracting only the interactive components to separate client files.
- Graders run and results (PASS/FAIL): All automated checks PASS. Type-check: 0 errors. Lint: acceptable warnings only.
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with manual testing tasks or begin Phase 2 Sanity CMS integration when ready.
