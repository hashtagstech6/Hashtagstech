# Tasks: Hashtag Tech Website Redesign

**Feature**: 001-website-redesign
**Branch**: `001-website-redesign`
**Status**: Draft
**Created**: 2026-02-02
**Phase**: 1 (Hardcoded Data) → Phase 2 (Sanity CMS)

---

## Overview

This task list implements the Hashtag Tech website redesign following a two-phase approach:
- **Phase 1**: Build complete UI with hardcoded sample data
- **Phase 2**: Integrate Sanity CMS for dynamic content (deferred)

Tasks are organized by user story to enable independent implementation and testing.

---

## Phase 1: Project Setup

**Goal**: Initialize Next.js project with all dependencies and configuration

### Setup Tasks

- [X] T001 Initialize Next.js 14+ project with TypeScript, Tailwind CSS, and App Router using `npx create-next-app@latest hashtag-tech --typescript --tailwind --app --no-src-dir`
- [X] T002 Install core dependencies: `npm install gsap framer-motion zod clsx tailwind-merge @getbrevo/brevo`
- [X] T003 Create directory structure: `components/{layout,sections,ui,forms,widgets,animations}`, `hooks/`, `lib/`, `types/`, `public/images/{placeholders,testimonials,partners}`
- [X] T004 Configure TypeScript strict mode in `tsconfig.json` with `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitReturns: true`
- [X] T005 Configure Tailwind CSS in `tailwind.config.ts` with CSS variable mappings for brand colors
- [X] T006 Create `app/globals.css` with CSS variables (brand-primary, surface-colors, animation-tokens, border-radius, focus-ring)
- [X] T007 Configure `next.config.mjs` with image domains and ISR settings
- [X] T008 Create `.env.local` with `NEXT_PUBLIC_SITE_URL=http://localhost:3000` and Brevo placeholder variables
- [X] T009 Create `.env.example` with all environment variable templates
- [X] T010 Update `package.json` scripts: add `type-check`, `format` commands
- [X] T011 Add skip link in `app/layout.tsx` for accessibility

---

## Phase 2: Foundational Components

**Goal**: Build shared utilities, hooks, and UI components that all sections depend on

### Utility & Hook Tasks

- [X] T012 Create `lib/utils.ts` with `cn()` utility function using clsx and tailwind-merge
- [X] T013 Create `lib/animations.ts` with duration tokens (hover: 150ms, transition: 350ms, scroll: 650ms) and easing functions
- [X] T014 Create `hooks/use-reduced-motion.ts` hook for detecting `prefers-reduced-motion` preference
- [X] T015 Create `hooks/use-counter-animation.ts` hook for GSAP counter animations (0 to target value)

### UI Component Tasks

- [X] T016 [P] Create `components/ui/button.tsx` with variants (primary, secondary, ghost) and Motion.dev hover animations
- [X] T017 [P] Create `components/ui/card.tsx` with elevation hover effect using Motion.dev
- [X] T018 [P] Create `components/ui/input.tsx` with focus states using brand-primary ring color

### Layout Component Tasks

- [X] T019 Create `components/layout/header.tsx` with sticky navigation, scroll shadow detection, HOME/SERVICES/TEAM/CAREER links, BOOK MEETING button
- [X] T020 Create `components/layout/mobile-nav.tsx` with slide-in drawer, hamburger menu, focus trap, escape-to-close
- [X] T021 Create `components/layout/footer.tsx` with Get In Touch column, Quick Links column, social links, copyright bar
- [X] T022 Update `app/layout.tsx` with `Outfit` font from `next/font/google`, metadata, and Header/Footer inclusion

### Animation Component Tasks

- [X] T023 Create `components/animations/scroll-reveal.tsx` wrapper component using GSAP ScrollTrigger with reduced-motion support

---

## Phase 3: User Story 1 - Discover Services (Priority: P1)

**Story**: As a potential client, I want to browse the website and understand what services are offered, so that I can determine if Hashtag Tech can help with my project.

**Independent Test**: Navigate to homepage, scroll to Services section, verify 3 service columns visible with hover states and working CTAs.

**Deliverable Value**: Enables potential clients to self-qualify and understand service offerings.

### Data Model Tasks

- [X] T024 [P] [US1] Create `types/service.ts` with Service interface (id, title, slug, category, shortDescription, features, ctaText, ctaStyle, order)
- [X] T025 [P] [US1] Create `types/ai-service.ts` with AIService interface (id, title, slug, number, shortDescription, features, order, isActive)
- [X] T026 [P] [US1] Create sample data constant `services` in `data/services.ts` with Web Development, App Development, Social Media Marketing entries
- [X] T027 [P] [US1] Create sample data constant `aiServices` in `data/ai-services.ts` with 3 AI service entries (AI Agents, ML Solutions, AI Consulting)

### Section Component Tasks

- [X] T028 [US1] Create `components/sections/hero.tsx` with two-column layout (60% text, 40% illustration), red accent word, CTA button, character-by-character animation
- [X] T029 [US1] Create `components/sections/stats-bar.tsx` with 4 columns (Since 2019, 40+ Global Brands, 25+ Industries, 96% Rating), checkmark icons, red background
- [X] T030 [US1] Create `components/sections/services-grid.tsx` with 3 columns, hover elevation effects using Motion.dev, stagger entrance animation, primary/secondary CTA buttons
- [X] T031 [US1] Create `components/sections/ai-services.tsx` with 3-card grid, numbered badges (01, 02, 03), feature bullet points, stagger scroll reveal animation

### Integration Tasks

- [X] T032 [US1] Add Hero, Stats Bar, Services Grid, and AI Services sections to `app/(marketing)/page.tsx` in correct order
- [X] T033 [US1] Verify Services section responsive behavior: columns stack vertically on mobile (<768px)
- [X] T034 [US1] Verify hover states on service cards show visual feedback (elevation/shadow change)
- [X] T035 [US1] Verify all "Get Started" CTAs link to contact section or form

---

## Phase 4: User Story 2 - View Company Credibility (Priority: P1)

**Story**: As a potential client, I want to see social proof through testimonials and portfolio, so that I can trust Hashtag Tech with my project.

**Independent Test**: View Success Stories and Testimonials sections, verify client names, testimonials, and stats are displayed.

**Deliverable Value**: Provides evidence of past work and client satisfaction to build trust.

### Data Model Tasks

- [X] T036 [P] [US2] Create `types/testimonial.ts` with Testimonial interface (id, clientName, clientCompany, rating, quote, image)
- [X] T037 [P] [US2] Create `types/partner.ts` with Partner interface (id, name, logo, country, website)
- [X] T038 [P] [US2] Create `types/stats.ts` with Stat interface (id, label, value, suffix, icon)
- [X] T039 [P] [US2] Create sample data constant `testimonials` in `data/testimonials.ts` with Sarah Johnson (Procope AI) and Michael Chen (Finaxe GB)
- [X] T040 [P] [US2] Create sample data constant `partners` in `data/partners.ts` with Procope AI (US) and Finaxe (GB) entries
- [X] T041 [P] [US2] Create sample data constant `stats` in `data/stats.ts` with 4 stat entries

### Section Component Tasks

- [X] T042 [US2] Create `components/sections/success-stories.tsx` with client marquee (auto-scroll), portfolio preview, "MORE WORKS" link
- [X] T043 [US2] Create `components/sections/about-us.tsx` with chess illustration (left), feature list with checkmarks (right)
- [X] T044 [US2] Create `components/sections/testimonials.tsx` with dark background class (section-testimonials), testimonial cards with 5-star rating, quote, person details, carousel navigation
- [X] T045 [US2] Create `components/sections/partners.tsx` with photo grid, country flag overlays, partner logos
- [X] T046 [US2] Create `components/sections/cta-banner.tsx` with chess knight illustration, headline, "GET CALL NOW" button

### Animation Tasks

- [X] T047 [US2] Implement GSAP ScrollTrigger for stats counter animation (0 to target value when scrolled into view)
- [X] T048 [US2] Implement client name marquee auto-scroll using CSS/GSAP continuous animation
- [X] T049 [US2] Implement testimonial carousel with left/right arrow navigation using Motion.dev AnimatePresence (alternatively: dot indicators or swipe gestures)

### Integration Tasks

- [X] T050 [US2] Add Success Stories, DEVMATE, Testimonials, CTA Banner, and Partners sections to `app/(marketing)/page.tsx`
- [ ] T051 [US2] Verify Stats Bar displays all 4 statistics with proper icons
- [ ] T053 [US2] Verify Testimonials carousel supports left/right navigation between cards (or alternative navigation pattern)

---

## Phase 5: User Story 3 - Contact the Company (Priority: P2)

**Story**: As a potential client, I want to easily contact Hashtag Tech for inquiries, so that I can start a conversation about my project.

**Independent Test**: Fill out and submit contact form with valid data, verify success message appears.

**Deliverable Value**: Enables lead generation and business inquiries.

### Data Model Tasks

- [ ] T053 [P] [US3] Create `types/contact-form.ts` with ContactFormSubmission interface and ContactFormSchema (Zod validation)

### Form Component Tasks

- [ ] T054 [US3] Create `components/forms/contact-form.tsx` with fields: name (required), email (required, validated), phone (optional), company (optional), service (dropdown), message (required, max 5000 chars)
- [ ] T055 [US3] Implement Zod validation on form submit with inline error display
- [ ] T056 [US3] Implement success message display on valid submission
- [ ] T057 [US3] Preserve entered data on validation failure

### API Route Tasks

- [ ] T058 [US3] Create `app/api/contact/route.ts` POST endpoint with Zod validation
- [ ] T059 [US3] Implement Brevo SDK integration in `lib/brevo.ts` for email sending
- [ ] T060 [US3] Implement error handling with proper HTTP status codes (200, 400, 500)
- [ ] T061 [US3] Add frontend error logging for contact form submission failures (NFR-009)

### Integration Tasks

- [ ] T062 [US3] Add Contact Form to appropriate page section or standalone page
- [ ] T063 [US3] Verify "GET INSTANT CALL" button in header links to contact form
- [ ] T064 [US3] Verify form submits successfully with valid data and shows success message
- [ ] T065 [US3] Verify form shows inline validation errors with invalid email

---

## Phase 6: User Story 4 - Access Company Information (Priority: P2)

**Story**: As a visitor, I want to find company location, contact details, and team information, so that I can verify legitimacy and reach out through my preferred channel.

**Independent Test**: View footer, CEO section, and Partners section, verify company information is complete.

**Deliverable Value**: Provides comprehensive company information for trust and accessibility.

### Section Component Tasks

- [ ] T066 [P] [US4] Create `components/sections/ceo-section.tsx` with photo (left), content (right), bio, social icons, consultation offer CTA
- [ ] T067 [US4] Verify Footer displays office locations (UAE, USA, Oman), email addresses, 24/7 support note
- [ ] T068 [US4] Verify Partners section displays partner photos with country flags
- [ ] T069 [US4] Verify Header navigation links work: HOME, SERVICES, TEAM, CAREER, BOOK MEETING

### Integration Tasks

- [ ] T070 [US4] Add CEO Section to `app/(marketing)/page.tsx` before Footer
- [ ] T071 [US4] Verify mobile responsive behavior for CEO Section (photo stacks above content)

---

## Phase 7: User Story 5 - Read Blog Content (Priority: P3)

**Story**: As a visitor or prospect, I want to read blog posts to learn about Hashtag Tech's expertise, so that I can evaluate their knowledge and thought leadership.

**Independent Test**: Navigate to blog page, verify posts display with excerpts, dates, and categories.

**Deliverable Value**: Demonstrates expertise and improves search visibility through content marketing.

### Data Model Tasks

- [ ] T072 [P] [US5] Create `types/blog.ts` with BlogPost interface (title, slug, excerpt, mainImage, content, author, categories, publishedAt, seoTitle, seoDescription)
- [ ] T073 [P] [US5] Create `types/author.ts` with Author interface (name, slug, image, bio)
- [ ] T074 [P] [US5] Create `types/category.ts` with Category interface (name, slug)
- [ ] T075 [P] [US5] Create sample blog post data in `data/blog-posts.ts` with at least 2 sample posts

### Page Component Tasks

- [ ] T076 [US5] Create `app/(marketing)/blog/page.tsx` blog listing page with post cards showing excerpts, dates, categories
- [ ] T077 [US5] Create `app/(marketing)/blog/[slug]/page.tsx` blog post page with full content, author info, related images, SEO metadata
- [ ] T078 [US5] Implement ISR with 60-second revalidation on both blog pages (listing and detail use same 60s cache duration)

### Integration Tasks

- [ ] T079 [US5] Add SEO metadata (title, description, Open Graph tags) to blog pages
- [ ] T080 [US5] Verify blog listing displays posts with proper formatting
- [ ] T081 [US5] Verify blog post displays full content with author info

---

## Phase 8: User Story 6 - Explore Career Opportunities (Priority: P3)

**Story**: As a job seeker, I want to view open positions and apply for jobs, so that I can join the Hashtag Tech team.

**Independent Test**: Navigate to career page, verify job postings display with titles, locations, and types.

**Deliverable Value**: Enables recruitment without blocking core business functions.

### Data Model Tasks

- [ ] T082 [P] [US6] Create `types/career.ts` with Career interface (title, slug, department, location, type, description, requirements, benefits, isActive, publishedAt)
- [ ] T083 [P] [US6] Create sample job posting data in `data/careers.ts` with at least 2 sample openings

### Page Component Tasks

- [ ] T084 [US6] Create `app/(marketing)/career/page.tsx` career listing page with active job openings showing titles, locations, types
- [ ] T085 [US6] Create `app/(marketing)/career/[slug]/page.tsx` job posting page with full description, requirements, benefits
- [ ] T086 [US6] Implement ISR with 300-second revalidation on both career pages
- [ ] T087 [US6] Filter job listings to show only `isActive: true` postings

### Integration Tasks

- [ ] T088 [US6] Add SEO metadata to career pages
- [ ] T089 [US6] Verify career listing shows only active job openings
- [ ] T090 [US6] Verify job posting displays full description, requirements, benefits

---

## Phase 9: Chat Widget (Cross-Cutting)

**Goal**: Build reusable, configurable chat widget component

### Widget Component Tasks

- [ ] T091 [P] Create `types/chat-widget.ts` with ChatWidgetConfig interface (companyName, companyLogo, primaryColor, agentName, agentAvatar, welcomeMessage)
- [ ] T092 Create `components/widgets/chat-widget.tsx` with collapsed state (two circular buttons: video call, chat)
- [ ] T093 Implement expanded modal state with Hashtag Tech branding as default (configurable via props, can be overridden to Devmate Solutions)
- [ ] T094 Implement agent message display in light blue bubbles with agent avatar
- [ ] T095 Implement "Start New Chat" button (red, full-width) using Motion.dev
- [ ] T096 Implement animations: slide up + fade in on open, slide down + fade out on close using Motion.dev
- [ ] T097 Implement `useReducedMotion` check to disable animations when preference is set
- [ ] T098 Ensure no focus trap when chat widget opens/closes (FR-068)
- [ ] T099 Load chat widget using `next/dynamic` for code splitting (FR-056)

### Integration Tasks

- [ ] T100 Add Chat Widget to `app/layout.tsx` for site-wide availability
- [ ] T101 Verify chat widget expand/collapse functionality works without JavaScript errors (SC-010)

---

## Phase 10: Homepage Assembly & Integration

**Goal**: Assemble all 13 homepage sections in correct order

### Assembly Tasks

- [ ] T102 Assemble `app/(marketing)/page.tsx` with all 13 sections in order: Header, Hero, Stats Bar, Success Stories, DEVMATE, Testimonials, AI Services, CTA Banner, Partners, Services Grid, CEO Section, Footer, Chat Widget
- [ ] T103 Implement ISR with 3600-second revalidation on homepage
- [ ] T104 Verify all sections display in correct order

---

## Phase 11: Animations & Polish

**Goal**: Add all scroll-based animations and micro-interactions

### Animation Tasks

- [ ] T105 Implement GSAP ScrollTrigger for Hero section character-by-character text reveal on page load (FR-026)
- [ ] T106 Implement GSAP ScrollTrigger for section reveals (fade in, slide up) when scrolling (FR-023, FR-030)
- [ ] T107 Implement Motion.dev hover states on all buttons (100-200ms duration)
- [ ] T108 Implement Motion.dev hover elevation on service cards
- [ ] T109 Implement Motion.dev menu transitions for mobile nav drawer (300-400ms duration)
- [ ] T110 Implement reduced motion support: disable GSAP timeline when `prefers-reduced-motion` is true
- [ ] T111 Ensure all animations respect tiered duration targets (SC-013)

### SEO Tasks

- [ ] T112 Add homepage metadata (title, description, Open Graph tags) to `app/(marketing)/page.tsx` for SC-015
- [ ] T113 Create `app/sitemap.ts` dynamic sitemap with all pages
- [ ] T114 Create `app/robots.ts` robots.txt file
- [ ] T115 Add metadata to blog pages (title, description, Open Graph tags)
- [ ] T116 Add metadata to career pages (title, description, Open Graph tags)

---

## Phase 12: Accessibility & Responsiveness

**Goal**: Ensure WCAG 2.1 AA compliance and full responsive design

### Accessibility Tasks

- [ ] T122 Verify all images have descriptive alt text (FR-061)
- [ ] T123 Verify all interactive elements are keyboard navigable (FR-062)
- [ ] T124 Add ARIA labels to all icon-only buttons (FR-063)
- [ ] T125 Verify focus states use brand-primary color and are clearly visible (FR-064)
- [ ] T126 Verify color contrast meets WCAG 2.1 AA standards (4.5:1 for text) (FR-065)
- [ ] T127 Verify semantic HTML throughout (proper heading hierarchy, landmark regions, nav elements) (FR-067)
- [ ] T128 Test with screen reader to ensure proper announcements

### Responsive Tasks

- [ ] T129 Verify mobile responsive (320px - 768px): all multi-column sections stack vertically (FR-022)
- [ ] T130 Verify tablet responsive (768px - 1024px): appropriate layouts
- [ ] T131 Verify desktop responsive (1024px - 1920px): full layouts with all features
- [ ] T132 Verify all 13 homepage sections are properly styled across all breakpoints (SC-008, SC-012)

---

## Phase 13: Quality Assurance & Performance

**Goal**: Achieve Lighthouse 90+ Performance, 100 Accessibility scores

### Performance Tasks

- [ ] T133 Verify all images use `next/image` component with proper `sizes` attribute (FR-055)
- [ ] T134 Verify WebP with PNG fallback is working automatically
- [ ] T135 Verify heavy components use `next/dynamic` for code splitting (FR-056)
- [ ] T136 Run Lighthouse audit and verify Performance score is 90+ (SC-001)
- [ ] T137 Run Lighthouse audit and verify Accessibility score is 100 (SC-002)
- [ ] T138 Verify FCP is under 1.5s, TTI is under 3s, CLS is under 0.1 (SC-003, SC-004, SC-005)

### Code Quality Tasks

- [ ] T139 Run `npm run type-check` and verify zero TypeScript errors (SC-006, NFR-003)
- [ ] T140 Run `npm run lint` and verify zero ESLint warnings (NFR-008)
- [ ] T141 Verify zero hardcoded color values in component source code (SC-014, FR-017)
- [ ] T142 Verify all forms use Zod for runtime validation (NFR-004)
- [ ] T143 Verify API routes implement proper error handling (NFR-005)
- [ ] T144 Verify environment variables are used for sensitive configuration (NFR-006)

### Testing Tasks

- [ ] T145 Test contact form with valid submission: verify success message, no console errors (SC-009)
- [ ] T146 Test contact form with invalid data: verify inline error appears
- [ ] T147 Test chat widget: verify expand/collapse, display content, no JavaScript errors (SC-010)
- [ ] T148 Test with `prefers-reduced-motion` enabled: verify animations disabled/simplified
- [ ] T149 Test with JavaScript disabled: verify core content remains accessible

---

## Phase 14: Polish & Documentation

**Goal**: Final polish before Phase 2 (Sanity CMS)

### Polish Tasks

- [ ] T150 Visual QA: Compare all sections against screenshots for pixel-perfect accuracy
- [ ] T151 Add loading states for any async operations
- [ ] T152 Add error boundaries for client components
- [ ] T153 Verify Git commit messages follow conventional commit format (NFR-007)
- [ ] T154 Create placeholder images where actual images are missing (visual indication)

### Documentation Tasks

- [ ] T155 Update `README.md` with project setup and development instructions
- [ ] T156 Document component props using JSDoc comments
- [ ] T157 Create screenshot references for visual regression testing

---

## Dependencies

### Story Completion Order

```
Setup (T001-T011)
    ↓
Foundational (T012-T023)
    ↓
    ├────→ [US1] Discover Services (T024-T035) ──────┐
    │                                               │
    ├────→ [US2] Company Credibility (T036-T052) ─┤
    │                                               │
    ├────→ [US3] Contact Form (T053-T065) ─────────┤
    │                                               │
    ├────→ [US4] Company Info (T066-T071) ─────────┼────→ Chat Widget (T091-T101) ──┐
    │                                               │                               │
    ├────→ [US5] Blog Content (T072-T081) ────────┤                               │
    │                                               │                               │
    └────→ [US6] Careers (T082-T090) ────────────┘                               │
                                                                                    │
    ─────────────────────────────────────────────────────────────┘
                           ↓
                   Homepage Assembly (T102-T104)
                           ↓
                   Animations & Polish (T105-T115)
                           ↓
               Accessibility & Responsiveness (T116-T125)
                           ↓
                 Quality Assurance (T126-T142)
                           ↓
                      Final Polish (T143-T150)
```

### Parallel Execution Opportunities

**Within US1**: T024, T025, T026, T027 (data models) can run in parallel
**Within US2**: T036, T037, T038, T039, T040, T041 (data models) can run in parallel
**Within US3**: T053 (data model) is independent
**Within US4**: T066 (CEO section) can run parallel to T067-T069 (verifications)
**Within US5**: T072, T073, T074, T075 (data models) can run in parallel
**Within US6**: T082, T083 (data model) can run in parallel

---

## Parallel Execution Examples

### Example 1: User Story 1 Data Models (Parallel)

```bash
# Terminal 1
# Create types/service.ts
- T024 [P] [US1] Create types/service.ts

# Terminal 2
# Create types/ai-service.ts
- T025 [P] [US1] Create types/ai-service.ts

# Terminal 3
# Create services data
- T026 [P] [US1] Create services sample data

# Terminal 4
# Create ai-services data
- T027 [P] [US1] Create ai-services sample data
```

### Example 2: UI Components (Parallel)

```bash
# Terminal 1
# Create button component
- T016 [P] Create components/ui/button.tsx

# Terminal 2
# Create card component
- T017 [P] Create components/ui/card.tsx

# Terminal 3
# Create input component
- T018 [P] Create components/ui/input.tsx
```

---

## MVP Scope

**Recommended MVP**: Complete **User Story 1 (Discover Services)** + **Foundational components**

**MVP Tasks**: T001-T035

**MVP Deliverable**: Homepage with Hero, Stats Bar, and Services Grid sections, fully responsive with animations.

**MVP Value**: Potential clients can immediately understand service offerings and self-qualify.

**Post-MVP**: Add User Story 2 for credibility (testimonials, stats, portfolio) to increase conversion rates.

---

## Implementation Strategy

### Incremental Delivery Approach

1. **Iteration 1 (MVP)**: Setup + US1 - Basic homepage with services
2. **Iteration 2**: US2 - Add credibility signals (testimonials, stats, portfolio)
3. **Iteration 3**: US3 - Contact form for lead capture
4. **Iteration 4**: US4 - Company information completeness
5. **Iteration 5**: US5 + US6 - Content pages (blog, careers)
6. **Iteration 6**: Polish - Animations, accessibility, performance optimization

### Risk Mitigation

- **Complex Animations**: Implement reduced-motion support first, add animations incrementally
- **Performance**: Use Lighthouse early and often to catch regressions
- **Accessibility**: Test with keyboard and screen reader from the start
- **Responsive Design**: Test on mobile viewport (320px) first, then expand to larger screens

---

## Success Criteria Verification

### Automated Checks

- [ ] `npm run type-check`: Zero TypeScript errors
- [ ] `npm run lint`: Zero ESLint warnings
- [ ] `npx lighthouse http://localhost:3000`: Performance 90+, Accessibility 100

### Manual Checks

- [ ] All 13 homepage sections visible and styled
- [ ] Mobile responsive (320px - 768px)
- [ ] Tablet responsive (768px - 1024px)
- [ ] Desktop responsive (1024px - 1920px)
- [ ] Animations smooth and respecting reduced motion
- [ ] Chat widget expand/collapse working
- [ ] Contact form validation working
- [ ] Keyboard navigation works throughout
- [ ] Color contrast passes WCAG 2.1 AA
- [ ] Zero hardcoded colors in source code

---

## Phase 15: Sanity CMS Integration (Deferred)

**Goal**: Replace hardcoded data with Sanity CMS-managed content

**Status**: DEFERRED until Phase 1 is complete and verified

### Sanity Setup Tasks

- [ ] S001 Install Sanity CMS: `npm install sanity next-sanity`
- [ ] S002 Initialize Sanity Studio: `npx sanity@latest init`
- [ ] S003 Create environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`
- [ ] S004 Create `sanity/schemaTypes/postType.ts` for blog posts (FR-031)
- [ ] S005 Create `sanity/schemaTypes/careerType.ts` for job openings (FR-032)
- [ ] S006 Create `sanity/schemaTypes/authorType.ts` for authors (FR-033)
- [ ] S007 Create `sanity/schemaTypes/categoryType.ts` for categories (FR-034)
- [ ] S008 Create `sanity/schemaTypes/serviceType.ts` for services (FR-035)
- [ ] S009 Create `sanity/schemaTypes/aiServiceType.ts` for AI services (FR-036)

### API Route Tasks (Sanity)

- [ ] S010 Create `lib/sanity/client.ts` with Sanity client configuration
- [ ] S011 Create `app/api/posts/route.ts` with ISR 60s revalidation (FR-037)
- [ ] S012 Create `app/api/posts/[slug]/route.ts` with ISR 60s revalidation (FR-038)
- [ ] S013 Create `app/api/careers/route.ts` with ISR 300s revalidation (FR-039)
- [ ] S014 Create `app/api/careers/[slug]/route.ts` with ISR 300s revalidation (FR-040)
- [ ] S015 Create `app/api/services/route.ts` with ISR 3600s revalidation (FR-041)
- [ ] S016 Create `app/api/services/[slug]/route.ts` with ISR 3600s revalidation (FR-042)
- [ ] S017 Create `app/api/ai-services/route.ts` with ISR 3600s revalidation (FR-043)

### Migration Tasks

- [ ] S018 Update blog pages to fetch from `/api/posts` instead of hardcoded data
- [ ] S019 Update career pages to fetch from `/api/careers` instead of hardcoded data
- [ ] S020 Update Services Grid section to fetch from `/api/services` instead of hardcoded data
- [ ] S021 Update AI Services section to fetch from `/api/ai-services` instead of hardcoded data
- [ ] S021 Remove hardcoded data constants after verification
- [ ] S022 Verify all pages load correctly with Sanity CMS data
- [ ] S023 Test ISR revalidation: verify content updates after revalidation time

---

## Task Count Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1: Setup | 11 | Project initialization and configuration |
| Phase 2: Foundational | 12 | Utilities, hooks, UI components, layout components |
| Phase 3: US1 - Services | 8 | Services data models and section components |
| Phase 4: US2 - Credibility | 14 | Testimonials, partners, stats, related sections |
| Phase 5: US3 - Contact | 13 | Contact form and API integration |
| Phase 6: US4 - Company Info | 5 | CEO section and company info verifications |
| Phase 7: US5 - Blog | 6 | Blog pages and content display |
| Phase 8: US6 - Careers | 5 | Career pages and job postings |
| Phase 9: Chat Widget | 11 | Reusable chat widget component |
| Phase 10: Homepage | 3 | Assemble all homepage sections |
| Phase 11: Animations | 7 | Scroll animations and micro-interactions |
| Phase 12: Accessibility | 13 | WCAG compliance and responsive design |
| Phase 13: Quality Assurance | 17 | Performance, testing, code quality |
| Phase 14: Polish | 8 | Final polish and documentation |
| **Phase 1 Total** | **152** | **Hardcoded data implementation** |
| Phase 15: Sanity CMS | 23 | CMS integration (deferred) |
| **Grand Total** | **175** | **All tasks** |

---

## Notes

- **Task Format**: All tasks follow the strict checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
- **Parallel Tasks**: Tasks marked `[P]` can be executed in parallel (different files, no dependencies)
- **Story Labels**: Tasks marked `[US1]`, `[US2]`, etc. map to User Stories 1-6 from the spec
- **Dependencies**: Complete Setup and Foundational phases before starting user story phases
- **Testing**: No test tasks included - add testing tasks if TDD approach is requested
- **Phase 2**: Sanity CMS integration tasks are deferred until Phase 1 is complete

---

**Last Updated**: 2026-02-02
**Status**: Ready for implementation
