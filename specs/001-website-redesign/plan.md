# Implementation Plan: Hashtag Tech Website Redesign

**Branch**: `001-website-redesign` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-website-redesign/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a pixel-perfect recreation of the Hashtag Tech website (hashtagstech.com) using Next.js 14+ App Router with TypeScript, Tailwind CSS, and Sanity CMS integration. The implementation follows a **two-phase approach**: Phase 1 builds complete UI with hardcoded sample data, animations, and responsiveness; Phase 2 integrates Sanity CMS to replace hardcoded content with dynamic CMS-managed data.

**Technical Approach**: Modern web stack with GSAP for scroll animations, Motion.dev for micro-interactions, Brevo for email, and ISR caching for performance.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 14+ (App Router), React 18+, Tailwind CSS 3.x, GSAP, Motion.dev (Framer Motion), Zod
**Storage**: Sanity CMS (Phase 2), ISR for caching
**Testing**: Lighthouse for performance/accessibility, ESLint, TypeScript compiler
**Target Platform**: Web browsers (320px - 1920px), mobile-first responsive
**Project Type**: Web application (monorepo-ready structure)
**Performance Goals**: Lighthouse Performance 90+, Accessibility 100, FCP < 1.5s, TTI < 3s, CLS < 0.1
**Constraints**: WCAG 2.1 AA compliance, `prefers-reduced-motion` support, zero `any` types, CSS variables only for styling
**Scale/Scope**: 13 homepage sections, 5 API routes, 6 Sanity schemas, 3 pages (blog, career, services)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ SOLID Principles

| Principle | Compliance | Evidence |
|-----------|------------|----------|
| Single Responsibility | ✅ PASS | Each component handles one UI concern (e.g., hero.tsx, stats-bar.tsx) |
| Open/Closed | ✅ PASS | Components extensible via props (ChatWidgetProps FR-066) |
| Liskov Substitution | ✅ PASS | Service variants interchangeable via common interface |
| Interface Segregation | ✅ PASS | Focused prop interfaces per component |
| Dependency Inversion | ✅ PASS | TypeScript interfaces for all data contracts |

### ✅ DRY Principle

| Requirement | Implementation |
|-------------|----------------|
| Component Library | `components/ui/` for reusable UI (Button, Card) |
| Custom Hooks | `hooks/` for shared logic (use-reduced-motion.ts, use-scroll-animation.ts) |
| Utility Functions | `lib/utils.ts` for common helpers |
| CSS Variables | `globals.css` as single source of truth |
| Type Definitions | `types/` directory for shared types |

**Justification**: No duplication detected. Pattern recognition rule applied (2+ occurrences = abstraction).

### ✅ Performance First (Vercel React Best Practices)

| Rule | Compliance | Implementation |
|------|------------|----------------|
| Eliminate Waterfalls | ✅ PASS | `Promise.all()` for parallel data fetches |
| Minimize Bundle | ✅ PASS | `next/dynamic` for GSAP, chat widget (FR-056) |
| Server Components | ✅ PASS | Default RSC, `"use client"` only when needed (FR-060) |
| Optimize Images | ✅ PASS | `next/image` with WebP + fallback (FR-055) |
| Prevent CLS | ✅ PASS | `next/font` with `display: swap` (FR-019) |

**Lighthouse Targets**: Performance 90+, Accessibility 100 (SC-001, SC-002) ✅ NON-NEGOTIABLE

### ✅ Type Safety

| Requirement | Compliance |
|-------------|-------------|
| No `any` types | ✅ PASS | Strict mode enabled (NFR-003) |
| Explicit types | ✅ PASS | All functions typed |
| Zod validation | ✅ PASS | Contact form, API routes (FR-046, NFR-004) |
| Strict mode | ✅ PASS | tsconfig.json strict: true |

### ✅ CSS Variables & Theming System

| Requirement | Compliance |
|-------------|-------------|
| CSS Variables Only | ✅ PASS | FR-017: All colors via CSS variables |
| Design Token Architecture | ✅ PASS | globals.css → tailwind.config.ts → components |
| No Hardcoded Colors | ✅ PASS | SC-014 validates zero hardcoded hex values |

### ✅ Accessibility (WCAG 2.1 AA)

| Requirement | Compliance | Reference |
|-------------|-------------|-----------|
| Color Contrast 4.5:1 | ✅ PASS | FR-065 |
| Keyboard Navigation | ✅ PASS | FR-062 |
| ARIA Labels | ✅ PASS | FR-063 |
| Focus Indicators | ✅ PASS | FR-064 (--ring color) |
| Alt Text | ✅ PASS | FR-061 |
| Reduced Motion | ✅ PASS | FR-025, FR-066 |

**Gate Result**: ✅ **ALL CHECKS PASSED** - Proceed to Phase 0

---

## Project Structure

### Documentation (this feature)

```text
specs/001-website-redesign/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (filled below)
├── data-model.md        # Phase 1 output (filled below)
├── quickstart.md        # Phase 1 output (filled below)
├── contracts/           # Phase 1 output (API contracts)
│   ├── api-routes.yaml  # OpenAPI spec for all API routes
│   └── sanity-schemas.yaml # Sanity CMS schema definitions
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
hashtag-tech/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx              # Homepage (FR-001 to FR-016)
│   │   ├── services/
│   │   │   └── page.tsx          # Services listing page
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog listing (FR-037)
│   │   │   └── [slug]/page.tsx   # Blog post (FR-038)
│   │   └── career/
│   │       ├── page.tsx          # Career listing (FR-039)
│   │       └── [slug]/page.tsx   # Job posting (FR-040)
│   ├── api/
│   │   ├── posts/
│   │   │   └── route.ts          # FR-037, FR-038
│   │   ├── careers/
│   │   │   └── route.ts          # FR-039, FR-040
│   │   ├── services/
│   │   │   └── route.ts          # FR-041, FR-042
│   │   ├── ai-services/
│   │   │   └── route.ts          # FR-043
│   │   └── contact/
│   │       └── route.ts          # FR-044 to FR-049 (Brevo)
│   ├── layout.tsx                # Root layout with fonts
│   ├── globals.css               # CSS Variables (FR-017)
│   ├── sitemap.ts                # Dynamic sitemap
│   └── robots.ts                 # Robots.txt
├── components/
│   ├── layout/
│   │   ├── header.tsx            # FR-002 to FR-004
│   │   ├── footer.tsx            # FR-015
│   │   └── mobile-nav.tsx        # FR-004
│   ├── sections/
│   │   ├── hero.tsx              # FR-005, FR-023, FR-026
│   │   ├── stats-bar.tsx         # FR-006, FR-027
│   │   ├── success-stories.tsx   # FR-007, FR-028
│   │   ├── devmate.tsx           # FR-008
│   │   ├── testimonials.tsx      # FR-009, FR-029
│   │   ├── ai-services.tsx       # FR-010, FR-030
│   │   ├── cta-banner.tsx        # FR-011
│   │   ├── partners.tsx          # FR-012
│   │   ├── services-grid.tsx     # FR-013, FR-030
│   │   └── ceo-section.tsx       # FR-014
│   ├── ui/                       # Reusable UI (shadcn/ui pattern)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── forms/
│   │   └── contact-form.tsx      # FR-045 to FR-049
│   ├── widgets/
│   │   └── chat-widget.tsx       # FR-050 to FR-054, FR-066
│   └── animations/
│       └── scroll-reveal.tsx     # Animation wrapper
├── hooks/
│   ├── use-scroll-animation.ts
│   ├── use-counter-animation.ts
│   └── use-reduced-motion.ts     # FR-025
├── lib/
│   ├── utils.ts
│   ├── animations.ts             # Animation token system
│   ├── sanity/                   # Phase 2
│   │   ├── client.ts
│   │   └── image.ts
│   └── brevo.ts                  # Brevo SDK wrapper
├── sanity/                       # Phase 2
│   ├── schemaTypes/
│   │   ├── postType.ts           # FR-031
│   │   ├── careerType.ts         # FR-032
│   │   ├── authorType.ts         # FR-033
│   │   ├── categoryType.ts       # FR-034
│   │   ├── serviceType.ts        # FR-035
│   │   └── aiServiceType.ts      # FR-036
│   └── env.ts
├── types/
│   ├── service.ts
│   ├── testimonial.ts
│   ├── blog.ts
│   └── career.ts
├── public/
│   ├── logo-horizontal.jpeg      # Existing logo
│   ├── logo-vertical.jpeg        # Existing logo
│   ├── favicon.jpeg              # Existing favicon
│   └── images/
│       └── placeholders/         # Placeholder images for Phase 1
├── screenshots/                  # Design reference (12 files)
├── tailwind.config.ts            # CSS variable mappings
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript strict mode
└── package.json
```

**Structure Decision**: Single web application with App Router pattern. The `(marketing)` route group organizes public-facing pages. API routes handle data fetching with ISR. Components organized by concern (layout, sections, ui, forms, widgets). This aligns with Next.js 14+ best practices and the DRY principle.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | No violations - all Constitution checks passed |

## Visual Design Notes

**Color Theme**: The website uses a **light theme** by design with the following section-specific backgrounds:
- **Light Background** (default): Hero, Success Stories, DEVMATE, AI Services, CTA Banner, Partners, Services Grid, CEO Section, Footer
- **Red Background**: Stats Bar (full-width accent bar)
- **Dark Background**: Testimonials section (ONLY dark section - #1A1A1A background with white text)

This intentional color scheme creates visual hierarchy while maintaining readability. No system-wide dark mode is implemented - sections have explicit background classes instead.

---

## Phase 0: Research & Technology Decisions

### Research Summary

All technical decisions have been clarified during the specification phase. Key decisions:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Email Service** | Brevo (SendinBlue) | Specified in clarifications; generous free tier, excellent Node.js SDK |
| **Animation Durations** | Tiered approach (100-200ms hover, 300-400ms transitions, 500-800ms scroll) | Best practice UX, matches Material Design principles |
| **Frontend Logging** | Essential errors only (console, form failures, API errors) | Balance debugging needs without overwhelming logs |
| **Chat Widget** | Reusable component with props | Supports future reusability without hardcoding |
| **Image Format** | WebP with PNG fallback (Next.js automatic) | Industry standard for performance |

### Technology Stack Confirmation

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| Framework | Next.js | 14+ | App Router for modern React patterns, Server Components, ISR |
| Language | TypeScript | 5.x | Strict mode required (NFR-003) |
| Styling | Tailwind CSS | 3.x | Utility-first, CSS variables support (FR-017) |
| CMS | Sanity | Latest | Phase 2; flexible content modeling, GROQ queries |
| Animation (Scroll) | GSAP | Latest | ScrollTrigger for complex scroll animations (FR-023) |
| Animation (UI) | Motion.dev | Latest | Framer Motion for micro-interactions (FR-024) |
| Email | Brevo SDK | Latest | Clarified in spec; free tier 300 emails/day |
| Validation | Zod | Latest | Runtime validation for forms/API (NFR-004) |
| Fonts | next/font | Built-in | Inter or Outfit, prevents CLS (FR-019) |

### Performance Strategy

| Metric | Target | Strategy |
|--------|--------|----------|
| Lighthouse Performance | 90+ | Server Components, ISR, next/dynamic, image optimization |
| Lighthouse Accessibility | 100 | Semantic HTML, ARIA, keyboard nav, reduced motion |
| FCP | < 1.5s | Minimal JavaScript, critical CSS inline, font optimization |
| TTI | < 3s | Code splitting, lazy loading, ISR caching |
| CLS | < 0.1 | next/font with display:swap, proper image sizing |

### Caching Strategy (ISR)

| Route | Revalidate | Content Type |
|-------|------------|--------------|
| Homepage | 3600s (1 hour) | Static content, changes infrequently |
| Blog listing | 60s | Content may update frequently |
| Blog post | 60s | Individual posts, moderate change frequency |
| Career listing | 300s (5 min) | Job postings, periodic updates |
| AI Services | 3600s (1 hour) | Static feature list |
| Services | 3600s (1 hour) | Core offerings, infrequent changes |

---

## Phase 1: Data Model & API Contracts

### Data Model Summary

#### Core Entities (Phase 1 - Hardcoded)

```typescript
// types/service.ts
interface Service {
  id: string;
  title: string;
  slug: string;
  category: 'web-development' | 'app-development' | 'social-media-marketing' | 'ai-services';
  shortDescription: string;
  features: string[];
  ctaText: string;
  ctaStyle: 'primary' | 'secondary';
  order: number;
}

// types/testimonial.ts
interface Testimonial {
  id: string;
  clientName: string;
  clientCompany: string;
  rating: number; // 1-5
  quote: string;
  image?: string;
}

// types/ai-service.ts
interface AIService {
  id: string;
  title: string;
  slug: string;
  number: string; // "01", "02", "03"
  shortDescription: string;
  features: string[];
  order: number;
  isActive: boolean;
}

// types/contact-form.ts
interface ContactFormSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: 'web-development' | 'mobile-app' | 'ai-agents' | 'marketing' | 'other';
  message: string;
}
```

#### Sanity CMS Entities (Phase 2)

```typescript
// types/blog.ts
interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  mainImage: SanityImage;
  content: PortableTextBlock[];
  author: Author;
  categories: Category[];
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface Author {
  _id: string;
  name: string;
  slug: string;
  image: SanityImage;
  bio: PortableTextBlock[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

// types/career.ts
interface Career {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  description: PortableTextBlock[];
  requirements: string[];
  benefits: string[];
  isActive: boolean;
  publishedAt: string;
}
```

### API Contracts

#### GET /api/posts

**Description**: Fetch all blog posts with ISR caching

**Query Parameters**: None

**Response**:
```yaml
200:
  type: array
  items:
    type: object
    properties:
      id: string
      title: string
      slug: string
      excerpt: string
      mainImage: object
      author: object
      categories: array
      publishedAt: string (ISO 8601)
500:
  type: object
  properties:
    error: string
```

#### GET /api/posts/[slug]

**Description**: Fetch single blog post by slug

**Path Parameters**:
- `slug`: string (required)

**Response**:
```yaml
200:
  type: object
  properties:
    id: string
    title: string
    slug: string
    content: array (PortableText)
    author: object
    categories: array
    publishedAt: string
    seoTitle: string?
    seoDescription: string?
404:
  type: object
  properties:
    error: string
500:
  type: object
  properties:
    error: string
```

#### GET /api/careers

**Description**: Fetch all active job openings

**Query Parameters**: None

**Response**:
```yaml
200:
  type: array
  items:
    type: object
    properties:
      id: string
      title: string
      slug: string
      department: string
      location: string
      type: string
      publishedAt: string (ISO 8601)
500:
  type: object
  properties:
    error: string
```

#### GET /api/careers/[slug]

**Description**: Fetch single job posting by slug

**Path Parameters**:
- `slug`: string (required)

**Response**:
```yaml
200:
  type: object
  properties:
    id: string
    title: string
    slug: string
    description: array (PortableText)
    requirements: array[string]
    benefits: array[string]
    type: string
    location: string
404:
  type: object
  properties:
    error: string
500:
  type: object
  properties:
    error: string
```

#### GET /api/services

**Description**: Fetch all services ordered by display order

**Query Parameters**: None

**Response**:
```yaml
200:
  type: array
  items:
    type: object
    properties:
      id: string
      title: string
      slug: string
      category: string
      shortDescription: string
      features: array[string]
      ctaText: string
      ctaStyle: string
      order: number
500:
  type: object
  properties:
    error: string
```

#### GET /api/ai-services

**Description**: Fetch all AI services for homepage section

**Query Parameters**: None

**Response**:
```yaml
200:
  type: array
  items:
    type: object
    properties:
      id: string
      title: string
      slug: string
      number: string
      shortDescription: string
      features: array[string]
      order: number
500:
  type: object
  properties:
    error: string
```

#### POST /api/contact

**Description**: Submit contact form for email delivery via Brevo

**Request Body**:
```yaml
type: object
required:
  - name
  - email
  - service
  - message
properties:
  name:
    type: string
    minLength: 2
  email:
    type: string
    format: email
  phone:
    type: string
  company:
    type: string
  service:
    type: string
    enum: [web-development, mobile-app, ai-agents, marketing, other]
  message:
    type: string
    minLength: 10
    maxLength: 5000
```

**Response**:
```yaml
200:
  type: object
  properties:
    success: boolean
    message: string
400:
  type: object
  properties:
    error: string
    details: object # Zod validation errors
500:
  type: object
  properties:
    error: string
```

### Sanity Schema Contracts (Phase 2)

#### postType.ts
```typescript
// FR-031: Blog Post schema
{
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'excerpt', type: 'text', rows: 3 },
    { name: 'mainImage', type: 'image' },
    { name: 'content', type: 'array', of: [{ type: 'block' }] },
    { name: 'author', type: 'reference', to: [{ type: 'author' }] },
    { name: 'categories', type: 'array', of: [{ type: 'reference', to: [{ type: 'category' }] }] },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'seoTitle', type: 'string' },
    { name: 'seoDescription', type: 'text' }
  ]
}
```

#### careerType.ts
```typescript
// FR-032: Career schema
{
  name: 'career',
  title: 'Job Opening',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'department', type: 'string' },
    { name: 'location', type: 'string' },
    { name: 'type', type: 'string', options: { list: ['Full-time', 'Part-time', 'Contract', 'Remote'] } },
    { name: 'description', type: 'array', of: [{ type: 'block' }] },
    { name: 'requirements', type: 'array', of: [{ type: 'string' }] },
    { name: 'benefits', type: 'array', of: [{ type: 'string' }] },
    { name: 'isActive', type: 'boolean', defaultValue: true },
    { name: 'publishedAt', type: 'datetime' }
  ]
}
```

---

## Quick Start Guide

### Prerequisites

- Node.js 18+ installed
- Git installed
- Code editor with TypeScript support

### Phase 1 Setup (Hardcoded Data)

```bash
# 1. Initialize Next.js project
npx create-next-app@latest hashtag-tech --typescript --tailwind --app --no-src-dir
cd hashtag-tech

# 2. Install dependencies
npm install gsap framer-motion zod @brevo/brevo-sdk
npm install -D @types/gsap

# 3. Install shadcn/ui (optional, for base components)
npx shadcn-ui@latest init

# 4. Create directory structure
mkdir -p components/{layout,sections,ui,forms,widgets,animations}
mkdir -p hooks lib/{sanity} types
mkdir -p public/images/placeholders

# 5. Copy screenshots to reference directory
# (Place 12 screenshots from design into screenshots/ directory)

# 6. Start development server
npm run dev
```

### Environment Variables (Phase 1)

```env
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Phase 2 Setup (Sanity CMS)

```bash
# 1. Install Sanity
npm install sanity next-sanity

# 2. Initialize Sanity Studio
npx sanity@latest init

# 3. Configure environment variables
# Add to .env.local:
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token

# 4. Start Sanity Studio (separate terminal)
npm run sanity
```

### Environment Variables (Phase 2 - Complete)

```env
# .env.local (Phase 2)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token

# Brevo Email
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=noreply@hashtagstech.com
BREVO_RECIPIENT_EMAIL=contact@devmatesolutions.com
```

### Development Commands

```bash
# Start Next.js dev server
npm run dev

# Type checking
npm run type-check  # or npx tsc --noEmit

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start

# Sanity Studio (Phase 2)
npm run sanity

# Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

### First Implementation Steps

1. **Create globals.css** with CSS variables from Technical Context
2. **Configure tailwind.config.ts** to use CSS variables
3. **Build Header component** matching screenshot 1.png
4. **Build Hero section** matching screenshot 1.png
5. **Build remaining sections** in order of screenshots 2-11
6. **Add animations** using GSAP (scroll) and Motion.dev (interactions)
7. **Build Chat Widget** matching chat.png
8. **Create Contact Form** with Zod validation
9. **Test responsiveness** from 320px to 1920px
10. **Run Lighthouse** to verify 90+ Performance, 100 Accessibility

### Verification Checklist

Before moving to Phase 2:
- [ ] All 13 homepage sections visible and styled
- [ ] Mobile responsive (320px - 768px)
- [ ] Tablet responsive (768px - 1024px)
- [ ] Desktop responsive (1024px - 1920px)
- [ ] Animations smooth and respecting reduced motion
- [ ] Chat widget expand/collapse working
- [ ] Contact form validation working
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse Accessibility 100
- [ ] Zero TypeScript errors
- [ ] Zero ESLint warnings

---

## Implementation Phases

### Phase 1: Foundation & UI (Hardcoded Data) - Current Focus

| Sub-phase | Duration | Deliverables |
|-----------|----------|--------------|
| 1.1 Project Setup | 2h | Next.js, Tailwind, fonts, ESLint |
| 1.2 Layout Components | 3h | Header, Footer, MobileNav |
| 1.3 Homepage Sections | 12h | All 13 sections matching screenshots |
| 1.4 Animations | 4h | GSAP scroll reveals, Motion.dev interactions |
| 1.5 Chat Widget | 3h | Reusable component with props |
| 1.6 Contact Form | 2h | Zod validation, Brevo prep |

**Total**: ~26 hours

### Phase 2: Sanity CMS Integration (Deferred)

| Sub-phase | Duration | Deliverables |
|-----------|----------|--------------|
| 2.1 Sanity Setup | 4h | Studio, schemas, GROQ queries |
| 2.2 API Routes with ISR | 4h | All routes with revalidation |
| 2.3 Blog & Career Pages | 6h | Dynamic pages from CMS |
| 2.4 Migration & Testing | 4h | Replace hardcoded with CMS data |

**Total**: ~18 hours

---

## Success Criteria

### Automated Tests

```bash
# Lighthouse audit (run in browser console or CLI)
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json

# Expected results:
# Performance: 90+
# Accessibility: 100
# Best Practices: 90+
# SEO: 90+
```

### Manual Verification

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Homepage sections | Load homepage, scroll through all sections | All 13 sections visible, properly styled |
| Mobile responsive | Resize browser to 320px width | Sections stack vertically, hamburger menu appears |
| Animations | Scroll through page | Smooth GSAP reveals, counters animate from 0 |
| Reduced motion | Enable OS reduced motion preference | Animations disabled or simplified |
| Chat widget | Click chat button | Modal opens with slide-up animation |
| Contact form (valid) | Fill with valid data, submit | Success message, no console errors |
| Contact form (invalid) | Submit with invalid email | Inline error message appears |
| Keyboard navigation | Tab through page | All interactive elements receive focus, visible indicator |

### Definition of Done

- [ ] All Functional Requirements (FR-001 to FR-068) implemented
- [ ] All Non-Functional Requirements (NFR-001 to NFR-009) satisfied
- [ ] All Success Criteria (SC-001 to SC-015) met
- [ ] Constitution compliance verified (all gates passed)
- [ ] Lighthouse scores: Performance 90+, Accessibility 100
- [ ] Zero TypeScript errors, zero ESLint warnings
- [ ] Screenshots matched pixel-perfectly (visual QA)
- [ ] Responsive on all breakpoints (320px - 1920px)
- [ ] Accessibility verified (keyboard, screen reader, contrast)

---

## References

- **Spec Document**: `specs/001-website-redesign/spec.md`
- **Constitution**: `.specify/memory/constitution.md`
- **Screenshots**: `screenshots/*.png` (12 files)
- **Brand Assets**: `public/logo-horizontal.jpeg`, `public/favicon.jpeg`
- **Next.js Docs**: https://nextjs.org/docs
- **GSAP ScrollTrigger**: https://greensock.com/docs/v3/Plugins/ScrollTrigger
- **Motion.dev**: https://motion.dev/docs
- **Sanity CMS**: https://www.sanity.io/docs
- **Brevo SDK**: https://developers.brevo.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
