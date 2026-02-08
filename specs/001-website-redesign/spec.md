# Feature Specification: Hashtag Tech Website Redesign

**Feature Branch**: `001-website-redesign`
**Created**: 2026-02-02
**Status**: Draft
**Input**: User description: "Build a pixel-perfect recreation of the Hashtag Tech website (hashtagstech.com) using Next.js 14+ App Router with TypeScript, Tailwind CSS, and Sanity CMS integration. The website serves as an AI-powered software development agency showcasing services, team, portfolio, and blog content."

## Assumptions

1. **Two-Phase Implementation**:
   - **Phase 1**: All content uses sample/hardcoded data in components. This includes homepage sections, Services, Testimonials, Success Stories, Team, Blog listings, and Careers. Focus on UI, animations, responsiveness, and accessibility.
   - **Phase 2**: After Phase 1 completion, integrate Sanity CMS to replace hardcoded data with dynamic content.
2. **Email Integration**: Contact form will use **Brevo** (formerly SendinBlue) as the email service provider. API route will be prepared for Brevo SDK integration with API keys stored in environment variables
3. **Image Assets**: Placeholder references will be used where actual images are not yet provided (e.g., {HERO_ILLUSTRATION}, {CHESS_ILLUSTRATION})
4. **Animation Performance**: All animations will respect `prefers-reduced-motion` user preference for accessibility
5. **Responsive Breakpoints**: Mobile-first approach with support for 320px - 1920px screen widths
6. **Lighthouse Targets**: Performance 90+, Accessibility 100 scores as non-negotiable requirements

## Clarifications

### Session 2026-02-02
- Q: Which email service provider should be prepared for contact form integration? → A: Brevo (formerly SendinBlue)
- Q: What are the acceptable duration targets for different animation categories? → A: Tiered: Hover 100-200ms, Page transitions 300-400ms, Scroll reveals 500-800ms
- Q: What error/issue signals should be logged from the frontend? → A: Essential errors only: Console errors, Contact form failures, API errors
- Q: How should the Chat Widget be implemented regarding reusability? → A: Reusable component with configuration props for branding, colors, messages
- Q: What image format strategy should be used for Phase 1 sample images? → A: WebP with PNG fallback (Next.js Image automatic)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover Services (Priority: P1)

As a **potential client**, I want to **browse the website and understand what services are offered**, so that I can determine if Hashtag Tech can help with my project.

**Why this priority**: This is the primary user journey - without clear service information, potential clients cannot convert. This is the core business value of the website.

**Independent Test**: Can be tested by navigating to the homepage and verifying that all service categories are visible and understandable. Delivers value by enabling potential clients to self-qualify.

**Acceptance Scenarios**:

1. **Given** a visitor is on the homepage, **When** they scroll to the Services section, **Then** they see 3 service columns (Web Development, Social Media Marketing, App Development) with clear descriptions
2. **Given** a visitor is viewing services, **When** they hover over any service column, **Then** they see visual feedback (elevation/shadow change) indicating interactivity
3. **Given** a visitor wants to learn more, **When** they click "Get Started" on any service, **Then** they see a clear call-to-action for contact/booking
4. **Given** a visitor is on mobile, **When** they view the Services section, **Then** the 3 columns stack vertically for readability

### User Story 2 - View Company Credibility (Priority: P1)

As a **potential client**, I want to **see social proof through testimonials and portfolio**, so that I can trust Hashtag Tech with my project.

**Why this priority**: Trust signals are essential for conversion. Without proof of capability and client satisfaction, visitors will not engage. This is critical for business credibility.

**Independent Test**: Can be tested by viewing the Success Stories and Testimonials sections. Delivers value by providing evidence of past work and client satisfaction.

**Acceptance Scenarios**:

1. **Given** a visitor is on the homepage, **When** they reach the Success Stories section, **Then** they see a client list (Procope AI US, Finaxe GB, etc.) and featured project preview
2. **Given** a visitor is viewing testimonials, **When** they look at the Testimonials section, **Then** they see at least one client testimonial with 5-star rating, quote, and person details
3. **Given** a visitor wants to see more work, **When** they click "MORE WORKS", **Then** they see navigation to additional portfolio items or contact prompt
4. **Given** a visitor is viewing Stats Bar, **When** they scroll to that section, **Then** they see company stats (Since 2019, 40+ Global Brands, 25+ Industries, 96% Rating)

### User Story 3 - Contact the Company (Priority: P2)

As a **potential client**, I want to **easily contact Hashtag Tech for inquiries**, so that I can start a conversation about my project.

**Why this priority**: While important for conversion, users typically contact after understanding services and credibility. This depends on Stories 1 and 2 being complete first.

**Independent Test**: Can be tested by filling out and submitting the contact form. Delivers value by enabling lead generation and business inquiries.

**Acceptance Scenarios**:

1. **Given** a visitor wants to make an inquiry, **When** they access the contact form, **Then** they see fields for name, email, phone (optional), company (optional), service selection, and message
2. **Given** a visitor submits the form with valid data, **When** they click submit, **Then** they see a success confirmation message
3. **Given** a visitor submits invalid data (e.g., invalid email), **When** they click submit, **Then** they see inline validation errors explaining what to fix
4. **Given** a visitor on mobile wants to contact, **When** they click "GET INSTANT CALL" in header or chat widget, **Then** they see appropriate contact options

### User Story 4 - Access Company Information (Priority: P2)

As a **visitor**, I want to **find company location, contact details, and team information**, so that I can verify legitimacy and reach out through my preferred channel.

**Why this priority**: Important for trust and accessibility but secondary to core service discovery. Users typically seek this after initial interest is established.

**Independent Test**: Can be tested by viewing footer, partners section, and CEO section. Delivers value by providing comprehensive company information.

**Acceptance Scenarios**:

1. **Given** a visitor wants company contact info, **When** they scroll to the footer, **Then** they see office locations (UAE, USA, Oman), email, and 24/7 support note
2. **Given** a visitor wants to see the team/leadership, **When** they view the CEO section, **Then** they see CEO name, photo, bio, social links, and consultation offer
3. **Given** a visitor wants to see global presence, **When** they view the Partners section, **Then** they see partner photos with country flags indicating global operations
4. **Given** a visitor wants quick navigation, **When** they use the header, **Then** they see links to HOME, SERVICES, TEAM, CAREER, and BOOK MEETING

### User Story 5 - Read Blog Content (Priority: P3)

As a **visitor or prospect**, I want to **read blog posts to learn about Hashtag Tech's expertise**, so that I can evaluate their knowledge and thought leadership.

**Why this priority**: Content marketing is valuable for SEO and thought leadership but not critical for immediate conversion. This enhances the site but doesn't block the core user journey.

**Independent Test**: Can be tested by navigating to the blog section and reading blog posts. Delivers value by demonstrating expertise and improving search visibility.

**Acceptance Scenarios**:

1. **Given** a visitor wants to read content, **When** they navigate to the blog page, **Then** they see a list of blog posts with excerpts, dates, and categories
2. **Given** a visitor clicks a blog post, **When** the post loads, **Then** they see the full content with author info, related images, and proper formatting
3. **Given** a blog post is stale content, **When** 1 hour passes since last cache, **Then** the system refreshes the content automatically via ISR
4. **Given** a visitor wants to share a post, **When** they view a blog post, **Then** they see appropriate SEO metadata for social sharing

### User Story 6 - Explore Career Opportunities (Priority: P3)

As a **job seeker**, I want to **view open positions and apply for jobs**, so that I can join the Hashtag Tech team.

**Why this priority**: Important for hiring but secondary to client acquisition. The site's primary purpose is client conversion, with careers as a secondary audience.

**Independent Test**: Can be tested by navigating to the career page and viewing job postings. Delivers value by enabling recruitment without blocking core business functions.

**Acceptance Scenarios**:

1. **Given** a job seeker visits the site, **When** they navigate to the Career page, **Then** they see a list of active job openings with titles, locations, and types
2. **Given** a job seeker clicks a job posting, **When** the job details load, **Then** they see the full description, requirements, benefits, and application information
3. **Given** a job posting is no longer active, **When** an admin marks it inactive, **Then** it no longer appears in the career listing
4. **Given** career content is updated, **When** 30 minutes pass since last cache, **Then** the system refreshes the content automatically via ISR

### Edge Cases

- **What happens when** a user with `prefers-reduced-motion` enabled views the site?
  - All scroll-based animations (GSAP) should be disabled or reduced to simple fades
  - Micro-interactions (hover states) should use CSS transitions only, no JS-driven animations
  - Chat widget should still function but without entrance/exit animations

- **What happens when** Sanity CMS is temporarily unavailable?
  - Blog and Career pages should serve stale cached content with appropriate revalidation
  - Fallback UI should indicate "Content temporarily unavailable" with retry option
  - Homepage static sections should remain unaffected

- **What happens when** JavaScript is disabled or fails to load?
  - Core content should remain accessible (semantic HTML ensures readability)
  - Navigation should work via anchor links
  - Contact form should degrade to standard HTML form submission
  - Chat widget may be hidden (progressive enhancement)

- **What happens when** image assets fail to load (placeholders or broken URLs)?
  - Alt text should be displayed for all images
  - Layout should not break (use proper aspect ratios and sizing)
  - Background images should have fallback colors
  - Placeholder images should have visual indication they are temporary

- **What happens when** a user submits the contact form with an unusually large message?
  - Form should validate maximum length (e.g., 5000 characters)
  - Clear error message should indicate character limit exceeded
  - Form should preserve entered data on validation failure

## Requirements *(mandatory)*

### Functional Requirements

#### Homepage & Layout
- **FR-001**: Homepage MUST display all 13 sections in specified order: Navigation Header, Hero, Stats Bar, Success Stories, DEVMATE, Testimonials, AI Services, CTA Banner, Partners, Services Grid, CEO Section, Footer, Chat Widget
- **FR-002**: Header MUST remain sticky on scroll with shadow appearing after initial scroll position
- **FR-003**: Header MUST include navigation links: HOME, SERVICES, TEAM, CAREER, BOOK MEETING, and GET INSTANT CALL CTA button
- **FR-004**: Header MUST provide mobile hamburger menu with slide-in drawer for screens below 768px width
- **FR-005**: Hero section MUST display two-column layout (60% text, 40% illustration) with subtext, headline with red accent word, and CTA button
- **FR-006**: Stats Bar MUST display full-width banner with 4 columns of checkmarks and statistics
- **FR-007**: Success Stories section MUST display client list (left) and portfolio preview (right) with carousel/marquee functionality
- **FR-008**: DEVMATE section MUST display chess illustration (left) and feature list with checkmarks (right)
- **FR-009**: Testimonials section MUST use dark background with at least one testimonial card showing 5-star rating, quote, and person details. **NOTE: This is the ONLY section with a dark background; all other sections use light backgrounds.**
- **FR-010**: AI Services section MUST display 3-column card grid with numbered badges (01, 02, 03) and feature bullet points
- **FR-011**: CTA Banner section MUST display chess knight illustration, headline, subtext, and GET CALL NOW button
- **FR-012**: Partners section MUST display grid of partner photos with country flag overlays
- **FR-013**: Services Grid section MUST display 3 columns (Web Development, Social Media Marketing, App Development) with appropriate button styles (primary center, secondary sides)
- **FR-014**: CEO section MUST display photo (left) and content (right) including bio, social icons, and consultation offer
- **FR-015**: Footer MUST display two columns (Get In Touch, Quick Links) with social links and copyright bar
- **FR-016**: Chat Widget MUST display as collapsed (two circular buttons) in bottom-right corner and expand to modal on click

#### Design & Styling
- **FR-017**: All colors MUST use CSS variables defined in globals.css (no hardcoded hex values in components)
- **FR-018**: Brand primary color MUST be Coral Red (#F26B6B / rgb(242 107 107)) with proper hover states
- **FR-019**: Typography MUST use Inter or Outfit font family with specified weights for H1 (700 Bold, 48-64px), H2 (700 Bold, 36-42px), H3 (600 SemiBold, 24-28px), Body (400 Regular, 16-18px)
- **FR-020**: Red accent pattern MUST be applied to specific words in headings (e.g., "AI Powered Agency **Application**")
- **FR-021**: All sections MUST be fully responsive from 320px to 1920px screen widths
- **FR-022**: Mobile layout MUST stack multi-column sections vertically for readability

#### Animations & Interactions
- **FR-023**: GSAP ScrollTrigger MUST be used for section reveals, parallax effects, and stats counter animations
- **FR-024**: Motion.dev (Framer Motion) MUST be used for button hover/tap states, card hover elevations, menu transitions
- **FR-025**: All animations MUST respect `prefers-reduced-motion` user preference
- **FR-026**: Hero text MUST reveal with character-by-character animation on page load
- **FR-027**: Stats counters MUST animate from 0 to target value when scrolled into view
- **FR-028**: Success Stories client names MUST auto-scroll in marquee format
- **FR-029**: Testimonials carousel MUST support left/right navigation between testimonial cards
- **FR-030**: Service cards MUST stagger entrance animation on scroll with hover elevation effect

#### Content Management (Sanity CMS)
- **FR-031**: Sanity CMS MUST provide schema for Blog Posts with fields: title, slug, excerpt, mainImage, content, author, categories, publishedAt, seoTitle, seoDescription
- **FR-032**: Sanity CMS MUST provide schema for Career/Job Postings with fields: title, slug, department, location, type, description, requirements, benefits, isActive, publishedAt
- **FR-033**: Sanity CMS MUST provide schema for Authors with fields: name, slug, image, bio
- **FR-034**: Sanity CMS MUST provide schema for Categories with name and slug
- **FR-035**: Sanity CMS MUST provide schema for Services with fields: title, slug, category, shortDescription, icon, features, content, ctaText, ctaStyle, order, isFeatured, seoTitle, seoDescription
- **FR-036**: Sanity CMS MUST provide schema for AI Services with fields: title, slug, number, shortDescription, features, content, order, isActive

#### API Routes & Data
- **FR-037**: GET /api/posts MUST return list of all blog posts with ISR revalidation of 3600 seconds (1 hour)
- **FR-038**: GET /api/posts/[slug] MUST return single blog post with metadata
- **FR-039**: GET /api/careers MUST return list of active job openings with ISR revalidation of 1800 seconds (30 minutes)
- **FR-040**: GET /api/careers/[slug] MUST return single job posting
- **FR-041**: GET /api/services MUST return list of services ordered by display order for homepage grid
- **FR-042**: GET /api/services/[slug] MUST return single service page content
- **FR-043**: GET /api/ai-services MUST return list of AI services for AI section
- **FR-044**: POST /api/contact MUST accept form submission with validation and prepare for email service integration (Brevo/SendGrid)

#### Contact Form
- **FR-045**: Contact form MUST accept fields: name (required), email (required, validated), phone (optional), company (optional), service (dropdown: web-development, mobile-app, ai-agents, marketing, other), message (required)
- **FR-046**: Contact form MUST validate email format using Zod schema before submission
- **FR-047**: Contact form MUST display success message on valid submission
- **FR-048**: Contact form MUST display inline validation errors on invalid input
- **FR-049**: Contact form API route MUST use Brevo SDK for email delivery with proper error handling for API failures

#### Chat Widget
- **FR-050**: Chat widget MUST display collapsed state with two circular buttons (video call, chat) in bottom-right corner
- **FR-051**: Chat widget MUST expand to modal on click and accept configuration props for branding (company name, logo, colors)
- **FR-052**: Chat widget MUST display agent messages in light blue bubbles with agent avatar
- **FR-053**: Chat widget MUST include "Start New Chat" button (red, full-width)
- **FR-054**: Chat widget animations MUST use slide up + fade in on open, slide down + fade out on close
- **FR-055**: Chat widget MUST be implemented as a reusable component with props for customization (branding, theme colors, messages)

#### Performance & Technical
- **FR-055**: All images MUST use next/image component with proper sizes attribute and automatic WebP format with PNG/JPEG fallback
- **FR-056**: Heavy components (GSAP, chat widget) MUST use next/dynamic for code splitting
- **FR-057**: Homepage MUST use ISR with revalidation of 3600 seconds (1 hour)
- **FR-058**: Blog listing and posts MUST use ISR with revalidation of 3600 seconds (1 hour)
- **FR-059**: Career pages MUST use ISR with revalidation of 1800 seconds (30 minutes)
- **FR-060**: Services and Team pages MUST use ISR with revalidation of 3600 seconds (1 hour) and 86400 seconds (24 hours) respectively
- **FR-061**: Server Components MUST be used by default (only add "use client" when necessary)
- **FR-062**: Centralized query utilities with React cache() MUST be used for all Sanity CMS data fetching to enable automatic deduplication across render passes

#### Accessibility
- **FR-063**: All images MUST have descriptive alt text
- **FR-064**: All interactive elements MUST be keyboard navigable
- **FR-065**: Icon-only buttons MUST include ARIA labels
- **FR-066**: Focus states MUST use brand primary color (--ring) and be clearly visible
- **FR-067**: Color contrast MUST meet WCAG 2.1 AA standards (4.5:1 minimum for text)
- **FR-068**: Reduced motion support MUST be implemented via `prefers-reduced-motion` media query
- **FR-069**: Semantic HTML MUST be used throughout (proper heading hierarchy, landmark regions, nav elements)
- **FR-070**: Focus MUST NOT be trapped when chat widget opens/closes

### Key Entities *(include if feature involves data)*

- **BlogPost**: Content article with title, slug, excerpt, main image, rich text content, author reference, category references, publication date, SEO metadata
- **Author**: Content creator with name, slug, image, bio
- **Category**: Content classification with name and slug
- **Career**: Job opening with title, slug, department (Engineering, Design, Marketing, Sales, Operations), location, employment type (Full-time, Part-time, Contract, Remote), description (rich text), requirements (array of strings), benefits (array of strings), active status, publication date
- **Service**: Service offering with title, slug, category (web-development, app-development, social-media-marketing, ai-services), short description, icon image, features (array of bullet points), rich text content, CTA text, CTA style (primary/secondary), display order, featured flag, SEO metadata
- **AIService**: AI service offering with title, slug, display number (01, 02, 03), short description, features (array of bullet points), rich text content, display order, active status
- **ContactFormSubmission**: User inquiry with name, email, phone (optional), company (optional), service interest (web-development, mobile-app, ai-agents, marketing, other), message content, timestamp

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Lighthouse Performance Score MUST be 90 or higher on all pages (measured by Lighthouse audit)
- **SC-002**: Lighthouse Accessibility Score MUST be 100 on all pages (measured by Lighthouse audit)
- **SC-003**: First Contentful Paint (FCP) MUST be under 1.5 seconds on 4G connection
- **SC-004**: Time to Interactive (TTI) MUST be under 3 seconds on 4G connection
- **SC-005**: Cumulative Layout Shift (CLS) MUST be under 0.1 across all user journeys
- **SC-006**: Zero TypeScript compilation errors MUST be present in production build
- **SC-007**: Zero accessibility violations MUST be present (automated testing)
- **SC-008**: All 13 homepage sections MUST be visually present and properly styled (manual visual QA)
- **SC-009**: Contact form MUST successfully accept and validate submissions without console errors
- **SC-010**: Chat widget MUST be functional (expand/collapse, display content) without JavaScript errors
- **SC-011**: Blog and Career pages MUST load content from Sanity CMS with appropriate ISR caching
- **SC-012**: Site MUST be fully functional on mobile devices (320px - 768px viewport widths)
- **SC-013**: All animations MUST follow tiered duration targets: Hover/Tap states 100-200ms, Page transitions (modals, drawers) 300-400ms, Scroll-based reveals 500-800ms, while respecting user motion preferences
- **SC-014**: Zero hardcoded color values MUST be present in component source code (all use CSS variables)
- **SC-015**: SEO metadata MUST be present on all pages (title, description, Open Graph tags)

### Non-Functional Requirements

- **NFR-001**: Code MUST follow SOLID principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion)
- **NFR-002**: Code MUST follow DRY principle (no duplication across components, hooks, utilities, types)
- **NFR-003**: TypeScript strict mode MUST be enabled with no `any` types allowed
- **NFR-004**: All forms MUST use Zod for runtime validation
- **NFR-005**: All API routes MUST implement proper error handling with appropriate HTTP status codes
- **NFR-006**: Environment variables MUST be used for sensitive configuration (no hardcoded secrets)
- **NFR-007**: Git commit messages MUST follow conventional commit format
- **NFR-008**: Pre-commit checks MUST pass (lint, type-check, test) before merge
- **NFR-009**: Frontend MUST log essential errors: console errors, contact form submission failures, and API route errors with appropriate context (error message, component name, user action)
